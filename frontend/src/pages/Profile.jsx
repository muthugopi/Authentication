import React, { useEffect, useState } from "react";
import API from "../config/api";
import { toast } from "../utils/toast.js";
import Loading from "../components/Loading.jsx";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
      setUser(data);
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
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10 flex justify-center">
      <div className="bg-gray-800 rounded-xl p-6 sm:p-10 w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-gray-300 text-sm">Name</p>
              <h3 className="text-white font-semibold text-lg">{user.name}</h3>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-gray-300 text-sm">Email</p>
            <h3 className="text-white font-semibold text-lg">{user.email}</h3>
          </div>

          <div className="flex flex-col">
            <p className="text-gray-300 text-sm">Role</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "admin" ? "bg-green-600" : "bg-gray-700"
              }`}
            >
              {user.role}
            </span>
          </div>

          <button
            onClick={() => toast("Redirect to change password page", "info")}
            className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
