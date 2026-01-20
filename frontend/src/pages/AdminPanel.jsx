import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../config/api";
import Loading from "../components/Loading";
import { toast } from "../utils/toast.js";

function AdminPanel() {
  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [auth, setAuth] = useState({
    loading: true,
    admin: false,
    user: null,
  });

  const token = localStorage.getItem("token");

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth({ loading: false, loggedIn: false, user: null });
      return;
    }

    const verifyAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid token");
        const data = await res.json();

        // Set admin flag properly
        const isAdmin = data.user.role === "admin";

        setAuth({
          loading: false,
          admin: isAdmin,
          user: data.user,
        });
      } catch (err) {
        console.error("auth/me failed:", err.message);
        setAuth({ loading: false, admin: false, user: null });
      }
    };


    verifyAuth();
  }, []);

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
      const res = await fetch(`${API}/api/users/${confirmUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("User delete failed");
      setUsers((u) => u.filter((x) => x.id !== confirmUser.id));
      setConfirmUser(null);
      toast("User deleted successfully", "success");
    } catch (err) {
      showError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePromoteClick = (user) => {
    setConfirmUser({ ...user, action: "promote" });
  };

  const promoteModerator = async (user) => {
    try {
      setActionLoading(true);
      const res = await fetch(`${API}/api/auth/bemoderator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) throw new Error("Failed to promote to moderator");
      toast(`${user.name} is now a moderator`, "success");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, role: "moderator" } : u
        )
      );
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchModeratorsView = async () => {
    try {
      setPageLoading(true);
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const allUsers = await res.json();
      const filteredUsers = allUsers.filter(
        (user) => user.role == "moderator"
      );
      setUsers(filteredUsers);
      setView("moderators");
    } catch (err) {
      showError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  const DashboardButton = ({ icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-${color}-600/90 hover:bg-${color}-600 transition font-semibold`}
    >
      <i className={`bi ${icon} text-xl`} />
      {label}
    </button>
  );


  if (pageLoading) return <Loading />;
  if (auth.loading) return <Loading />;

  if (!auth.admin) { return <Navigate to="/" replace />; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white px-4 py-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-400 mt-2 text-sm">
          Manage users, moderators and system activity
        </p>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-5 right-5 bg-red-600 px-4 py-3 rounded-xl shadow-lg z-50 text-sm">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Actions */}
        {view === null && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardButton
              icon="bi-people-fill"
              color="indigo"
              label="Users"
              onClick={fetchUsers}
            />
            <DashboardButton
              icon="bi-person-check"
              color="yellow"
              label="Moderators"
              onClick={fetchModeratorsView}
            />
            <DashboardButton
              icon="bi-clipboard-data"
              color="green"
              label="Activity Logs"
              onClick={fetchLogs}
            />
          </div>
        )}

        {/* Back Button */}
        {view && (
          <button
            onClick={() => setView(null)}
            className="flex items-center gap-2 mb-6 text-sm text-gray-300 hover:text-white"
          >
            <i className="bi bi-arrow-left"></i> Back to Dashboard
          </button>
        )}

        {/* USERS / MODERATORS */}
        {(view === "users" || view === "moderators") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative hover:shadow-xl transition"
              >
                {/* Actions */}
                {user.role !== "admin" && (
                  <div className="absolute top-3 right-3 flex gap-3">
                    {user.role !== "moderator" && (
                      <button
                        onClick={() => handlePromoteClick(user)}
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Promote to moderator"
                      >
                        <i className="bi bi-person-check"></i>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setConfirmUser({ ...user, action: "delete" })
                      }
                      className="text-red-500 hover:text-red-400"
                      title="Delete user"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-semibold capitalize
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
            ))}
          </div>
        )}

        {/* LOGS */}
        {view === "logs" && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Activity</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3">{log.name}</td>
                      <td className="px-4 py-3">{log.activity}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <p className="font-medium">{log.name}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {log.activity}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default AdminPanel;
