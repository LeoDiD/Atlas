import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import FeaturedSection from "./components/FeaturedSection";
import AboutSection from "./components/AboutSection";
import FooterSection from "./components/FooterSection";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";  // ✅ import your Home page
import MenuPage from "./pages/MenuPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#E2E1E6]">
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />
                <FeaturedSection />
                <AboutSection />
                <FooterSection />
              </>
            } 
          />

          {/* Home Dashboard */}
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} /> {/* 👈 now menu works */}

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
