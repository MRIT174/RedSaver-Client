import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiMoreVertical } from "react-icons/fi";

const AllDonationRequests = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/donations");
      setDonations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch donations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (donation, status) => {
    try {
      await api.patch(`/donations/${donation._id}`, { status });
      fetchRequests();
      setDropdownOpen(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDonation = async (donation) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await api.delete(`/donations/${donation._id}`);
      fetchRequests();
      setDropdownOpen(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-error">
        All Blood Donation Requests
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border">
        <table className="table table-zebra">
          <thead className="bg-error text-white">
            <tr>
              <th>#</th>
              <th>Request Title</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Email</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d, index) => (
              <tr key={d._id} className="hover">
                <td>{index + 1}</td>
                <td className="font-semibold">{d.title || "N/A"}</td>
                <td>
                  <span className="badge badge-outline badge-error">
                    {d.bloodGroup}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge capitalize ${
                      d.status === "pending"
                        ? "badge-warning"
                        : d.status === "approved"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>

                <td className="text-sm">{d.email}</td>
                <td className="text-center relative">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === d._id ? null : d._id)
                    }
                  >
                    <FiMoreVertical size={18} />
                  </button>

                  {dropdownOpen === d._id && (
                    <div className="absolute right-6 top-10 z-50">
                      <ul className="menu bg-base-100 shadow-xl rounded-box w-40 border">
                        {d.status !== "approved" && (
                          <li>
                            <button onClick={() => updateStatus(d, "approved")}>
                              Approve
                            </button>
                          </li>
                        )}

                        {d.status !== "rejected" && (
                          <li>
                            <button onClick={() => updateStatus(d, "rejected")}>
                              Reject
                            </button>
                          </li>
                        )}

                        <li>
                          <button
                            onClick={() => deleteDonation(d)}
                            className="text-error"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {donations.length === 0 && (
          <p className="text-center py-10 text-gray-500">
            No donation requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllDonationRequests;
