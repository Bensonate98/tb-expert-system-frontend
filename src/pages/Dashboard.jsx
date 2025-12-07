import { useNavigate } from "react-router-dom";
import { UserPlus, Stethoscope, Users } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Register Patient",
      icon: <UserPlus size={36} strokeWidth={1.2} />,
      description: "Create a new patient profile for diagnosis.",
      link: "/patients/register",
    },
    {
      title: "Diagnose Patient",
      icon: <Stethoscope size={36} strokeWidth={1.2} />,
      description: "Record symptoms and generate TB risk assessment.",
      link: "/patients",
    },
    {
      title: "View All Patients",
      icon: <Users size={36} strokeWidth={1.2} />,
      description: "Browse and manage all registered patients.",
      link: "/patients",
    },
  ];

  return (
    <div
      className="
        min-h-screen relative flex flex-col items-center px-6 py-20
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/src/assets/bg-medical.jpg')" }}
    >
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Header Section */}
        <div className="max-w-3xl text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Akpos TB Expert System
          </h1>

          <p className="text-gray-200 text-base md:text-lg leading-relaxed">
            A clinical decision support tool designed to help healthcare professionals
            assess Tuberculosis symptoms and generate reliable diagnostic reports.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.link)}
              className="
                bg-white/85 shadow-lg rounded-2xl p-8 flex flex-col items-center cursor-pointer
                border border-white/20
                hover:shadow-2xl hover:-translate-y-2 hover:bg-white/95
                transition-all duration-300
              "
            >
              {/* Icon */}
              <div
                className="
                  text-blue-700 mb-4 p-3 rounded-full bg-blue-50
                  transition-all duration-300
                "
              >
                {action.icon}
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {action.title}
              </h2>

              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {action.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-gray-300 text-xs text-center">
          © {new Date().getFullYear()} Akpos TB Expert System — Academic Project
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
