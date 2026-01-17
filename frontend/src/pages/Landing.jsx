import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import API from "../config/api";
import Loading from "../components/Loading";

const Landing = () => {
  const [auth, setAuth] = useState({
    loading: true,
    loggedIn: false,
    user: null,
  });
  const [count, setCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

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

        setAuth({ loading: false, loggedIn: true, user: data.user });


        fetchCount();
        sendActivity(token);
      } catch (err) {
        console.error("auth/me failed:", err.message);
        setAuth({ loading: false, loggedIn: false, user: null });
      }
    };

    verifyAuth();
  }, []);

  const fetchCount = async () => {
    setCountLoading(true);
    try {
      const res = await fetch(`${API}/api/count`);
      if (!res.ok) throw new Error("Failed to fetch count");
      const data = await res.json();
      setCount(data.totalUsers || 0);
    } catch (err) {
      console.error("Count fetch failed:", err);
    } finally {
      setCountLoading(false);
    }
  };

  const sendActivity = async (token) => {
    if (!token) return;
    try {
      await fetch(`${API}/api/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activity: "Visited" }),
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }
  };

  if (auth.loading) return <Loading />;

  if (!auth.loggedIn) return <Navigate to="/register" replace />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071026] text-gray-900 dark:text-gray-100 antialiased">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20 space-y-16">
        {/* HEADER */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Secure authentication engineered for{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-600 to-blue-400">
                real apps
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              Authenticate is a practical full-stack auth system (React + Express + Passport + Sequelize).
              Learn session-based login, protected routes, role-based access, and build a production-ready dashboard.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/message"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transform transition"
              >
                Explore App
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Create account
              </Link>

              <div className="flex items-center gap-4 ml-2">
                <Stat number={countLoading ? "..." : count} label="Accounts created" />
                <Stat number="98%" label="Auth coverage" />
                <Stat number="17" label="Author" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            <GlassShowcase
              title="Admin Panel"
              desc="Manage users & roles — built for clarity."
              gradient="from-indigo-500 via-indigo-600 to-blue-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <SmallCard title="JWT" desc="Token & session examples" />
              <SmallCard title="Sequelize" desc="Models & migrations" />
            </div>
          </div>
        </header>

        {/* CORE MODULES */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Core modules — clear & practical
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Session-Based Auth"
              desc="Passport + express-session for cookie-based sessions and secure flows."
            />
            <FeatureCard
              title="Role-Based Access"
              desc="Admin/user separation with server-side route guards."
            />
            <FeatureCard
              title="Protected Routes"
              desc="Client and server protections using React Router and backend checks."
            />
            <FeatureCard
              title="Scalable DB"
              desc="Sequelize models and migrations for maintainable SQL schemas."
            />
            <FeatureCard
              title="CORS-safe Integration"
              desc="Frontend↔backend communication with credentials and safe headers."
            />
            <FeatureCard
              title="Production Thinking"
              desc="Designed to be extended for real projects — not a synthetic toy."
            />
          </div>
        </section>

        {/* PROJECT DETAILS & DEVELOPER */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 p-10 shadow-xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-semibold mb-4">Authenticate — project details</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Authenticate is a full-stack authentication system built with practical, real-world patterns:
              React (Vite) frontend, Express backend, Passport.js local strategy, express-session, and Sequelize (MySQL).
              It demonstrates secure login flows, protected profile APIs, admin role workflows, and a responsive dashboard UI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Frontend</h4>
                <ul className="list-inside list-disc text-gray-700 dark:text-gray-300 space-y-1">
                  <li>React (Vite)</li>
                  <li>React Router DOM</li>
                  <li>Tailwind CSS</li>
                  <li>Fetch API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Backend</h4>
                <ul className="list-inside list-disc text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Node.js & Express</li>
                  <li>Passport.js (Local)</li>
                  <li>express-session</li>
                  <li>Sequelize • MySQL</li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl bg-gradient-to-b from-white/60 to-white/30 dark:from-gray-800 dark:to-gray-800/60 p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-3">About the Developer</h3>
            <p className="text-gray-700 dark:text-gray-200 mb-4">
              <strong>MUTHUGOPI J</strong> — 17 • Backend Engineer (MERN) • ECE at Ramco Institute of Technology.
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Interests: web dev, PAWN dev. I focus on building reliable systems and learning deeply.
              Personal note: past bad experiences gave me trust issues, which now push me to learn and build independently.
            </p>

            <div className="flex justify-center gap-3">
              <Link
                to="/verify-admin"
                className="px-4 py-2 my-5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Open dashboard
              </Link>
            </div>
          </aside>
        </section>

        <footer className="text-center text-gray-500 dark:text-gray-400 py-8">
          © {new Date().getFullYear()} Authenticate • Built with React & Tailwind
        </footer>
      </div>
    </div>
  );
};

// --- COMPONENTS ---
const Stat = ({ number, label }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-2 shadow border border-gray-100 dark:border-gray-800 text-center transform transition hover:scale-105">
    <div className="text-lg font-bold">{number}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

const GlassShowcase = ({ title, desc, gradient = "from-indigo-500 to-blue-500" }) => (
  <div className={`rounded-3xl p-6 md:p-8 bg-gradient-to-r ${gradient} text-white shadow-2xl transform transition hover:-translate-y-1`}>
    <h4 className="text-lg md:text-xl font-semibold mb-2">{title}</h4>
    <p className="text-sm md:text-base opacity-95">{desc}</p>
  </div>
);

const SmallCard = ({ title, desc }) => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 flex flex-col justify-center shadow-inner border border-gray-100 dark:border-gray-800 transform transition hover:scale-105">
    <h5 className="text-sm font-semibold text-indigo-600 mb-1">{title}</h5>
    <p className="text-xs text-gray-600 dark:text-gray-300">{desc}</p>
  </div>
);

const FeatureCard = ({ title, desc }) => (
  <article className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
    <h4 className="text-2xl font-semibold mb-3">{title}</h4>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{desc}</p>
  </article>
);

export default Landing;
