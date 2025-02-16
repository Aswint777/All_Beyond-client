import React from 'react'
import { NavLink } from 'react-router-dom';

const StudentSideBar = () => {    

      const links = [
        { name: "Overviewwww", path: "/admin/overview" },
        { name: "Courses", path: "/admin/courses" },
        { name: "Students", path: "/admin/AdminStudentsListPage" },
        { name: "Instructors", path: "/admin/AdminInstructorApplicationList" },
        { name: "Assessments", path: "/admin/assessments" },
        { name: "Categories", path: "/admin/categoryListPage" },
        { name: "Transactions", path: "/admin/transactions" },
        { name: "Banners", path: "/admin/banners" },
        { name: "Complaints", path: "/admin/complaints" },
        { name: "Settings", path: "/admin/settings" },
      ];
    
      return (
        <aside className="w-1/5 bg-purple-100 p-5 min-h-screen">
          <h1 className="text-xl font-bold mb-8 text-purple-700">Admin</h1>
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
            <button
              className="block w-full text-left p-3 rounded-lg text-purple-700 hover:bg-purple-300"
            >
              LogOut
            </button>
          </nav>
        </aside>
      );    
}

export default StudentSideBar
