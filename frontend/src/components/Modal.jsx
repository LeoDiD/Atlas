import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Dimmed overlay (transparent, so homepage is still visible) */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      ></div>

      {/* White modal box on top */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
