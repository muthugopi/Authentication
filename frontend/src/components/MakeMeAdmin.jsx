import React, { useState } from "react";
import Loading from "./Loading";
import API from "../config/api";
import { Navigate } from "react-router-dom";

function MakeMeAdmin() {
    const [secret, setSecret] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const storedToken = localStorage.getItem("token");
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/api/auth/beadmin`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${storedToken}`
                },
                body: JSON.stringify({ secret })
            });
            setLoading(true);
            const data = await response.json();

            setTimeout(() => {
                if (response.ok) {
                    setMessageColor("text-green-500");
                    setMessage(data.message || "Verified successfully! You are now an admin.");
                    localStorage.setItem("token", data.token);
                    console.log(data)
                    localStorage.setItem("role", data.role);
                    setRedirect(true);
                } else {
                    setMessageColor("text-red-500");
                    setMessage(data.message || "Verification failed!");
                }
            }, 3000);
        } catch (err) {
            console.error(err);
            setMessageColor("text-red-500");
            setMessage("Server error. Please try again.");
        }
    };

    if (redirect) {
        return <Navigate to="/users" replace />
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                    Admin Verification
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Secret Key */}
                    <div className="relative">
                        <input
                            type="text"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            placeholder=" "
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-green-500 peer bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        />
                        <label className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-500 peer-focus:text-sm">
                            Secret Key
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
                    >
                        {loading ? <Loading /> : "Submit"}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p className={`${messageColor} text-center mt-4 font-medium`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default MakeMeAdmin;
