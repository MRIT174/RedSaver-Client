import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const divisionsData = [
  { id: "1", name: "Dhaka" },
  { id: "2", name: "Chattagram" },
  { id: "3", name: "Khulna" },
  { id: "4", name: "Rajshahi" },
  { id: "5", name: "Barishal" },
  { id: "6", name: "Sylhet" },
  { id: "7", name: "Rangpur" },
  { id: "8", name: "Mymensingh" },
];

const districtsData = [
  { id: "1", name: "Dhaka", division_id: "1" },
  { id: "2", name: "Gazipur", division_id: "1" },
  { id: "3", name: "Chattagram", division_id: "2" },
  { id: "4", name: "Cox's Bazar", division_id: "2" },
  { id: "5", name: "Khulna", division_id: "3" },
  { id: "6", name: "Jessore", division_id: "3" },
];

const CreateDonationRequest = () => {
  const { user } = useAuth();

  const [filteredDistricts, setFilteredDistricts] = useState([]);

  const [formData, setFormData] = useState({
    recipientName: "",
    divisionId: "",
    districtId: "",
    hospital: "",
    address: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    message: "",
  });

  useEffect(() => {
    if (!formData.divisionId) {
      setFilteredDistricts([]);
      return;
    }

    const districts = districtsData.filter(
      (d) => d.division_id === formData.divisionId
    );

    setFilteredDistricts(districts);
    setFormData((prev) => ({ ...prev, districtId: "" }));
  }, [formData.divisionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.status === "blocked") {
      return alert("You are blocked and cannot create a donation request.");
    }

    const divisionName = divisionsData.find(
      (d) => d.id === formData.divisionId
    )?.name;

    const districtName = districtsData.find(
      (d) => d.id === formData.districtId
    )?.name;

    const payload = {
      requesterName: user?.name,
      requesterEmail: user?.email,
      recipientName: formData.recipientName,
      division: divisionName,
      district: districtName,
      hospital: formData.hospital,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      donationDate: formData.donationDate,
      donationTime: formData.donationTime,
      message: formData.message,
      status: "pending",
    };

    console.log("SUBMIT PAYLOAD ", payload);

    try {
      const res = await fetch("http://localhost:5000/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("redsaver_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Donation request created successfully!");
        setFormData({
          recipientName: "",
          divisionId: "",
          districtId: "",
          hospital: "",
          address: "",
          bloodGroup: "",
          donationDate: "",
          donationTime: "",
          message: "",
        });
        setFilteredDistricts([]);
      } else {
        alert("Failed to create donation request");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-500">
        Create Donation Request
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          value={user?.name || ""}
          readOnly
          className="input input-bordered bg-gray-100"
        />

        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="input input-bordered bg-gray-100"
        />

        <input
          name="recipientName"
          placeholder="Recipient Name"
          className="input input-bordered"
          value={formData.recipientName}
          onChange={handleChange}
          required
        />

        <select
          name="bloodGroup"
          className="select select-bordered"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select
          name="divisionId"
          className="select select-bordered"
          value={formData.divisionId}
          onChange={handleChange}
          required
        >
          <option value="">Select Division</option>
          {divisionsData.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          name="districtId"
          className="select select-bordered"
          value={formData.districtId}
          onChange={handleChange}
          disabled={!filteredDistricts.length}
          required
        >
          <option value="">Select District</option>
          {filteredDistricts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <input
          name="hospital"
          placeholder="Hospital Name"
          className="input input-bordered"
          value={formData.hospital}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Full Address"
          className="input input-bordered md:col-span-2"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="donationDate"
          className="input input-bordered"
          value={formData.donationDate}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="donationTime"
          className="input input-bordered"
          value={formData.donationTime}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Why blood is needed"
          className="textarea textarea-bordered md:col-span-2"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-error md:col-span-2 text-white">
          Request Blood
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
