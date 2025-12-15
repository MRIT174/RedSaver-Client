import React from "react";

const FeaturedCard = ({ icon, title, count, color }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow ${color} text-white flex items-center gap-4`}
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default FeaturedCard;
