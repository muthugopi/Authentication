import React from 'react';

function Card(props) {
  return (
    <div
      className="
        p-6
        rounded-xl
        bg-gray-900/40
        backdrop-blur-lg
        border border-gray-700/50
        shadow-lg
        hover:scale-105
        transition-transform duration-300
        flex flex-col items-center
        text-center
      "
    >
      <div className="w-16 h-16 rounded-full bg-gray-800/60 mb-4 flex items-center justify-center text-white font-bold text-lg">
        {props.name[0]?.toUpperCase()}
      </div>
      <h1 className="text-xl font-semibold text-white mb-1">{props.name}</h1>
      <p className="text-gray-300 text-sm">{props.mail}</p>
    </div>
  );
}

export default Card;
