import React from "react";
import Sidebar from "../components/Sidebar";
import { NavLink, Outlet } from "react-router";
import { FaBars } from "react-icons/fa";

export default function DashboardLayout() {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-10">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
            >
              <FaBars />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-red-500">
              Donor User Dashboard
            </h1>
          </div>
          <NavLink to="/" className="btn btn-outline btn-md md:btn-lg">
            Home
          </NavLink>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-64 bg-base-100 shadow-xl min-h-screen sticky top-0">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
