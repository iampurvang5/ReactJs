import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //npm install react-router-dom
import { AuthContext } from "../context/AuthContext"; 

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser(null); // Clear user state
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Default placeholder image for missing or invalid profile picture
  const placeholderImage = "https://via.placeholder.com/32?text=User";

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left side - Logo / Brand */}
      <div className="text-xl font-bold">React App</div>

      {/* Center - Links */}
      <div className="space-x-6 hidden md:flex">
        <Link to="/" className="text-white hover:text-indigo-200 transition-colors">
          Home
        </Link>
        <Link to="/components" className="text-white hover:text-indigo-200 transition-colors">
          Components
        </Link>
      </div>

      {/* Right side - Profile or Login/Register */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors focus:outline-none"
            >
              <img
                src={user.profilePicUrl || placeholderImage}
                alt={`${user.username}'s profile picture`}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
                onError={(e) => (e.target.src = placeholderImage)}
              />
              <span>{user.username}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-white hover:bg-indigo-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to={`/posts/${user.id}`}
                  className="block px-4 py-2 text-white hover:bg-indigo-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Posts
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-white hover:bg-indigo-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-indigo-200 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-indigo-200 transition-colors">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}