const NotFound = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-9xl font-bold text-violet-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 text-center px-6">
          Oops! The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="mt-6 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-all"
        >
          Go Back Home
        </a>
      </div>
    );
  };
  
  export default NotFound;
  