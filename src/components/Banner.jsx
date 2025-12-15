import React from "react";
import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-red-500 text-white py-12 md:py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Join the Life-Saving Community
          </h1>

          <p className="mb-6 text-base md:text-xl">
            Donate blood, save lives. Be a hero today.
          </p>

          <div className="flex justify-center md:justify-start gap-3 flex-wrap">
            <button
              className="btn btn-primary btn-md md:btn-lg"
              onClick={() => navigate("/register")}
            >
              Join as a Donor
            </button>

            <button
              className="btn btn-outline btn-md md:btn-lg text-white border-white hover:bg-white hover:text-red-500"
              onClick={() => navigate("/search-donors")}
            >
              Search Donors
            </button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <img
            src="https://img.freepik.com/premium-vector/world-blood-day-concept-vector-flat-illustrations_199064-821.jpg?w=740&q=80"
            alt="Blood Donation"
            className="
              w-56
              sm:w-64
              md:w-72
              lg:w-80
              rounded-lg
              shadow-lg
            "
          />
        </div>

      </div>
    </section>
  );
};

export default Banner;
