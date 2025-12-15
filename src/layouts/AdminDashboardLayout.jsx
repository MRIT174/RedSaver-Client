import { NavLink, Outlet, useNavigate } from "react-router";
import { FaHome, FaUsers, FaTint, FaBars } from "react-icons/fa";

const AdminDashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-10">
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <FaBars />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-red-500">Admin Dashboard</h1>
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
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>

        <aside className="w-64 bg-base-100 shadow-xl min-h-screen sticky top-0">
          <div className="p-6 bg-linear-to-r from-red-500 to-pink-500 text-white">
            <h2 className="text-2xl font-extrabold">🩸 BloodCare</h2>
            <p className="text-sm opacity-90">Admin Panel</p>
          </div>

          <ul className="menu p-4 text-base-content gap-1">
            <li>
              <NavLink
                to="/admin"
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
                to="/admin/all-users"
                className={({ isActive }) =>
                  isActive ? "bg-red-500 text-white font-semibold" : ""
                }
              >
                <FaUsers /> All Users
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/all-blood-donation-request"
                className={({ isActive }) =>
                  isActive ? "bg-red-500 text-white font-semibold" : ""
                }
              >
                <FaTint /> Blood Requests
              </NavLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
