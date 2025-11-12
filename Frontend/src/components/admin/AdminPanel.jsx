import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const AdminPanel = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden cursor-pointer fixed top-1/2 transform -translate-y-1/2 z-50 p-2 bg-[#9f6b4a] text-white rounded-full ${isSidebarOpen ? 'left-56' : 'left-2'
          } transition-all duration-300`}
      >
        {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 w-56 md:w-96 h-full md:h-auto pt-20 bg-[#9f6b4a] text-white p-5 space-y-4 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `hover:bg-[#80492f] p-2 rounded ${isActive ? 'bg-[#80492f]' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="products"
            className={({ isActive }) =>
              `hover:bg-[#80492f] p-2 rounded ${isActive ? 'bg-[#80492f]' : ''}`
            }
          >
            Manage Products
          </NavLink>
          <NavLink
            to="orders"
            className={({ isActive }) =>
              `hover:bg-[#80492f] p-2 rounded ${isActive ? 'bg-[#80492f]' : ''}`
            }
          >
            Manage Orders
          </NavLink>
          <NavLink
            to="users"
            className={({ isActive }) =>
              `hover:bg-[#80492f] p-2 rounded ${isActive ? 'bg-[#80492f]' : ''}`
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="reviews"
            className={({ isActive }) =>
              `hover:bg-[#80492f] p-2 rounded ${isActive ? 'bg-[#80492f]' : ''}`
            }
          >
            Manage Reviews
          </NavLink>
          <NavLink
            to="testimonals"
            className={({ isActive }) =>
              `hover:bg-[#80492f] p-2 rounded ${isActive ? 'bg-[#80492f]' : ''}`
            }
          >
            Manage Testimonals
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`p-6 transition-all duration-300 w-full ${isSidebarOpen ? '' : 'ml-0'
          }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
