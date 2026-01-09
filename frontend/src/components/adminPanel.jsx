import React, { useEffect } from "react";

function AdminPanel() {

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/auth/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("You're Not Authenticated");
      }

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      id="card"
      className="p-5 text-center border border-black rounded-lg bg-cyan-400 w-[300px]"
    >
      <h1 className="name text-xl font-bold">NAME : MUTHUGOPI</h1>
      <p className="email">mail : admin@email.com</p>
    </div>
  );
}

export default AdminPanel;
