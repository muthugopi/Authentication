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
  const [commentContent, setCommentContent] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);

  const isToken = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  if (!isToken) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

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

  const addComment = async (messageId) => {
    if (!commentContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in");

      const res = await fetch(`${API}/api/message/${messageId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const updatedMessage = await res.json();

      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? updatedMessage : msg
      );

      setMessages(updatedMessages);
      setCommentContent("");
      setActiveCommentId(null);
    } catch (err) {
      console.error(err);
    }
  };



  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* MESSAGE FEED */}
        <div className="lg:col-span-2 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">

              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-indigo-600">{msg.title}</p>
                  <p className="text-sm text-gray-500">by {msg.username || "Anonymous"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => likeMessage(msg.id)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                  >
                    <i className="bi bi-heart-fill text-red-500"></i> {msg.likes || 0}
                  </button>
                  {role === "admin" && (
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <p className="text-gray-700 mb-2">{msg.content}</p>

              {/* Show number of comments and toggle view */}
              <button
                onClick={() =>
                  setActiveCommentId(activeCommentId === msg.id ? null : msg.id)
                }
                className="text-sm text-indigo-600 hover:underline mb-2"
              >
                {msg.comments?.length ? (
                  <>
                    <i class="bi bi-cloud-fill"></i> {msg.comments.length} Replies
                  </>
                ) : (
                  "Reply"
                )}

              </button>

              {/* Only show comments if active */}
              {activeCommentId === msg.id && (
                <div className="space-y-2 mb-2">
                  {msg.comments?.map((c) => (
                    <div key={c.id} className="bg-gray-100 p-2 rounded text-sm">
                      <span className="font-semibold">{c.username}:</span> {c.content}
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-2 mt-2">
                    <input
                      className="flex-1 p-2 border border-gray-300 rounded"
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button
                      onClick={() => addComment(msg.id)}
                      className="bg-indigo-600 text-white px-3 rounded hover:bg-indigo-700"
                    >
                      Comment
                    </button>
                    <button
                      onClick={() => { setActiveCommentId(null); setCommentContent(""); }}
                      className="text-gray-500 px-2"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* About Developer */}
          <div className="bg-white p-6 rounded-lg shadow space-y-3">
            <h2 className="text-2xl font-bold text-indigo-600">About The Developer</h2>
            <p><b>Name:</b> Muthugopi J</p>
            <p><b>Domain:</b> MERN</p>
            <p><b>Education:</b> 1st Year ECE at <strong>RIT</strong> ’29</p>
            <p><b>Age:</b> 17</p>
          </div>

          {/* Why This Page */}
          <div className="bg-white p-6 rounded-lg shadow space-y-3">
            <h2 className="text-2xl font-bold text-indigo-600">Why This Page?</h2>
            <p className="text-gray-700">
              This page is a professional public feed where students can share announcements, thoughts, and ideas.
            </p>
            <p className="text-gray-700">
              It focuses on simplicity, privacy, and learning real-world full-stack development using MERN.
            </p>
          </div>
        </aside>
      </div>

      {/* ADD MESSAGE BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full text-3xl shadow hover:bg-indigo-700 text-white"
      >
        +
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500"
            >
              <i class="bi bi-x-lg"></i>
            </button>

            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Add Message</h2>

            <input
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              placeholder="Title (e.g., Announcement, Question)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className="w-full bg-indigo-600 py-2 rounded text-white hover:bg-indigo-700"
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
