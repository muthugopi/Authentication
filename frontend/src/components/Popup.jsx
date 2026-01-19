/* ------------------------------------------------------------------
  HOW TO USE THE <Popup /> COMPONENT
  ---------------------------------------------------------------
  This is a reusable popup/modal component for showing informational
  messages, warnings, confirmations, or alerts anywhere in your app.
  
  Props:
    - open (boolean)       : Whether the popup is visible or not
    - onClose (function)   : Callback to close the popup (e.g., set state)
    - title (string)       : The main title of the popup
    - description (string) : The content/message of the popup

  Features:
    - Click outside the popup or press X button to close
    - Dark mode friendly
    - Responsive and centered
    - Can be reused in login, register, dashboard, etc.
    - Optional: Add more buttons inside content for confirm/cancel actions
  ------------------------------------------------------------------ */

import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Popup = ({ open, onClose, title, description, path }) => {

    const [redirct, setRedirect] = useState(false);

    if(redirct)return <Navigate to={`/${path}`} />

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl animate-scaleIn">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {description}
                </p>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setRedirect(true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
