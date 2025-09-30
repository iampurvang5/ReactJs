import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
 const baseUrl = "http://192.168.1.5:3000/api";
 const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "emailOrUsername":
        if (!value.trim()) return "Email or Username is required";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field on change
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Show loading alert
        Swal.fire({
          title: "Logging in...",
          text: "Please wait while we authenticate your credentials.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await fetch(baseUrl+'/auth/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emailOrUsername: formData.emailOrUsername,
            password: formData.password
          })
        });

        if (response.ok) {
          const data = await response.json();
          // Set user in context
          setUser({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            token: data.token, // Store token for future API calls
            profilePicUrl: data.user.profilePictureUrl // Assuming the backend returns this
          });
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "You have been logged in.",
            timer: 2000,
            showConfirmButton: false
          });
          // Reset form
          setFormData({
            emailOrUsername: "",
            password: ""
          });
          setErrors({});
          // Redirect to home page
          navigate("/");
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: errorData.message || "Invalid credentials. Please try again.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to connect to the server. Please check your network and try again.",
        });
      }
    }
  };

  const handleCancel = () => {
    navigate("/register");
  };

  return (
    // <div className="relative min-h-screen bg-cover bg-center bg-fixed bg-gray-100" style={{ backgroundImage: `url(/images/backgroundImage.png)` }} >
    //   {/* Overlay for readability */}
    //   <div className="absolute inset-0 bg-opacity-20"></div>
      <div className="flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                name="emailOrUsername"
                required
                value={formData.emailOrUsername}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
                  errors.emailOrUsername ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.emailOrUsername && (
                <p className="mt-1 text-sm text-red-600">{errors.emailOrUsername}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors placeholder-gray-400 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={Object.values(errors).some((err) => err)}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    // </div>
  );
}