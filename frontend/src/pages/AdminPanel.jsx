import React, { useState } from "react";
import API from "../config/api";
import Loading from "../components/Loading";

function AdminPanel() {
  const [view, setView] = useState(null); // null | "users" | "logs"
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
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.sort((a, b) => a.name.localeCompare(b.name)));
      setView("users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/activity`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
      setView("logs");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="flex justify-center mt-10">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h2 className="text-4xl font-bold mb-8 text-center">Admin Panel</h2>

      {/* INITIAL OPTIONS */}
      {view === null && (
        <div className="flex justify-center gap-6">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-3 px-8 py-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg transform transition"
          >
            <i className="bi bi-people-fill"></i> Users
          </button>

          <button
            onClick={fetchLogs}
            className="flex items-center gap-3 px-8 py-5 rounded-xl bg-green-600 hover:bg-green-700 font-semibold shadow-lg transform transition"
          >
            <i className="bi bi-clipboard-data"></i> Activity Logs
          </button>
        </div>
      )}

      {/* USERS VIEW */}
      {view === "users" && (
        <div>
          <button
            onClick={() => setView(null)}
            className="mb-5 inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold shadow transition"
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.length > 0 ? (
              users.map((user) => (
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
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full mt-10">
                No users found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ACTIVITY LOGS VIEW */}
      {view === "logs" && (
        <div>
          <button
            onClick={() => setView(null)}
            className="mb-5 inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold shadow transition"
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>

          <div className="overflow-x-auto bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Activity Logs</h3>
            <table className="min-w-full divide-y divide-gray-700 text-white">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Activity</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-700 transition">
                      <td className="px-4 py-2">{log.name}</td>
                      <td className="px-4 py-2 text-gray-300">{log.activity}</td>
                      <td className="px-4 py-2 text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
