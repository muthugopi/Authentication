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

  const logActivity = async (message) => {
    try {
      await fetch(`${API}/api/activity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity: message || "Opened His Profile" }),
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl">

        {/* Profile Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {user.name?.[0]?.toUpperCase()}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white">
              {user.name}
            </h2>

            <p className="text-sm text-gray-400 break-all">
              {user.email}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mx-6" />

          {/* Info Section */}
          <div className="px-6 py-6 space-y-4">

            {/* Role */}
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
              <span className="text-gray-400 text-sm">Role</span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                ${user.role === "admin"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : user.role === "moderator"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
              >
                {user.role}
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1 bg-white/5 rounded-xl p-4">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-white text-sm break-all">
                {user.email}
              </span>
            </div>
          </div>

          {/* Quote */}
          <div className="px-6 pb-4 text-center">
            <p className="text-gray-300 text-sm italic">
              Do Support For <span className="text-white font-semibold">MUTHUGOPI J</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="px-6 pb-8 space-y-3">

            {/* GitHub */}
            <a
              onClick={() => logActivity("Opened Muthugopi's Github")}
              href="https://github.com/muthugopi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <i className="bi bi-github text-xl text-gray-300"></i>
                <span className="text-white font-medium">muthugopi</span>
              </div>
              <i className="bi bi-box-arrow-up-right text-gray-400"></i>
            </a>

            {/* Instagram */}
            <a
              onClick={() => logActivity("Opened Muthugopi's Instagram")}
              href="https://instagram.com/muthu_gopi._"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <i className="bi bi-instagram text-xl text-pink-400"></i>
                <span className="text-white font-medium">muthu_gopi._</span>
              </div>
              <i className="bi bi-box-arrow-up-right text-gray-400"></i>
            </a>

            {/* Discord */}
            <a
              onClick={() => logActivity("Opened Muthugopi's Discord")}
              href="https://discord.com/users/muthu_gopi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <i className="bi bi-discord text-xl text-indigo-400"></i>
                <span className="text-white font-medium">muthu_gopi</span>
              </div>
              <i className="bi bi-box-arrow-up-right text-gray-400"></i>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
      
};

export default Profile;
