import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";

const FundingPage = () => {
  const { user } = useAuth();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/funds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or failed to fetch");
        return res.json();
      })
      .then((data) => setFunds(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return <p className="text-center mt-20">Please login to view funding history.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Funding History</h2>

        <a
          href="/give-fund"
          className="btn btn-primary"
        >
          Give Fund
        </a>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Donor Name</th>
                <th>Amount (৳)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(funds) && funds.length > 0 ? (
                funds.map((fund, index) => (
                  <tr key={fund._id}>
                    <td>{index + 1}</td>
                    <td>{fund.donorName}</td>
                    <td>{fund.amount}</td>
                    <td>{new Date(fund.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No funds found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FundingPage;
