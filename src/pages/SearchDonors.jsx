import React, { useEffect, useState } from "react";
import divisionsJSON from "../../public/data/divisions.json";
import districtsJSON from "../../public/data/districts.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const divisionsData = divisionsJSON.find((j) => j.type === "table")?.data || [];
const districtsData = districtsJSON.find((j) => j.type === "table")?.data || [];

const SearchDonors = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    divisionId: "",
    districtId: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    if (!formData.divisionId) {
      setFilteredDistricts([]);
      setFormData((prev) => ({ ...prev, districtId: "" }));
      return;
    }

    const filtered = districtsData.filter(
      (d) => String(d.division_id) === String(formData.divisionId)
    );

    setFilteredDistricts(filtered);
    setFormData((prev) => ({ ...prev, districtId: "" }));
  }, [formData.divisionId]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("redsaver_token");
    if (!token) {
      return alert("You are not logged in. Please login first.");
    }

    const divisionName =
      divisionsData.find((d) => String(d.id) === String(formData.divisionId))
        ?.name || "";

    const districtName =
      districtsData.find((d) => String(d.id) === String(formData.districtId))
        ?.name || "";

    try {
      const queryObj = {
        bloodGroup: formData.bloodGroup,
        division: divisionName,
        district: districtName,
      };

      const query = new URLSearchParams(queryObj).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/donations?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) throw new Error("Unauthorized. Please login again.");
      if (!res.ok) throw new Error("Failed to fetch donation requests");

      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err.message);
      setDonors([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-500">
        Search Donors
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        onSubmit={handleSearch}
      >
        <select
          className="select select-bordered w-full"
          value={formData.bloodGroup}
          onChange={(e) =>
            setFormData({ ...formData, bloodGroup: e.target.value })
          }
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={formData.divisionId}
          onChange={(e) =>
            setFormData({ ...formData, divisionId: e.target.value })
          }
        >
          <option value="">Select Division</option>
          {divisionsData.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={formData.districtId}
          onChange={(e) =>
            setFormData({ ...formData, districtId: e.target.value })
          }
          disabled={!filteredDistricts.length}
        >
          <option value="">Select District</option>
          {filteredDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="btn btn-primary col-span-1 md:col-span-3"
        >
          Search
        </button>
      </form>

      {donors.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {donors.map((donor) => {
            const recipientName = donor.recipientName || "N/A";
            const bloodGroup = donor.bloodGroup || "N/A";
            const division = donor.division || "N/A";
            const district = donor.district || "N/A";
            const hospital = donor.hospital || "N/A";
            const donationTime = donor.donationTime || "N/A";
            const donationDate = donor.donationDate
              ? new Date(donor.donationDate).toLocaleDateString()
              : "N/A";
            const address = donor.address || "N/A";

            return (
              <div
                key={donor._id}
                className="card bg-base-100 shadow-md border hover:shadow-xl transition duration-300"
              >
                <div className="card-body space-y-2">
                  <h3 className="text-xl font-bold text-red-500">{recipientName}</h3>

                  <span className="badge badge-error badge-outline w-fit">
                    {bloodGroup}
                  </span>

                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="badge badge-success badge-outline">
                      {division}
                    </span>
                    <span className="badge badge-success badge-outline">
                      {district}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">
                    <strong>Hospital:</strong> {hospital}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Donation Time:</strong> {donationTime} | {donationDate}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Address:</strong> {address}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No donors found.</p>
      )}
    </div>
  );
};

export default SearchDonors;
