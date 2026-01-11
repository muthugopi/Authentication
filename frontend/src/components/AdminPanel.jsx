import React, { useEffect, useState } from "react";
import Card from "./Card";

function AdminPanel() {
  const [datas, setDatas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");


      const response = await fetch("https://authentication-u5oq.onrender.com/api/auth/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const sortedData = [...data].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
      setDatas(sortedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;
  if (error) return <div><p className="text-center mt-10 text-red-500">{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Panel</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {datas.map((user) => (
          <Card key={user.id} name={user.name} mail={user.email} />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
