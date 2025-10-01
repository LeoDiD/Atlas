import React from "react";

export default function CategoryNav({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-4 px-6 py-4 bg-white">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-full font-medium ${
            activeCategory === cat
              ? "bg-[#6B4226] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
