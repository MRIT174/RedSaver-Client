import React, { useEffect, useState } from "react";
import { useAuth } from "../../Hook/useAuth";
import api from "../../api/axios";
import { FaUsers, FaDonate, FaTint } from "react-icons/fa";

const AdminDashboardHome = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunds: 0,
    totalDonations: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const usersRes = await api.get("/users");
      const totalUsers = usersRes.data.length;

      const donationsRes = await api.get("/donations");
      const totalFunds = donationsRes.data.reduce(
        (acc, d) => acc + (d.amount || 0),
        0
      );

      const totalDonations = donationsRes.data.length;

      setStats({ totalUsers, totalFunds, totalDonations });
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user)
    return (
      <p className="p-4 text-red-500">Please login to view the dashboard</p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user.email}
      </h1>
      <p className="mb-8 text-gray-600">This is your Admin Dashboard Home</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {loadingStats ? "..." : stats.totalUsers}
            </p>
            <p className="text-gray-500">Total Users</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <FaDonate size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {loadingStats ? "..." : `$${stats.totalFunds}`}
            </p>
            <p className="text-gray-500">Total Funds</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <FaTint size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {loadingStats ? "..." : stats.totalDonations}
            </p>
            <p className="text-gray-500">Blood Donation Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
