import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-8 md:px-20 py-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <img
            src="/atlas.png" // using public folder
            alt="Atlas Coffee"
            className="h-10 w-auto mb-4"
          />
          <p className="text-sm leading-relaxed">
            Crafted for coffee lovers. A space where great brews meet even
            greater conversations.
          </p>
          <p className="text-xs mt-6 text-gray-500">
            © {new Date().getFullYear()} Atlas Coffee. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Menu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>123 Coffee Street, Manila</li>
            <li>(+63) 912-345-6789</li>
            <li>hello@atlascoffee.com</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-amber-500 transition">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-amber-500 transition">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-amber-500 transition">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
