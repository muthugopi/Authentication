import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">

        {/* Animated Ring */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Pulse Text */}
        <p className="text-indigo-400 text-sm tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    </div>
  );
};

export default Loading;
