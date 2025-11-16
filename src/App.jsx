import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegisterPatient from "./pages/RegisterPatient.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/patients/register" element={<RegisterPatient />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
