import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Stethoscope, Check, X, ArrowLeft } from "lucide-react";

import {
  getPatientById,
  createDiagnosis,
  generateReport,
} from "../services/api";

const QUESTIONS = [
  { key: "cough2Weeks", label: "Has the patient been coughing for more than 2 weeks?" },
  { key: "nightSweat", label: "Does the patient experience night sweats?" },
  { key: "weightLoss", label: "Has the patient experienced weight loss?" },
  { key: "fever", label: "Does the patient have fever?" },
  { key: "chestPain", label: "Is the patient having chest pain?" },
  { key: "bloodInSputum", label: "Is there blood in the patient's sputum?" },
  { key: "fatigue", label: "Is the patient experiencing fatigue?" },
  { key: "contactWithTb", label: "Has the patient been in contact with a TB patient?" },
];

const DiagnosisWizard = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  const [answers, setAnswers] = useState({
    cough2Weeks: false,
    nightSweat: false,
    weightLoss: false,
    fever: false,
    chestPain: false,
    bloodInSputum: false,
    fatigue: false,
    contactWithTb: false,
  });

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // ---------------- LOAD PATIENT ----------------
  useEffect(() => {
    const loadPatient = async () => {
      try {
        const res = await getPatientById(patientId);
        setPatient(res.data);
      } catch {
        toast.error("Failed to load patient details.");
      } finally {
        setLoadingPatient(false);
      }
    };

    loadPatient();
  }, [patientId]);

  const answer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: !!value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length)), 120);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  // ---------------- SUBMIT DIAGNOSIS + GENERATE REPORT ----------------
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // 1️⃣ Create diagnosis
      const payload = { patientId, ...answers };
      const diagnosisRes = await createDiagnosis(payload);
      const diagnosisId = diagnosisRes.data.id;

      toast.success("Diagnosis created!");

      // 2️⃣ Generate report
      const reportRes = await generateReport({ diagnosisId });

      toast.success(reportRes.message || "Report generated successfully");

      // 3️⃣ Redirect to reports page
      setTimeout(() => {
        navigate(`/reports/${patientId}`);
      }, 900);

    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        "Failed to submit diagnosis / generate report";
      toast.error(msg);

      setSubmitting(false);
    }
  };

  const progressPct = Math.round(
    (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} theme="colored" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white p-6 flex items-start justify-center">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100"
          >
            {/* Top Bar */}
            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Stethoscope size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    TB Screening
                  </h2>
                  <p className="text-xs text-gray-500">Diagnosis Wizard</p>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="p-6">
              {loadingPatient ? (
                <div className="text-center py-6 text-gray-600">
                  Loading patient...
                </div>
              ) : patient ? (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
                  <div className="text-lg font-semibold text-gray-800">
                    {patient.fullName}
                  </div>
                  <div className="text-sm text-gray-700">
                    Code: {patient.patientCode}
                  </div>
                  <div className="text-sm text-gray-700">
                    Age: {patient.age} • Gender: {patient.gender}
                  </div>
                  <div className="text-sm text-gray-700">{patient.phone}</div>
                </div>
              ) : (
                <div className="text-center text-gray-600">Patient not found</div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="px-6 mb-4">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <div>
                  {Math.min(step, QUESTIONS.length)}/{QUESTIONS.length}
                </div>
                <div>{progressPct}%</div>
              </div>
            </div>

            {/* Questions or Summary */}
            <div className="p-6">
              {step < QUESTIONS.length ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="text-sm text-gray-500 mb-2">
                    Question {step + 1} of {QUESTIONS.length}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {QUESTIONS[step].label}
                  </h3>

                  <div className="flex gap-3 flex-col sm:flex-row">
                    {/* YES */}
                    <button
                      onClick={() => answer(QUESTIONS[step].key, true)}
                      className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition ${
                        answers[QUESTIONS[step].key]
                          ? "bg-green-300 text-green-800 shadow"
                          : "bg-green-200 text-green-700 hover:bg-green-300"
                      }`}
                    >
                      <Check size={18} /> Yes
                    </button>

                    {/* NO */}
                    <button
                      onClick={() => answer(QUESTIONS[step].key, false)}
                      className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition ${
                        answers[QUESTIONS[step].key] === false
                          ? "bg-red-300 text-red-800 shadow"
                          : "bg-red-200 text-red-700 hover:bg-red-300"
                      }`}
                    >
                      <X size={18} /> No
                    </button>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={goBack}
                      disabled={step === 0}
                      className="text-sm text-gray-600 disabled:opacity-50"
                    >
                      ← Back
                    </button>

                    <div className="text-sm text-gray-500">
                      You can review all answers later
                    </div>
                  </div>
                </motion.div>
              ) : (
                // -------- SUMMARY --------
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Review Answers
                  </h3>

                  <div className="grid gap-3">
                    {QUESTIONS.map((q) => (
                      <div
                        key={q.key}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex justify-between"
                      >
                        <span className="text-sm text-gray-700">{q.label}</span>
                        <span
                          className={`font-semibold ${
                            answers[q.key]
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {answers[q.key] ? "Yes" : "No"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setStep(0)}
                      className="py-3 rounded-xl border border-gray-300 text-gray-700 font-medium"
                    >
                      Edit Answers
                    </button>

                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="py-3 rounded-xl border border-gray-300 text-gray-700 font-medium"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
                    >
                      {submitting ? "Submitting..." : "Submit Diagnosis"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DiagnosisWizard;
