import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CategoryNav from "../components/CategoryNav";
import MenuCard from "../components/MenuCard";
import axios from "axios";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Coffee");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await axios.get(`http://localhost:5000/api/menu/${activeCategory}`);
      setMenuItems(res.data);
    };
    fetchMenu();
  }, [activeCategory]);

  return (
    <div className="flex flex-col flex-1 bg-[#E2E1E6]">
      <Header />
      <CategoryNav
        categories={["Coffee", "Pastry", "Cold Brew"]}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <MenuCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
