import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FileText, ArrowLeft, Printer } from "lucide-react";

import { getPatientById, getReportByPatient } from "../services/api";

const ReportsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const p = await getPatientById(patientId);
        setPatient(p.data);

        const r = await getReportByPatient(patientId);
        setReports(r.data);
      } catch (err) {
        toast.error("Failed to load patient reports");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  /** CLEAN & STANDARDIZE THE REPORT TEXT **/
  const formatReport = (text) => {
    if (!text) return "";

    // Remove Patient ID & Diagnosis ID lines
    let cleaned = text
      .replace(/Patient ID:.+\n?/gi, "")
      .replace(/Diagnosis ID:.+\n?/gi, "");

    // Replace symptoms bullet points and spacing
    cleaned = cleaned.replace(/\n\s*/g, "<br/>").replace(/•/g, "• ");

    return cleaned.trim();
  };

  /** PRINT FUNCTION **/
  const printReport = (fullReport) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; }
            h2 { margin-bottom: 5px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin-top: 20px; }
            .label { font-weight: bold; }
            .report-box { margin-top: 20px; padding: 15px; border: 1px solid #aaa; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Medical TB Screening Report</h2>
            <p>${patient?.fullName} — ${patient?.patientCode}</p>
          </div>

          <div class="section">
            <p><span class="label">Age:</span> ${patient?.age}</p>
            <p><span class="label">Gender:</span> ${patient?.gender}</p>
            <p><span class="label">Phone:</span> ${patient?.phone}</p>
          </div>

          <div class="section report-box">
            ${fullReport}
          </div>

          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <>
      <ToastContainer autoClose={3500} theme="colored" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white p-6 flex justify-center">
        <div className="w-full max-w-4xl">

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden"
          >

            {/* TOP BAR */}
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
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Patient Report</h2>
                  <p className="text-xs text-gray-500">Printable medical report</p>
                </div>
              </div>
            </div>

            {/* PATIENT INFO */}
            <div className="p-6">
              {loading ? (
                <div className="text-center text-gray-600 py-4">Loading...</div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
                  <div className="text-lg font-semibold text-gray-800">
                    {patient?.fullName}
                  </div>
                  <div className="text-sm text-gray-700">
                    Code: {patient?.patientCode}
                  </div>
                  <div className="text-sm text-gray-700">
                    Age: {patient?.age} • Gender: {patient?.gender}
                  </div>
                  <div className="text-sm text-gray-700">{patient?.phone}</div>
                </div>
              )}
            </div>

            {/* REPORT LIST */}
            <div className="p-6">
              {reports.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No reports found for this patient.
                </div>
              ) : (
                <div className="grid gap-4">
                  {reports.map((r) => {
                    const cleaned = formatReport(r.reportText);

                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-semibold text-gray-800">Medical Report</div>
                          <div className="text-xs text-gray-500">
                            {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div
                          className="text-gray-700 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: cleaned }}
                        />

                        {/* PRINT BUTTON */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => printReport(cleaned)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
                          >
                            <Printer size={18} />
                            Print Report
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
