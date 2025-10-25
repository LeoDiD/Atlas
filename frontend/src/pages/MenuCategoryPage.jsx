import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='128'%3E%3Crect width='300' height='128' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function MenuCategoryPage() {
  const { category } = useParams(); // e.g. "Cold Brew"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/menu?category=${category}`)
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load category items:", err);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="p-6 bg-[#E2E1E6] min-h-screen">
      <h2 className="text-3xl font-bold text-[#6B4226] mb-6">
        {decodeURIComponent(category)} Menu
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No items found for {category}.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <img
                src={item.image ? `${BACKEND_URL}${item.image}` : PLACEHOLDER_IMAGE}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <h3 className="font-semibold text-[#6B4226] text-lg">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                {item.description || "No description"}
              </p>
              <p className="font-bold text-[#6B4226]">₱{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
