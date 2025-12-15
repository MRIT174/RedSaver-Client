import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import divisionsJSON from "../../../public/data/divisions.json";
import districtsJSON from "../../../public/data/districts.json";

const divisionsData = divisionsJSON.find((j) => j.type === "table")?.data || [];
const districtsData = districtsJSON.find((j) => j.type === "table")?.data || [];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    division: "",
    district: "",
    bloodGroup: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/users/${user.email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("redsaver_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDbUser(data);
        setFormData({
          name: data.name || "",
          division: data.division || "",
          district: data.district || "",
          bloodGroup: data.bloodGroup || "",
        });
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, [user?.email]);

  useEffect(() => {
    if (!formData.division) {
      setFilteredDistricts([]);
      setFormData((prev) => ({ ...prev, district: "" }));
      return;
    }
    const filtered = districtsData.filter(
      (d) => String(d.division_id) === String(formData.division)
    );
    setFilteredDistricts(filtered);
    setFormData((prev) => ({ ...prev, district: "" }));
  }, [formData.division]);

  if (!user || !dbUser) return <p className="p-6">Loading profile...</p>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const idToken = localStorage.getItem("redsaver_token");

      const divisionName =
        divisionsData.find((d) => String(d.id) === String(formData.division))
          ?.name || formData.division;
      const districtName =
        districtsData.find((d) => String(d.id) === String(formData.district))
          ?.name || formData.district;

      const updatedData = {
        ...formData,
        division: divisionName,
        district: districtName,
      };

      const res = await fetch(`http://localhost:5000/users/${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      if (result.success) {
        setDbUser(updatedData);
        setUser((prev) => ({ ...prev, ...updatedData }));
        setOpen(false);
        alert("Profile Updated Successfully!");
      } else {
        alert("Update failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">
          View and manage your account information
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="avatar">
          <div className="w-32 rounded-full ring ring-red-500 ring-offset-2">
            <img
              src={
                dbUser?.avatar || user?.photoURL || "/images/default-avatar.png"
              }
              alt="User Avatar"
            />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {dbUser?.name || user?.displayName || "Unnamed User"}
          </h2>
          <p className="text-gray-600 mt-1">{user?.email}</p>

          <div className="mt-3 flex gap-3 flex-wrap">
            <span className="badge badge-info text-white px-4 py-2">
              Role: {dbUser?.role || "donor"}
            </span>
            <span
              className={`badge px-4 py-2 text-white ${
                dbUser?.status === "blocked" ? "badge-error" : "badge-success"
              }`}
            >
              {dbUser?.status || "active"}
            </span>
            <span className="badge badge-error text-white px-4 py-2">
              Blood: {dbUser?.bloodGroup || "N/A"}
            </span>
          </div>

          <div className="mt-4 text-gray-700">
            <p>
              <span className="font-semibold">Division:</span>{" "}
              {dbUser.division || "Not set"}
            </p>
            <p>
              <span className="font-semibold">District:</span>{" "}
              {dbUser.district || "Not set"}
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="btn btn-error text-white mt-5"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <select
                className="select select-bordered w-full"
                value={formData.division || ""}
                onChange={(e) =>
                  setFormData({ ...formData, division: e.target.value })
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
                value={formData.district || ""}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
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

              <input
                type="text"
                placeholder="Blood Group"
                className="input input-bordered w-full"
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-error text-white">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
