import { useEffect } from "react";
import API from "../config/api";
import { Link } from "react-router-dom";

const NotFound = () => {

  const loging = () => {

    const token = localStorage.getItem("token");

    //-----------------------wants to resolve the loging issue-------------------------------

    fetch(`${API}/api/activity`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        activity: "Visited Unknows URL"
      })

    })

    useEffect(()=>{
      loging()
    }, [])
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#071026] px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-indigo-500">404</h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 rounded-lg border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
