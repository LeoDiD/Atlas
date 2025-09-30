import HeroSection from "./components/HeroSection";
import FeaturedSection from "./components/FeaturedSection";
import AboutSection from "./components/AboutSection";
import FooterSection from "./components/FooterSection";

function App() {
  return (
    <div className="min-h-screen bg-[#E2E1E6]">
      <HeroSection />
      <FeaturedSection />
      <AboutSection />
      <FooterSection />
    </div>
  );
}

export default App;
