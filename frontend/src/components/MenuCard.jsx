import React, { useState } from "react";
import Modal from "./Modal";

const BACKEND_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function MenuCard({ item, onAddToCart }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("Medium");
  const [sugar, setSugar] = useState("50%");
  const [addons, setAddons] = useState([]);

  const handleAddOnChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAddons([...addons, value]);
    } else {
      setAddons(addons.filter((a) => a !== value));
    }
  };

  const handleConfirm = () => {
    const orderItem = {
      ...item,
      size,
      sugar,
      addons,
    };

    if (onAddToCart) {
      onAddToCart(orderItem); // ✅ Pass data to parent (e.g., CheckoutSidebar)
    }

    setOpen(false);
  };

  return (
    <>
      {/* Coffee Card */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition w-[260px] relative">
        {/* Unavailable Overlay */}
        {item.available === false && (
          <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              UNAVAILABLE
            </span>
          </div>
        )}
        
        {/* Left: Coffee Image */}
        <div className={`flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-full bg-[#F5E6D3] ${item.available === false ? 'opacity-50' : ''}`}>
          <img
            src={item.image ? `${BACKEND_URL}${item.image}` : PLACEHOLDER_IMAGE}
            alt={item.name}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {/* Right: Info */}
        <div className={`flex flex-col flex-1 ${item.available === false ? 'opacity-50' : ''}`}>
          <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
          <p className="text-sm font-semibold text-[#6B4226] mt-1">
            ₱{item.price}
          </p>

          <button
            onClick={() => item.available !== false && setOpen(true)}
            disabled={item.available === false}
            className={`mt-2 px-3 py-1 rounded-md text-xs self-start transition ${
              item.available === false
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-800 hover:bg-[#6B4226] hover:text-white'
            }`}
          >
            {item.available === false ? 'Out of Stock' : 'View detail'}
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-bold text-[#6B4226] mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>

        {/* Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        {/* Sugar */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sugar Level</label>
          <select
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option>0%</option>
            <option>25%</option>
            <option>50%</option>
            <option>75%</option>
            <option>100%</option>
          </select>
        </div>

        {/* Add-ons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Add-ons</label>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" value="Extra Shot" onChange={handleAddOnChange} /> Extra Shot
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" value="Whipped Cream" onChange={handleAddOnChange} /> Whipped Cream
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" value="Caramel Drizzle" onChange={handleAddOnChange} /> Caramel Drizzle
            </label>
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          className="w-full bg-[#6B4226] text-white py-2 rounded-lg hover:bg-[#55331f] transition"
        >
          Add to Order
        </button>
      </Modal>
    </>
  );
}
