import React from "react";
import { GiLoveInjection } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";
import { TbHeartHandshake } from "react-icons/tb";

const Featured = () => {
  const features = [
    {
      title: "Save Lives",
      description: "Every donation can help multiple patients in need.",
      icon: <GiLoveInjection/>,
    },
    {
      title: "Community Impact",
      description: "Be a part of a compassionate and lifesaving community.",
      icon: <TbHeartHandshake />,
    },
    {
      title: "Health Benefits",
      description: "Regular donation is healthy and rewarding.",
      icon: <MdHealthAndSafety />,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Donate Blood?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 items-center"
            >
              <div className="text-5xl mb-4 text-red-500">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
