import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, UserPlus, Activity, FileText, Users } from "lucide-react";
import api from "../services/api";

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
              className="bg-gray-500 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-600 flex items-center gap-2"
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

        {loading && <p className="text-center text-gray-600">Loading patients...</p>}

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
                ? "There are no registered patients yet. Start by adding a new patient."
                : "No patient matches your search. Try another name or patient code."}
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
                    <th className="p-4 font-semibold">#</th>
                    <th className="p-4 font-semibold">Patient Code</th>
                    <th className="p-4 font-semibold">Full Name</th>
                    <th className="p-4 font-semibold">Age</th>
                    <th className="p-4 font-semibold">Gender</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Phone</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Address</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((patient, index) => (
                    <tr key={patient.id} className="hover:bg-blue-50 transition">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-medium text-blue-700">{patient.patientCode}</td>
                      <td className="p-4 font-medium">{patient.fullName}</td>
                      <td className="p-4">{patient.age}</td>
                      <td className="p-4 capitalize">{patient.gender}</td>
                      <td className="p-4 hidden md:table-cell">{patient.phone}</td>
                      <td className="p-4 hidden md:table-cell">{patient.address}</td>
                      <td className="p-4 flex gap-2 flex-wrap">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
