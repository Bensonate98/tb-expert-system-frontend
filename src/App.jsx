import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPatient from "./pages/RegisterPatient.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PatientsList from "./pages/PatientsList.jsx";
import DiagnosisWizard from "./pages/DiagnosisWizard.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Patient Management */}
        <Route path="/patients/" element={<PatientsList />} />
        <Route path="/patients/register" element={<RegisterPatient />} />
        <Route path="/patients/register" element={<RegisterPatient />} />

        {/* Diagnoses */}
        <Route path="/diagnosis/start/:patientId" element={<DiagnosisWizard />} />

        {/* Reports */}
        <Route path="/reports/:patientId" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
