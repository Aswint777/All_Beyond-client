import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-gray-50 to-indigo-100 px-4">
      {/* 404 Text with Animation */}
      {/* <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse drop-shadow-lg"> */}
      <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 drop-shadow-lg">

        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 tracking-tight">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-600 mt-4 text-center max-w-md text-lg leading-relaxed">
        Oops! The page you’re looking for might have been removed or is temporarily unavailable.
      </p>

      {/* Go Back Button */}
      <a
        href="/"
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Go Back Home
      </a>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-200 to-transparent opacity-50 pointer-events-none" />
    </div>
  );
};

export default NotFound;