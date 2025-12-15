import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import {
  FaHome,
  FaUser,
  FaTint,
  FaPlusCircle,
  FaUsers,
  FaListAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-base-100 shadow-xl min-h-screen sticky top-0">
      <div className="p-6 bg-linear-to-r from-red-500 to-pink-500 text-white">
        <h2 className="text-2xl font-extrabold">RedSaver</h2>
        <p className="text-sm opacity-90">Donor Dashboard</p>
      </div>

      <ul className="menu p-4 text-base-content gap-1">
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "bg-red-500 text-white font-semibold" : ""
            }
          >
            <FaHome /> Dashboard Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              isActive ? "bg-red-500 text-white font-semibold" : ""
            }
          >
            <FaUser /> My Profile
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/my-donation-requests"
            className={({ isActive }) =>
              isActive ? "bg-red-500 text-white font-semibold" : ""
            }
          >
            <FaTint /> My Donation Requests
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/create-donation-request"
            className={({ isActive }) =>
              isActive ? "bg-red-500 text-white font-semibold" : ""
            }
          >
            <FaPlusCircle /> Create Request
          </NavLink>
        </li>

        {(user?.role === "admin" || user?.role === "volunteer") && (
          <li>
            <NavLink
              to="/dashboard/all-blood-donation-request"
              className={({ isActive }) =>
                isActive ? "bg-red-500 text-white font-semibold" : ""
              }
            >
              <FaListAlt /> All Donation Requests
            </NavLink>
          </li>
        )}

        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/dashboard/all-users"
              className={({ isActive }) =>
                isActive ? "bg-red-500 text-white font-semibold" : ""
              }
            >
              <FaUsers /> All Users
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
}
