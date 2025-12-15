import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST);

const CheckoutForm = ({ amount }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to initiate payment");
      });
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent?.status === "succeeded") {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/funds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            donorName: user.displayName,
            donorEmail: user.email,
          }),
        });

        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Payment failed. Try again.");
    }

    setLoading(false);
  };

  if (!clientSecret) return <p>Loading payment form...</p>;

  if (success)
    return (
      <p className="text-green-600 text-lg">
        Payment successful! Thank you for your contribution.
      </p>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Give Fund - ৳{amount}</h2>
      <PaymentElement />
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      <button
        type="submit"
        className="btn btn-primary w-full mt-4"
        disabled={loading || !stripe}
      >
        {loading ? "Processing..." : `Pay ৳${amount}`}
      </button>
    </form>
  );
};

const GiveFund = () => {
  const [amount, setAmount] = useState(500);

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded shadow">
        <label className="block mb-4">
          Amount (BDT)
          <input
            type="number"
            className="input input-bordered w-full mt-1"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value)))}
          />
        </label>
        <CheckoutForm amount={amount} />
      </div>
    </Elements>
  );
};

export default GiveFund;
