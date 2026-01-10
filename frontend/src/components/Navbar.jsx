import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl font-bold">MyApp</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/login" className="hover:text-blue-400">Login</Link>
          <Link to="/register" className="hover:text-blue-400">Register</Link>
          <Link to="/users" className="hover:text-blue-400">Admin</Link>
          <Link onClick={() => setIsOpen(false)} to="/admin">Authorize</Link>
        </div>

        {/* Mobile Burger / X */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4">
          <Link onClick={() => setIsOpen(false)} to="/">Home</Link>
          <Link onClick={() => setIsOpen(false)} to="/login">Login</Link>
          <Link onClick={() => setIsOpen(false)} to="/register">Register</Link>
          <Link onClick={() => setIsOpen(false)} to="/users">Admin</Link>
          <Link onClick={() => setIsOpen(false)} to="/admin">Authorize</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
