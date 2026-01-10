import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-t-indigo-500 border-b-indigo-500 border-gray-200 rounded-full animate-spin mb-6"></div>


      
    </div>
  );
};

export default Loading;
