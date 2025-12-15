import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

const AllBloodDonationRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const token = await currentUser.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get("http://localhost:5000/donations", { headers });
        setRequests(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch requests:", err.response?.data || err.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [auth]);

  const filteredRequests =
    filter === "all" ? requests : requests.filter(r => r.status === filter);

  const updateStatus = async (id, newStatus) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

      await axios.patch(`http://localhost:5000/donations/${id}`, { status: newStatus }, { headers });

      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status: newStatus } : r))
      );
      alert("Donation status updated!");
    } catch (err) {
      console.error("Failed to update status:", err.response?.data || err.message);
    }
  };

  if (loading)
    return <p className="p-4 text-center text-gray-500">Loading donation requests...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Blood Donation Requests</h1>

      <div className="mb-4">
        <select
          className="select select-bordered w-48"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Blood Group</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr key={req._id}>
                <td>{req.title}</td>
                <td>{req.bloodGroup}</td>
                <td>{req.description}</td>
                <td>
                  <span
                    className={`badge ${
                      req.status === "completed" ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status !== "completed" && (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => updateStatus(req._id, "completed")}
                    >
                      Mark Completed
                    </button>
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

export default AllBloodDonationRequestPage;
