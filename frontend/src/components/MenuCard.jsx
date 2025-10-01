import React from "react";

export default function MenuCard({ item }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-full mb-4"
      />
      <h3 className="font-semibold text-gray-800">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{item.description}</p>
      <p className="font-bold text-[#6B4226] mb-4">₱{item.price}</p>
      <button className="bg-[#6B4226] text-white px-4 py-2 rounded-lg hover:bg-[#55331f] transition">
        View detail
      </button>
    </div>
  );
}
