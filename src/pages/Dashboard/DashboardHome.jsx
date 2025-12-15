import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import axios from "axios";

export default function DashboardHome() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("redsaver_token");

      const userRes = await axios.get(`/users/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbUser(userRes.data);

      const donationRes = await axios.get(
        `/dashboard/my-donations?page=1&limit=3`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDonations(donationRes.data.results || []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <span className="loading loading-spinner text-red-600"></span>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-red-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">
          Welcome, {dbUser?.name || user?.displayName || "Donor"} 👋
        </h1>
        <p className="opacity-90">Here is your recent donation activity.</p>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Recent Donations</h2>
          <a href="/dashboard/my-donations" className="text-red-600 text-sm">
            View All →
          </a>
        </div>

        {donations.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            No donation records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="hover">
                    <td>{d.recipientName}</td>
                    <td>
                      {d.recipientDistrict}, {d.recipientUpazila}
                    </td>
                    <td>
                      <span className="badge badge-error text-white">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td>{d.donationDate}</td>
                    <td>{d.donationTime}</td>
                    <td>
                      <span
                        className={`badge text-white ${
                          d.status === "pending"
                            ? "badge-warning"
                            : d.status === "completed"
                            ? "badge-success"
                            : "badge-neutral"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
