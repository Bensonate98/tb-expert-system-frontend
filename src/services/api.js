import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1", 
  headers: {
    "Content-Type": "application/json",
  },
});


export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

// Example POST request
export const registerPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

export default api;
