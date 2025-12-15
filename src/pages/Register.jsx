import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router";
import { api } from "../api/apiClient";

export default function Register() {
  const navigate = useNavigate();

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "A+",
    division: "",
    district: "",
    avatar: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);

  useEffect(() => {
    if (!form.division) {
      setFilteredDistricts([]);
      setForm(prev => ({ ...prev, district: "" }));
      return;
    }
    const filtered = districtsData.filter(d => d.division_id === form.division);
    setFilteredDistricts(filtered);
    setForm(prev => ({ ...prev, district: "" }));
  }, [form.division]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, bloodGroup, division, district, avatar } = form;

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name, photoURL: avatar || "" });
      const idToken = await cred.user.getIdToken();
      localStorage.setItem("redsaver_token", idToken);

      const divisionName = divisionsData.find(d => d.id === division)?.name || "";
      const districtName = districtsData.find(d => d.id === district)?.name || "";

      await api.post("/users", {
        email,
        name,
        bloodGroup,
        avatar,
        division: divisionName,
        district: districtName,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="w-full max-w-md bg-white shadow p-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input className="input input-bordered w-full mb-2" placeholder="Name"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

        <input className="input input-bordered w-full mb-2" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

        <input type="password" className="input input-bordered w-full mb-2" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

        <select className="select select-bordered w-full mb-2" value={form.bloodGroup}
          onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select className="select select-bordered w-full mb-2" value={form.division}
          onChange={e => setForm({ ...form, division: e.target.value })} required>
          <option value="">Select Division</option>
          {divisionsData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <select className="select select-bordered w-full mb-2" value={form.district}
          disabled={!filteredDistricts.length} onChange={e => setForm({ ...form, district: e.target.value })} required>
          <option value="">Select District</option>
          {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <input className="input input-bordered w-full mb-3" placeholder="Avatar URL (optional)"
          value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} />

        <button className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
}
