import React, { useEffect, useState } from "react";
import API from "../config/api";
import Loading from "./Loading";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storedToken = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics logs
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API}/api/activity`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="flex justify-center mt-10">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-4xl font-bold text-white mb-6 text-center">
        Admin Panel
      </h2>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                {user.name[0].toUpperCase()}
              </div>
              <div className="ml-4">
                <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {user.role || "user"}
              </span>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-gray-400 text-center col-span-full mt-10">
            No users found.
          </p>
        )}
      </div>

      {/* Analytics Table */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Activity Logs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 text-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Activity</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2">{log.name}</td>
                  <td className="px-4 py-2">{log.activity}</td>
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center text-gray-400">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
