import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from './Loading'
import API from "../config/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      setLoading(true);

      const data = await response.json();

      if (response.ok) {
        setMessageColor("text-green-500");
        setMessage(data.message || "Registered successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          redirect('/');
        }, 3000);
      } else {
        setMessageColor("text-red-500");
        setMessage(data.error || "Registration failed");
      }
    } catch (err) {
      setMessageColor("text-red-500");
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Register
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 peer bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm">
              Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 peer bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 peer bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm">
              Password
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            {loading ? <Loading /> : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

        {message && (
          <p className={`${messageColor} text-center mt-4 font-medium`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
