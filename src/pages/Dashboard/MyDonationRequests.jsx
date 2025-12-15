import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";

const STATUS_COLORS = {
  pending: "bg-yellow-500",
  inprogress: "bg-blue-500",
  done: "bg-green-500",
  canceled: "bg-red-500",
};

const MyDonationRequests = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const fetchDonations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("redsaver_token");

        const res = await fetch(
          `http://localhost:5000/donations?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setDonations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  if (loading) {
    return (
      <p className="p-6 text-center text-lg font-semibold">
        Loading donation requests...
      </p>
    );
  }

  if (!donations.length) {
    return (
      <p className="p-6 text-center text-lg font-semibold">
        No donation requests found.
      </p>
    );
  }

  const filteredDonations = statusFilter
    ? donations.filter((d) => d.status === statusFilter)
    : donations;

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Donation Requests
      </h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium">Status:</label>
          <select
            className="select select-bordered w-48"
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <p className="text-gray-500">
          Total Requests: {filteredDonations.length}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedDonations.map((donation) => {
          const status = donation.status || "pending";

          return (
            <div
              key={donation._id}
              className="card bg-base-100 shadow-md border hover:shadow-xl transition"
            >
              <div className="card-body space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg text-red-500">
                    {donation.recipientName}
                  </h2>
                  <span
                    className={`text-white text-sm px-3 py-1 rounded-full ${
                      STATUS_COLORS[status]
                    }`}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <strong>Blood Group:</strong> {donation.bloodGroup}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {donation.district},{" "}
                  {donation.division}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Hospital:</strong> {donation.hospital}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {donation.address}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Date & Time:</strong>{" "}
                  {donation.donationDate} at {donation.donationTime}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Message:</strong> {donation.message}
                </p>

                <p className="text-xs text-gray-400">
                  Requested on:{" "}
                  {donation.createdAt
                    ? new Date(donation.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-error text-white" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
