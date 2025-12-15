import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiMoreVertical } from "react-icons/fi";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("AxiosError", err.response?.status, err.response?.data);
      showAlert("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const toggleBlock = async (user) => {
    try {
      const endpoint =
        user.status === "active"
          ? `/users/block/${user.email}`
          : `/users/unblock/${user.email}`;
      await api.patch(endpoint);
      fetchUsers();
      showAlert(
        `User "${user.name}" is now ${
          user.status === "active" ? "blocked" : "active"
        }`
      );
    } catch (err) {
      console.error(err);
      showAlert("Action failed", "error");
    }
  };

  const changeRole = async (user, role) => {
    try {
      await api.patch(`/users/role/${user.email}`, { role });
      fetchUsers();
      showAlert(`User "${user.name}" is now ${role}`);
    } catch (err) {
      console.error(err);
      showAlert("Action failed", "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    filter === "all" ? true : u.status === filter
  );

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">Loading users...</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Users</h2>

      {alert.show && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            alert.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <span className="font-medium text-gray-700">Filter by status:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-100 text-left">
            <tr>
              <th className="px-4 py-2">Avatar</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((u) => (
              <tr key={u.email} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  {u.email}
                </td>
                <td className="px-4 py-2 text-gray-600">{u.name}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : u.role === "volunteer"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      u.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === u.email ? null : u.email)
                    }
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <FiMoreVertical size={20} />
                  </button>

                  {dropdownOpen === u.email && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
                      {u.status === "active" ? (
                        <button
                          onClick={() => toggleBlock(u)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Block User
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleBlock(u)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Unblock User
                        </button>
                      )}

                      {u.role !== "volunteer" && (
                        <button
                          onClick={() => changeRole(u, "volunteer")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Make Volunteer
                        </button>
                      )}

                      {u.role !== "admin" && (
                        <button
                          onClick={() => changeRole(u, "admin")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
