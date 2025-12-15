import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted! We will contact you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <textarea
            placeholder="Your Message"
            className="textarea textarea-bordered w-full"
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
          <button type="submit" className="btn btn-primary w-full">
            Send Message
          </button>
        </form>
        <div className="mt-6 text-center text-gray-700">
          <p>Contact Number: <span className="font-semibold">+880 1234 567890</span></p>
          <p>Email: <span className="font-semibold">info@blooddonor.com</span></p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
