import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import DonateModal from "./DonateModal";

export default function DonationRequestDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/donations/${id}`)
      .then(res => res.json())
      .then(data => setRequest(data));
  }, [id]);

  if (!request) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Blood Donation Request</h2>

      <p><strong>Recipient Name:</strong> {request.recipientName}</p>
      <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
      <p><strong>Hospital:</strong> {request.hospitalName}</p>
      <p><strong>District:</strong> {request.district}</p>
      <p><strong>Address:</strong> {request.address}</p>
      <p><strong>Date:</strong> {request.date}</p>
      <p><strong>Time:</strong> {request.time}</p>
      <p><strong>Status:</strong> {request.status}</p>

      {request.status === "pending" && (
        <button
          onClick={() => setOpenModal(true)}
          className="mt-6 btn btn-primary"
        >
          Donate
        </button>
      )}

      {openModal && (
        <DonateModal
          user={user}
          donationId={id}
          closeModal={() => setOpenModal(false)}
          onSuccess={() => {
            setRequest({ ...request, status: "inprogress" });
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}
