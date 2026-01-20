import React, { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import API from "../config/api";
import Loading from "../components/Loading";
import Popup from "../components/Popup"; // <-- import the reusable popup

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [loading, setLoading] = useState(false);
    const [redirct, setRedirect] = useState(false);
    const [searchParams] = useSearchParams();
    const fromRegister = searchParams.get("from") === "register";

    // Use Popup state
    const [showPopup, setShowPopup] = useState(fromRegister);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setMessageColor("text-green-500");
                setMessage(`Welcome Back ${data.user.name} !!`);
                setRedirect(true);
            } else {
                setMessageColor("text-red-500");
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            console.log(error);
            setMessageColor("text-red-500");
            setMessage("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (redirct) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-black px-4">

            {/* Popup (unchanged) */}
            <Popup
                open={showPopup}
                onClose={() => setShowPopup(false)}
                title="Just a quick note"
                description="We couldn’t redirect you directly to the home page after signup. Please sign in to continue."
                path="login"
            />

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Sign in to continue
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            required
                            className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                            className="absolute left-4 top-2 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400"
                        >
                            Email Address
                        </label>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            required
                            className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                            className="absolute left-4 top-2 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400"
                        >
                            Password
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition disabled:opacity-60"
                    >
                        {loading ? <Loading /> : "Sign In"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:underline">
                        Register
                    </Link>
                </p>

                {/* Message */}
                {message && (
                    <p
                        className={`mt-4 text-center text-sm font-medium ${messageColor === "text-green-500"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );

}

export default Login;
