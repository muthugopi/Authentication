import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    setMenuOpen(false); // close mobile menu first
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Common links array
  const links = [
    { name: "Home", path: "/", auth: false },
    { name: "Messages", path: "/message", auth: true },
    { name: "Admin Panel", path: "/admin", auth: true, role: "admin" },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center relative">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-indigo-400">CampusApp</div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {links.map((link) => {
          if (link.auth && !token) return null;
          if (link.role && role !== link.role) return null;
          return (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-indigo-300 transition"
            >
              {link.name}
            </Link>
          );
        })}

        {!token ? (
          <>
            <Link
              to="/register"
              className="hover:text-indigo-300 transition font-medium"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="hover:text-indigo-300 transition font-medium"
            >
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="hover:text-red-500 transition font-medium"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Burger Icon */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none text-2xl"
        >
          {menuOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-list"></i> 
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 text-white flex flex-col gap-4 p-4 md:hidden z-50 shadow-md">
          {links.map((link) => {
            if (link.auth && !token) return null;
            if (link.role && role !== link.role) return null;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-300 transition"
              >
                {link.name}
              </Link>
            );
          })}

          {!token ? (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-300 transition font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-300 transition font-medium"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition font-medium text-left w-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
