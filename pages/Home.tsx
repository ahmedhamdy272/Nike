import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import Categories from "../Components/Categories";
import Products from "../Components/Products";
import Popular from "../Components/Popular";
import Best from "../Components/Best";
import Hook from "../Components/Hook";
import Footer from "../Components/Footer";
import "../src/App.css";

interface HomeProps {
  onBuyClick?: () => void;
  onAddToCart?: () => void;
}

const sectionsList = [
  { id: "home", label: "Home" },
  { id: "products", label: "New Arrivals" },
  { id: "categories", label: "Categories" },
  { id: "popular", label: "Trending" },
  { id: "about", label: "Best Shoes" },
  { id: "hook", label: "Subscribe" },
];

const Home: React.FC<HomeProps> = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: "-25% 0px -35% 0px", // triggers when section is near the middle of viewport
      threshold: 0.1, // triggers if at least 10% is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionsList.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-gray-50 antialiased overflow-x-hidden scroll-smooth flex flex-col justify-between">
      {/* Sticky Navigation Header */}
      <Header />

      {/* Floating Sidebar Dot Navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 bg-black/25 backdrop-blur-md px-3.5 py-6 rounded-full border border-white/10 shadow-xl">
        {sectionsList.map((sec) => (
          <button
            key={sec.id}
            onClick={() => {
              const el = document.getElementById(sec.id);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center justify-center cursor-pointer"
            aria-label={`Scroll to ${sec.label}`}
          >
            {/* Hover Label */}
            <span className="absolute right-8 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10 shadow-lg">
              {sec.label}
            </span>
            {/* Indicator Dot */}
            <span
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === sec.id
                  ? "bg-yellow-400 scale-125 shadow-md shadow-yellow-400/25"
                  : "bg-white/40 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>

      {/* 1. Hero & Trust Ticker Banner */}
      <div id="home" className="w-full relative overflow-hidden flex items-center justify-center">
        <Hero />
      </div>

      {/* 2. New Arrivals Grid */}
      <div id="products" className="w-full py-16 md:py-24 bg-white overflow-hidden">
        <Products />
      </div>

      {/* 3. Shop by Category Grid */}
      <div id="categories" className="w-full py-16 md:py-24 bg-gray-50 overflow-hidden">
        <Categories />
      </div>

      {/* 4. Trending Now Section */}
      <div id="popular" className="w-full py-16 md:py-24 bg-white overflow-hidden">
        <Popular />
      </div>

      {/* 5. Best Shoes Gallery (Full Width Exception) */}
      <div id="about" className="w-full overflow-hidden">
        <Best />
      </div>

      {/* 6. Hook & Footer Section */}
      <div id="hook" className="w-full bg-white overflow-hidden flex flex-col justify-between">
        <div className="w-full flex-1 flex items-center justify-center ">
          <Hook />
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
