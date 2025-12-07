import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MedicalVector from "../assets/medical-vector.png";

export default function RegisterPatient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await api.post("/patients", formData);

      setSuccess(true);
      toast.success("Patient registered successfully!");

      setTimeout(() => {
        navigate(`/patients`);
      }, 800);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || "Failed to register patient.";
      toast.error(msg);
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white flex items-center justify-center py-16 px-4 transition-all duration-500">
        <div
          className={`bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 ${
            success ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center">
            <img src={MedicalVector} alt="Medical" className="w-4/5 h-auto" />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12">

            {/* BACK TO DASHBOARD BUTTON */}
            <div className="mb-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition flex items-center gap-2 text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
              Register New Patient
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 text-sm transition-all duration-300"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 text-sm transition-all duration-300"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 text-sm transition-all duration-300"
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="09129455678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 text-sm transition-all duration-300"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Delaware"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 text-sm transition-all duration-300"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-semibold py-2 rounded-xl text-sm flex items-center justify-center transition-all duration-300 ${
                  success
                    ? "bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                }`}
              >
                {loading ? (
                  success ? (
                    <>
                      <svg
                        className="animate-pulse mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Success! Redirecting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 
7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registering...
                    </>
                  )
                ) : (
                  "Register Patient"
                )}
              </button>
            </form>
          </div>
        </div>

        {success && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-white">
            <div className="text-center animate-fade-in">
              <div className="mb-6">
                <div className="relative inline-block">
                  <svg
                    className="w-24 h-24 text-green-500 animate-checkmark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Patient Registered!
              </h2>
              <p className="text-gray-600 mb-8">Redirecting to patients list...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-green-500 animate-progress-bar"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-checkmark {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkmark 0.6s ease-in-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-progress-bar {
          animation: progressBar 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}
