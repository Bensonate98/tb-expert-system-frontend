import axios from "axios";

const api = axios.create({
  baseURL: "tb-expert-system-production.up.railway.app/api/v1", 
  headers: {
    "Content-Type": "application/json",
  },
});

//Register a patient
export const registerPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

// Get all patients
export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

// Get a single patient
export const getPatientById = async (patientId) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

/* ---------------------- DIAGNOSIS SERVICES ---------------------- */

// Create a diagnosis
export const createDiagnosis = async (data) => {
  const response = await api.post("/diagnoses", data);
  return response.data;
};

// Get diagnosis by patientId
export const getDiagnosesByPatient = async (patientId) => {
  const response = await api.get(`/diagnoses/patient/${patientId}`);
  return response.data;
};


export const getReportByPatient = async (patientId) => {
  const response = await api.get(`/reports/patient/${patientId}`);
  return response.data;
};

export const generateReport = async (payload) => {
  const response = await api.post("/reports", payload);
  return response.data;
};

export default api;
