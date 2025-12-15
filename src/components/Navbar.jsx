import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return;
      try {
        const token = localStorage.getItem("redsaver_token");
        const res = await axios.get(`/users/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDbUser(res.data);
      } catch (err) {
        console.error("Navbar user fetch failed:", err);
      }
    };
    fetchUser();
  }, [user]);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("redsaver_token");
      setDbUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const dashboardPath =
    dbUser?.role === "admin"
      ? "/admin"
      : dbUser?.role === "volunteer"
      ? "/volunteer"
      : "/dashboard";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-red-600">
              RedSaver
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/" className="font-medium">
              Home
            </NavLink>
            <NavLink to="/search-donors" className="font-medium">
              Search Donors
            </NavLink>
            <NavLink to="/donation-requests" className="font-medium">
              Donation Requests
            </NavLink>
            <NavLink to="/funding" className="font-medium">
              Funding
            </NavLink>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={
                      dbUser?.avatar ||
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        dbUser?.name || user.displayName || "User"
                      )}`
                    }
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{dbUser?.name || user.displayName}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow">
                    <Link
                      to={dashboardPath}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={`${dashboardPath}/profile`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {open ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t">
          <NavLink
            to="/"
            className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/search-donors"
            className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Search Donors
          </NavLink>
          <NavLink
            to="/donation-requests"
            className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Donation Requests
          </NavLink>
          <NavLink
            to="/funding"
            className="block px-3 py-2 rounded-md font-medium hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Funding
          </NavLink>

          {!user ? (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 border rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={dashboardPath}
                className="block px-3 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to={`${dashboardPath}/profile`}
                className="block px-3 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
