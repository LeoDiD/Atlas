import React from "react";
import icedCoffee from "../assets/images/iced.png";   // Signature Iced Coffee (big hero)
import matchaLatte from "../assets/images/matcha.png";    // Iced Matcha Latte
import espressoLatte from "../assets/images/espresso.png"; // Espresso Latte
import caramelMacchiato from "../assets/images/caramel.png"; // Caramel Macchiato

export default function FeaturedDrinks() {
  return (
    <section className="bg-[#E2E1E6] py-16 px-6 md:px-20">
      {/* Featured Drink Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-12">
        <img
          src={icedCoffee}
          alt="Signature Iced Coffee"
          className="w-full h-[400px] md:h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-12">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Signature Iced Coffee
          </h2>
          <p className="text-white/90 text-lg max-w-2xl">
            Crafted with the finest single-origin beans, steamed milk, and
            intricate latte art, a perfect balance of flavor and artistry.
          </p>
        </div>
      </div>

      {/* Drink Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Matcha */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={matchaLatte}
            alt="Iced Matcha Latte"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-semibold mb-2">
              Iced Matcha Latte
            </h3>
            <p className="text-white/90 text-sm">
              Premium ceremonial grade matcha whisked to perfection with your choice of milk over ice.
            </p>
          </div>
        </div>

        {/* Espresso */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={espressoLatte}
            alt="Espresso Latte"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-semibold mb-2">
              Espresso Latte
            </h3>
            <p className="text-white/90 text-sm">
              Sweet vanilla syrup, steamed milk, a layer of rich espresso, and a delicate caramel drizzle.
            </p>
          </div>
        </div>

        {/* Caramel */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={caramelMacchiato}
            alt="Caramel Macchiato"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-semibold mb-2">
              Caramel Macchiato
            </h3>
            <p className="text-white/90 text-sm">
              Sweet vanilla syrup, steamed milk, a layer of rich espresso, and a delicate caramel drizzle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
