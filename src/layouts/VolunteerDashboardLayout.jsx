import { NavLink, Outlet } from "react-router";
import { FaHome, FaTint, FaBars } from "react-icons/fa";

const VolunteerDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-64 bg-base-100 shadow-xl flex flex-col fixed h-screen">
        <div className="p-6 bg-red-500 text-white">
          <h2 className="text-2xl font-extrabold">🩸 BloodCare</h2>
          <p className="text-sm opacity-90">Volunteer Panel</p>
        </div>

        <ul className="menu p-4 gap-1 flex-1 overflow-y-auto">
          <li>
            <NavLink
              to="/volunteer"
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
              to="/volunteer/all-blood-donation-request"
              className={({ isActive }) =>
                isActive ? "bg-red-500 text-white font-semibold" : ""
              }
            >
              <FaTint /> Blood Requests
            </NavLink>
          </li>
        </ul>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-10">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="volunteer-drawer"
              className="btn btn-square btn-ghost"
            >
              <FaBars />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-red-500">
              Volunteer Dashboard
            </h1>
          </div>
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VolunteerDashboardLayout;
