import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("redsaver_token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/donations?status=pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Pending Blood Donation Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending donation requests found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Blood Group</th>
                <th>Division</th>
                <th>District</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req, i) => (
                <tr key={req._id}>
                  <td>{i + 1}</td>
                  <td>{req.title}</td>
                  <td>{req.bloodGroup}</td>
                  <td>{req.division}</td>
                  <td>{req.district}</td>
                  <td>
                    <span className="badge badge-warning">
                      {req.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/donation-requests/${req._id}`}
                      className="btn btn-xs btn-info"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
