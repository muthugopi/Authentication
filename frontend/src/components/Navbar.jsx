import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const links = [
    { name: "Home", path: "/", auth: false },
    { name: "Messages", path: "/message", auth: true },
    { name: "Admin Panel", path: "/admin", auth: true, role: "admin" },
  ];

  const isMessageRoute = location.pathname === "/message";

  return (
    <nav
      className={`px-6 py-4 shadow-md flex justify-between items-center relative ${
        isMessageRoute ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      }`}
    >
      <div className={`text-2xl font-bold ${isMessageRoute ? "text-indigo-600" : "text-indigo-400"}`}>
        Authenticate
      </div>

      <div className="hidden md:flex items-center gap-6">
        {links.map((link) => {
          if (link.auth && !token) return null;
          if (link.role && role !== link.role) return null;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`transition hover:text-indigo-500 ${isMessageRoute ? "hover:text-indigo-700" : "hover:text-indigo-300"}`}
            >
              {link.name}
            </Link>
          );
        })}

        {!token ? (
          <>
            <Link to="/register" className="transition font-medium hover:text-indigo-500">
              Register
            </Link>
            <Link to="/login" className="transition font-medium hover:text-indigo-500">
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="transition font-medium hover:text-red-500"
          >
            Logout
          </button>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none text-2xl">
          {menuOpen ? <i className="bi bi-x"></i> : <i className="bi bi-list"></i>}
        </button>
      </div>

      {menuOpen && (
        <div
          className={`absolute top-full left-0 w-full flex flex-col gap-4 p-4 md:hidden z-50 shadow-md ${
            isMessageRoute ? "bg-white text-gray-900" : "bg-gray-900 text-white"
          }`}
        >
          {links.map((link) => {
            if (link.auth && !token) return null;
            if (link.role && role !== link.role) return null;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-500 transition"
              >
                {link.name}
              </Link>
            );
          })}

          {!token ? (
            <>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-indigo-500 transition font-medium">
                Register
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-indigo-500 transition font-medium">
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
