import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect users to the Coffee category
    navigate("/menu/Coffee", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F3EE]">
      <p className="text-gray-600 text-sm">Redirecting to Coffee menu...</p>
    </div>
  );
}
