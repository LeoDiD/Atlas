import React from "react";
import Navbar from "./NavBar"; // import navbar
import threeDCoffee from "../assets/images/3dcoffee.png";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#E2E1E6] font-sans">
      <Navbar /> {/* Navbar sticks on top */}

      {/* Hero Section */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 items-center justify-between 
        px-8 md:px-16 bg-[#6B4226] rounded-3xl mx-6 mt-8 gap-10
        min-h-[calc(100vh-80px)]"
      >
        {/* Text */}
        <div className="text-white max-w-xl">
          <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-8">
            Where good <br />
            Coffee <span className="text-amber-200">great</span> <br />
            Ideas meet!
          </h1>
          <p className="mb-8 text-base md:text-lg text-amber-100 leading-relaxed">
            When looking for a place to get work done, visit Atlas Coffee today,
            for your next great meeting or your best cup of coffee yet!
            Networking groups welcomed and accommodated
          </p>
          <button className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium">
            Discover our Menu
            <span className="bg-white text-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-xl">
              →
            </span>
          </button>
        </div>

        {/* Coffee Image */}
        <div className="flex justify-center md:justify-end">
          <img
            src={threeDCoffee}
            alt="Coffee Drinks"
            className="w-72 md:w-96 lg:w-[28rem] h-auto object-contain"
          />
        </div>
      </section>
    </div>
  );
}
