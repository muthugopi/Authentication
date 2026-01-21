import React from "react";

const Closed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#071026] text-gray-900 dark:text-gray-100 px-6">
      <div className="max-w-3xl w-full text-center bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-10 md:p-14">
        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Authentication Project — Completed
        </h1>

        {/* MAIN MESSAGE */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          This project has reached its completion. It was hosted online for a
          couple of weeks as a real-world learning experience and practical
          demonstration.
        </p>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          As part of this journey’s natural end, the server will be officially
          shut down by the developer.
        </p>

        {/* EMOTIONAL NOTE */}
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Thank you to everyone who helped improve the UI & UX, tested features,
            reported bugs, and supported this project in any form.
          </p>

          <p className="text-gray-700 dark:text-gray-200">
            Special and respectful thanks to{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Rama Krishna Sir
            </span>{" "}
            for motivating me to explore Database Management Systems —
            the foundation that inspired what comes next.
          </p>
        </div>

        {/* NEXT CHAPTER */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
          I’m now starting a new project —
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {" "}
            “College Management”
          </span>
          .
        </p>

        <p className="text-gray-600 dark:text-gray-400 mb-10">
          This time, the focus is deep learning of DBMS through real,
          meaningful implementation.
        </p>

        {/* SIGN OFF */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          See you later. This is not goodbye — just the next chapter.
        </p>

        <footer className="mt-10 text-xs text-gray-500 dark:text-gray-400">
          — <span className="font-semibold">MUTHUGOPI J</span>
        </footer>
      </div>
    </div>
  );
};

export default Closed;
