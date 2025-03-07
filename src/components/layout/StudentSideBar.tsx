import React from 'react'
import { NavLink } from 'react-router-dom';

const StudentSideBar = () => {    

      const links = [
        { name: "Overview", path: "/overview" },
        { name: "Courses", path: "/courses" },
        { name: "Assessments", path: "/assessments" },
        { name: "Complaints", path: "/complaints" },
        { name: "Settings", path: "/settings" },
      ];
    
      return (
        <aside className="w-1/5 bg-purple-100 p-5 min-h-screen">
          <h1 className="text-xl font-bold mb-8 text-purple-700">Student</h1>
          <nav className="space-y-4">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block p-3 rounded-lg ${
                    isActive
                      ? "bg-purple-500 text-white"
                      : "hover:bg-purple-300 text-purple-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

          </nav>
        </aside>
      );    
}

export default StudentSideBar
