import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  Activity,
  FileText,
  Users,
  Trash2,
  X,
} from "lucide-react";
import api, { deletePatient } from "../services/api";

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");
        setPatients(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const openDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setSelectedPatient(null);
  };

  const confirmDelete = async () => {
    if (!selectedPatient) return;

    setDeleting(true);
    try {
      await deletePatient(selectedPatient.id);
      setPatients((prev) =>
        prev.filter((p) => p.id !== selectedPatient.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error?.message ||
          "Failed to delete patient."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Patients</h1>

          <div className="flex gap-3">
            <Link
              to="/"
              className="bg-gray-500 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-600"
            >
              ← Back to Dashboard
            </Link>

            <Link
              to="/patients/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus size={18} /> Register Patient
            </Link>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or patient code..."
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <p className="text-center text-gray-600">Loading patients...</p>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center items-center py-20 text-gray-600"
          >
            <Users size={70} className="text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Patients Found</h2>
            <p className="text-center max-w-sm">
              {patients.length === 0
                ? "There are no registered patients yet."
                : "No patient matches your search."}
            </p>

            <Link
              to="/patients/register"
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus size={18} /> Register Patient
            </Link>
          </motion.div>
        )}

        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur shadow-xl rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-4 font-semibold text-left">#</th>
                    <th className="p-4 font-semibold text-left">Patient Code</th>
                    <th className="p-4 font-semibold text-left">Full Name</th>
                    <th className="p-4 font-semibold text-left">Age</th>
                    <th className="p-4 font-semibold text-left">Gender</th>
                    <th className="p-4 font-semibold text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((patient, index) => (
                    <tr key={patient.id} className="hover:bg-blue-50 transition">
                      <td className="p-4 align-middle">{index + 1}</td>
                      <td className="p-4 font-medium text-blue-700 align-middle">
                        {patient.patientCode}
                      </td>
                      <td className="p-4 font-medium align-middle">
                        {patient.fullName}
                      </td>
                      <td className="p-4 align-middle">{patient.age}</td>
                      <td className="p-4 capitalize align-middle">
                        {patient.gender}
                      </td>
                      <td className="p-4 align-middle whitespace-nowrap">
                        <div className="flex gap-2 items-center">
                          <Link
                            to={`/diagnosis/start/${patient.id}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-700 text-xs md:text-sm"
                          >
                            <Activity size={16} /> Diagnose
                          </Link>

                          <Link
                            to={`/reports/${patient.id}`}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-yellow-600 text-xs md:text-sm"
                          >
                            <FileText size={16} /> Reports
                          </Link>

                          <button
                            onClick={() => openDeleteModal(patient)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-700 text-xs md:text-sm"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Confirm Delete
                </h2>
                <button onClick={closeDeleteModal}>
                  <X className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedPatient?.fullName}
                </span>
                ?<br />
                <span className="text-red-600 font-medium">
                  This will permanently delete all related records.
                </span>
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
