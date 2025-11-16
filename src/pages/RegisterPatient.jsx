import { useState } from "react";
import { useNavigate } from "react-router-dom";

// You can replace this with a nice medical vector image in /src/assets/
import MedicalVector from "../assets/medical-vector.png";

const RegisterPatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Replace this with actual API call
      console.log("Submitting:", formData);

      setMessage({ type: "success", text: "Patient registered successfully!" });

      setFormData({
        fullName: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
      });

      // navigate("/patients");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to register patient." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Image Section */}
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center">
          <img src={MedicalVector} alt="Medical Illustration" className="w-4/5 h-auto" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Register New Patient
          </h1>

          {message && (
            <p
              className={`mb-4 text-center md:text-left ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              />
            </div>

            {/* Age */}
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
                min={0}
                placeholder="25"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Phone */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              />
            </div>

            {/* Address */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-colors duration-300 text-sm"
            >
              {loading ? "Registering..." : "Register Patient"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
