import React, { useState } from "react";
import API from "../config/api";
import Loading from "../components/Loading";

function AdminPanel() {
  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);

  const token = localStorage.getItem("token");

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const fetchUsers = async () => {
    try {
      setPageLoading(true);
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
      setView("users");
    } catch (err) {
      showError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setPageLoading(true);
      const res = await fetch(`${API}/api/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      setLogs(await res.json());
      setView("logs");
    } catch (err) {
      showError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(
        `${API}/api/users/${confirmUser.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("User delete failed");
      setUsers((u) => u.filter((x) => x.id !== confirmUser.id));
      setConfirmUser(null);
    } catch (err) {
      showError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (pageLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white relative">
      <h2 className="text-4xl font-bold mb-8 text-center">Admin Panel</h2>

      {/* ERROR POPUP */}
      {error && (
        <div className="fixed top-5 right-5 bg-red-600 px-4 py-3 rounded-lg shadow-lg z-50">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {view === null && (
        <div className="flex justify-center gap-6">
          <button
            onClick={fetchUsers}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            <i className="bi bi-people-fill me-2"></i>Users
          </button>
          <button
            onClick={fetchLogs}
            className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-700"
          >
            <i className="bi bi-clipboard-data me-2"></i>Logs
          </button>
        </div>
      )}

      {view === "users" && (
        <>
          <button
            onClick={() => setView(null)}
            className="mb-5 px-4 py-2 bg-gray-700 rounded-lg"
          >
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800 p-5 rounded-xl relative"
              >
                {user.role !== "admin" && (
                  <button
                    onClick={() => setConfirmUser(user)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-400"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    user.role === "admin" ? "bg-green-600" : "bg-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "logs" && (
        <>
          <button
            onClick={() => setView(null)}
            className="mb-5 px-4 py-2 bg-gray-700 rounded-lg"
          >
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Activity Logs</h3>

            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Activity</th>
                    <th className="px-4 py-2">Date</th>
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
                </tbody>
              </table>
            </div>

            <div className="sm:hidden flex flex-col gap-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-700 p-4 rounded-lg">
                  <p><b>Name:</b> {log.name}</p>
                  <p><b>Activity:</b> {log.activity}</p>
                  <p className="text-sm text-gray-300">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {confirmUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-80">
            <h3 className="text-xl font-bold mb-3 text-red-500">
              Delete User
            </h3>
            <p className="mb-5">
              Delete <b>{confirmUser.name}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 rounded"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
