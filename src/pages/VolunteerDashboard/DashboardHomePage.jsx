import React, { useEffect, useState } from "react";
import { FaUsers, FaTint } from "react-icons/fa";
import { auth } from "../../firebaseConfig";
import axios from "axios";

const DashboardHomePage = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        const usersRes = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(Array.isArray(usersRes.data) ? usersRes.data.length : 0);

        const donationsRes = await axios.get("http://localhost:5000/donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalRequests(Array.isArray(donationsRes.data) ? donationsRes.data.length : 0);
      } catch (err) {
        console.error("Failed to fetch stats:", err.response?.data || err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome Back, <span className="text-red-500">Volunteer</span> 👋
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl p-4 flex items-center gap-4">
          <div className="p-4 rounded-full bg-red-100 text-red-500 text-2xl">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl p-4 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-500 text-2xl">
            <FaTint />
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Blood Donation Requests</h2>
            <p className="text-3xl font-bold">{totalRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
