import React, { useState } from "react";
import Modal from "./Modal";

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
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition w-[260px]">
        {/* Left: Coffee Image */}
        <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-full bg-[#F5E6D3]">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
          <p className="text-sm font-semibold text-[#6B4226] mt-1">
            ₱{item.price}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-xs self-start hover:bg-[#6B4226] hover:text-white transition"
          >
            View detail
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
