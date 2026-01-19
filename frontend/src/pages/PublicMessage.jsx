import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import API from "../config/api";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

const PublicMessage = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentMap, setCommentMap] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  if (!token) return <Navigate to="/login" replace />;

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r);
    fetchMessages();
    logActivity();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- API ---------------- */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/message`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data.reverse());
    } finally {
      setLoading(false);
    }
  };

  const logActivity = () => {
    fetch(`${API}/api/activity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activity: "Visited Message Page" }),
    });
  };

  /* ---------------- ACTIONS ---------------- */
  const sendMessage = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API}/api/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      setTitle("");
      setContent("");
      setShowModal(false);
      fetchMessages();
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const likeMessage = async (id) => {
    setMessages((p) =>
      p.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m))
    );
    await fetch(`${API}/api/message/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const deleteMessage = async (id) => {
    if (role !== "admin") return;
    await fetch(`${API}/api/message/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages((p) => p.filter((m) => m.id !== id));
  };

  const addComment = async (messageId) => {
    const text = commentMap[messageId];
    if (!text?.trim()) return;

    const res = await fetch(`${API}/api/message/${messageId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    });

    const updated = await res.json();
    setMessages((p) => p.map((m) => (m.id === messageId ? updated : m)));
    setCommentMap((p) => ({ ...p, [messageId]: "" }));
    setActiveCommentId(null);
  };

  if (loading) return <Loading />;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        <Popup
          open={showPopup}
          onClose={() => setShowPopup(false)}
          title="Thanks For Your Feedback !!"
          description="Also Recommend your friends to use this website for me and help me to hunt bugs !!."
          path=""
        />

        {/* LEFT SIDEBAR – TRUST */}
        <aside className="hidden lg:block col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-bold text-indigo-600 text-lg">
                <i className="bi bi-globe2 mr-2"></i> Public Feed
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                A shared space for ideas, announcements and learning.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow text-sm text-gray-600 space-y-2">
              <p>• Be respectful</p>
              <p>• No spam</p>
              <p>• Think before posting</p>
            </div>

            <div className="bg-indigo-600 text-white p-5 rounded-xl shadow text-sm italic">
              “Write something worth reading.”
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main className="col-span-12 lg:col-span-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-20">
              <i className="bi bi-chat-dots text-5xl mb-4 block"></i>
              No messages yet. Be the first.
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl p-5 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-indigo-600">{msg.title}</h3>
                  <p className="text-xs text-gray-500">
                    by {msg.username || "Anonymous"}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => likeMessage(msg.id)}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <i className="bi bi-heart-fill"></i> {msg.likes || 0}
                  </button>

                  {role === "admin" && (
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-600"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-3">{msg.content}</p>

              <button
                onClick={() =>
                  setActiveCommentId(activeCommentId === msg.id ? null : msg.id)
                }
                className="text-sm text-indigo-600"
              >
                <i className="bi bi-chat"></i>{" "}
                {msg.comments?.length || 0} Replies
              </button>

              {activeCommentId === msg.id && (
                <div className="mt-3 space-y-2">
                  {msg.comments?.map((c) => (
                    <div
                      key={c.id}
                      className="bg-gray-100 rounded p-2 text-sm"
                    >
                      <b>{c.username}:</b> {c.content}
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      value={commentMap[msg.id] || ""}
                      onChange={(e) =>
                        setCommentMap((p) => ({
                          ...p,
                          [msg.id]: e.target.value,
                        }))
                      }
                      placeholder="Write a reply..."
                      className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => addComment(msg.id)}
                      className="bg-indigo-600 text-white px-3 rounded"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </main>

        {/* RIGHT SIDEBAR – SOCIAL PROOF */}
        <aside className="hidden lg:block col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow">
              <h4 className="font-semibold mb-3">
                <i className="bi bi-bar-chart mr-2"></i> Activity
              </h4>
              <p className="text-sm text-gray-600">
                Messages: {messages.length}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow text-sm text-gray-600">
              Your actions here are public & permanent.
            </div>
          </div>
        </aside>
      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full text-3xl shadow-lg"
      >
        +
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              New Message
            </h2>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Write your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMessage;
