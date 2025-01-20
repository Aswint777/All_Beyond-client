import React from "react";
import { NavLink } from "react-router-dom";

const AdminSideBar = () => {
  const links = [
    { name: "Overview", path: "/admin/overview" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Assessments", path: "/admin/assessments" },
    { name: "Categories", path: "/admin/categories" },
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
      </nav>
    </aside>
  );
};

export default AdminSideBar;
