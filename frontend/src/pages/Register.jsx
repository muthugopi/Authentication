import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import API from "../config/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to='/login' replace />
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");


    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageColor("text-green-500");
        setMessage(data.message || "Registered successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setRedirect(true);
      } else {
        setMessageColor("text-red-500");
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      setMessageColor("text-red-500");
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/login?from=register" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-black px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">

          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
              Full Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition disabled:opacity-60"
          >
            {loading ? <Loading /> : "Create Account"}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${messageColor === "text-green-500"
                ? "text-emerald-400"
                : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );

}

export default Register;
