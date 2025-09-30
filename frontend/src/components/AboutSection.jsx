import React from "react";
import cafeInterior from "../assets/images/interior.png";   // first image
import cafeCounter from "../assets/images/counter.png";     // second image

export default function AboutUs() {
  return (
    <section className="bg-[#E2E1E6] py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Text */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Take a seat,
            </h2>
            <p className="text-gray-800 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Sip slow, and let the aroma do the talking. Your perfect cup is
              waiting at our place.
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src={cafeInterior}
              alt="Cafe interior"
              className="rounded-xl shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Image */}
          <div className="flex justify-center md:order-1 order-2">
            <img
              src={cafeCounter}
              alt="Cafe counter"
              className="rounded-xl shadow-lg w-full max-w-md object-cover"
            />
          </div>

          {/* Text */}
          <div className="text-center md:text-left md:order-2 order-1">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Brewed from
            </h2>
            <p className="text-gray-800 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Hand-picked, 100% Arabica beans rich in flavor, low in bitterness,
              and naturally aromatic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
