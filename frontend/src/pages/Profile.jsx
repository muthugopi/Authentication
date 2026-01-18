import React, { useEffect, useState } from "react";
import API from "../config/api";
import { toast } from "../utils/toast.js";
import Loading from "../components/Loading.jsx";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    logActivity();
  }, []);

  const logActivity = () => {
    fetch(`${API}/api/activity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activity: "Opened His Profile" }),
    });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch profile");
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loading />;

  if (!user)
    return (
      <div className="text-center mt-10 text-red-500 text-lg">
        Failed to load profile
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex justify-center items-start pt-16 sm:pt-24">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg p-8 sm:p-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400 mt-1">{user.email}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex justify-between items-center bg-gray-700/50 rounded-xl p-4 shadow hover:bg-gray-700 transition">
            <span className="text-gray-300 font-medium">Role</span>
            <span
              className={`px-3 py-1 rounded-full font-semibold text-sm ${user.role === "admin" ? "bg-green-600" : "bg-gray-600"
                }`}
            >
              {user.role}
            </span>
          </div>

          <div className="flex justify-between items-center bg-gray-700/50 rounded-xl p-4 shadow hover:bg-gray-700 transition">
            <span className="text-gray-300 font-medium">Email</span>
            <span className="text-white font-semibold text-sm">{user.email}</span>
          </div>
        </div>

        {/* Support Quote */}
        <div className="text-center mt-4 mb-6">
          <p className="text-gray-300 text-sm sm:text-base italic">
            Do Support For MUTHUGOPI J
          </p>
        </div>

        {/* Social Links */}
        {/* Social Links with Icon + Username */}
        <div className="flex flex-col items-center gap-3 mt-4">

          {/* GitHub */}
          <div className="flex items-center gap-2">
            <i className="bi bi-github text-xl text-gray-400"></i>
            <a
              href="https://github.com/muthugopi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              muthugopi
            </a>
          </div>

          {/* Instagram */}
          <div className="flex items-center gap-2">
            <i className="bi bi-instagram text-xl text-pink-400"></i>
            <a
              href="https://instagram.com/muthu_gopi._"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              muthu_gopi._
            </a>
          </div>

          {/* Discord */}
          <div className="flex items-center gap-2">
            <i className="bi bi-discord text-xl text-indigo-400"></i>
            <a
              href="https://discord.com/users/muthu_gopi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:underline"
            >
              muthu_gopi
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
