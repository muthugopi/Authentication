import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        const response = await fetch("https://authentication-u5oq.onrender.com/api/auth/register", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("You are not authenticated");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight: "100vh", background: "#f4f6f8" }}>
      {/* Header */}
      <header style={{
        background: "#4f46e5",
        color: "#fff",
        padding: "20px 40px",
        fontSize: "1.5rem",
        fontWeight: "bold"
      }}>
        Welcome Back {user.name} !
      </header>

      <div style={{ display: "flex", marginTop: "20px" }}>
        {/* Sidebar */}
        <aside style={{
          width: "250px",
          background: "#fff",
          margin: "0 20px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h3>Navigation</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
            <li style={{ margin: "10px 0", cursor: "pointer", color: "#4f46e5", fontWeight: "500" }}>Dashboard</li>
            <li style={{ margin: "10px 0", cursor: "pointer", color: "#4f46e5", fontWeight: "500" }}>Profile</li>
            <li style={{ margin: "10px 0", cursor: "pointer", color: "#4f46e5", fontWeight: "500" }}>Settings</li>
            <li style={{ margin: "10px 0", cursor: "pointer", color: "#f43f5e", fontWeight: "500" }}>Logout</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, marginRight: "20px" }}>
          <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Profile Information</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}>
              <div style={{ padding: "15px", background: "#f0f4f8", borderRadius: "8px" }}>
                <h4>ID : </h4>
                <p>{user.id}</p>
              </div>
              <div style={{ padding: "15px", background: "#f0f4f8", borderRadius: "8px" }}>
                <h4>Name : </h4>
                <p>{user.name}</p>
              </div>
              <div style={{ padding: "15px", background: "#f0f4f8", borderRadius: "8px" }}>
                <h4>Email : </h4>
                <p>{user.email}</p>
              </div>
              <div style={{ padding: "15px", background: "#f0f4f8", borderRadius: "8px" }}>
                <h4>Member Since : </h4>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
