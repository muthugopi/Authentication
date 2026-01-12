import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import API from "../config/api";
import Loading from "./Loading";

const PublicMessage = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const isToken = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  if (!isToken) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  /* =========================
     FETCH MESSAGES
  ========================== */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/message`, {
        headers: {
          Authorization: `Bearer ${isToken}`,
        },
      });
      const data = await res.json();
      setMessages(data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================== */
  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      await fetch(`${API}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isToken}`,
        },
        body: JSON.stringify({ title, content }),
      });

      setTitle("");
      setContent("");
      setShowModal(false);
      fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LIKE MESSAGE
  ========================== */
  const likeMessage = async (id) => {
    try {
      await fetch(`${API}/api/message/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${isToken}` },
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     DELETE MESSAGE (ADMIN)
  ========================== */
  const deleteMessage = async (id) => {
    if (role !== "admin") return;

    try {
      await fetch(`${API}/api/message/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${isToken}` },
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071026] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* =======================
            MESSAGE FEED
        ======================== */}
        <div className="lg:col-span-2">
          <div className="space-y-4 border-l border-gray-700 pl-4 max-h-[600px] overflow-y-auto">

            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex gap-3 bg-gray-900 dark:bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-indigo-400 transition"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                  {(msg.username || "A")[0].toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-indigo-400">
                        {msg.title }
                      </p>
                      <p className="text-xs text-gray-400">
                        by {msg.username || "Anonymous"}
                      </p>
                    </div>

                    {role === "admin" && (
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-gray-300 mt-2 leading-relaxed">
                    {msg.content}
                  </p>

                  <button
                    onClick={() => likeMessage(msg.id)}
                    className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <i className="bi bi-heart-fill"></i> {msg.likes}
                  </button>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* =======================
            SIDEBAR
        ======================== */}
        <aside className="hidden lg:flex flex-col gap-6">

          {/* About Developer */}
          <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg shadow space-y-3">
            <h2 className="text-2xl font-bold text-indigo-400">
              About The Developer
            </h2>
            <p><b>Name:</b> Muthugopi J</p>
            <p><b>Domain:</b> MERN</p>
            <p><b>Education:</b> 1st Year ECE at <strong>RIT</strong> ’29</p>
            <p><b>Age:</b> 17</p>
          </div>

          {/* Why This Page */}
          <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg shadow space-y-3">
            <h2 className="text-2xl font-bold text-indigo-400">
              Why This Page?
            </h2>
            <p className="text-gray-300">
              This page is built as an open campus-style feed where students
              can share announcements, thoughts, and ideas publicly.
            </p>
            <p className="text-gray-300">
              It focuses on simplicity, privacy, and learning real-world
              full-stack development using the MERN stack.
            </p>
          </div>

        </aside>
      </div>

      {/* =======================
          ADD BUTTON
      ======================== */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full text-3xl shadow hover:bg-indigo-700"
      >
        +
      </button>

      {/* =======================
          MODAL
      ======================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-400"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-indigo-400">
              Add Message
            </h2>

            <input
              className="w-full p-2 mb-3 bg-gray-800 rounded"
              placeholder="Title (e.g., Announcement, Question)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full p-3 mb-4 bg-gray-800 rounded"
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700"
            >
              Post Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMessage;
