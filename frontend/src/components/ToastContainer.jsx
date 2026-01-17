import { useEffect, useState } from "react";
import { subscribeToast } from "../utils/toast.js";

const COLORS = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-400 text-black",
  info: "bg-blue-600",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = subscribeToast(setToasts);
    return unsub;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 sm:left-auto left-1/2 sm:translate-x-0 -translate-x-1/2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all duration-300
          ${COLORS[t.type]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
