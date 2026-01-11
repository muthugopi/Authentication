import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import API from "../config/api";
import Loading from "./Loading";

const PublicMessage = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
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

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API}/api/message`);
      const data = await res.json();
      setMessages(data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  // Scroll to the bottom after messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await fetch(`${API}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, username }),
      });

      setContent("");
      setUsername("");
      setShowModal(false);

      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Like a message
  const likeMessage = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API}/api/message/${id}/like`, { method: "POST" });
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a message (admin only)
  const deleteMessage = async (id) => {
    if (role !== "admin") return;
    setLoading(true);
    try {
      await fetch(`${API}/api/message/${id}`, { method: "DELETE" });
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071026] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Messages */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold mb-6 text-indigo-400 text-center lg:text-left">Campus Feed</h1>

          <div className="space-y-4 overflow-y-auto max-h-[600px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-gray-900 dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-indigo-400">{msg.username || "Anonymous"}</h4>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likeMessage(msg.id)}
                      disabled={loading}
                      className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 text-sm font-medium"
                    >
                      <span>❤️</span> {msg.likes}
                    </button>
                    {role === "admin" && (
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-400 text-sm font-medium"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Profile */}
        <aside className="hidden lg:block bg-gray-900 dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-indigo-400">About Me</h2>
          <p><span className="font-semibold">Name:</span> Muthugopi</p>
          <p><span className="font-semibold">Domain:</span> MERN</p>
          <p><span className="font-semibold">Education:</span> ECE, Ramco Institute of Technology</p>
          <p><span className="font-semibold">Age:</span> 17yo</p>
        </aside>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full text-3xl flex items-center justify-center shadow-lg transition transform hover:scale-110"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Add a Message</h2>
            <input
              placeholder="Your name"
              className="w-full p-2 rounded bg-gray-800 mb-3 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <textarea
              placeholder="Write something publicly..."
              className="w-full p-3 rounded bg-gray-800 mb-4 text-white"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className={`w-full py-2 rounded font-semibold transition ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? <Loading /> : "Post Message"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMessage;
