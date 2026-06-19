import  { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../utils/paths";

const InstructorSidebar = () => {
  const links = [
    {
      name: "Overview",
      path: `${ROUTES.INSTRUCTOR}${ROUTES.INSTRUCTOR_DASHBOARD}`,
    },
    { name: "Profile", path: `${ROUTES.USER}${ROUTES.PROFILE}` },
    {
      name: "My Courses",
      path: `${ROUTES.INSTRUCTOR}${ROUTES.INSTRUCTOR_COURSE}`,
    },
    { name: "Chat", path: `${ROUTES.USER}${ROUTES.CHAT_PAGE}` },
    { name: "Video Call", path: `${ROUTES.USER}${ROUTES.VIDEO_CHAT_PAGE}` },

    {
      name: "Assessments",
      path: `${ROUTES.INSTRUCTOR}${ROUTES.LIST_ASSESSMENT}`,
    },
    {
      name: "Transactions",
      path: `${ROUTES.INSTRUCTOR}${ROUTES.INSTRUCTOR_TRANSACTION_HISTORY}`,
    },
    { name: "Settings", path: "/settings" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-full shadow-md focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <aside
        className={`bg-indigo-900 text-white min-h-screen p-6 fixed top-0 left-0 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-3/4 md:relative md:shadow-lg`}
      >
        <h1 className="text-2xl font-bold mb-10 text-indigo-200 tracking-tight mt-14">
          Instructor
        </h1>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
};

export default InstructorSidebar;
