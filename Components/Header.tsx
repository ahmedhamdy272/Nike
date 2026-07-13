import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaShoppingBag,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useStore } from "../hooks/useStore";
import SearchOverlay from "./SearchOverlay";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cart = useStore((state) => state.cart);
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 150);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  const handleNav = useCallback((targetId?: string) => {
    if (!isHome) {
      navigate("/");
      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        const homeElement = document.getElementById("home");
        if (homeElement) {
          homeElement.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
    setIsMenuOpen(false);
  }, [isHome, navigate]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed w-full top-0 z-50 py-4 px-6 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-white/10 backdrop-blur-md border-b border-white/20"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group gap-1.5"
            onClick={() => handleNav()}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/image_12.png`}
              alt="Nike Dunk Logo"
              className="w-11 h-auto object-contain transform -rotate-12 group-hover:rotate-0 transition-transform duration-300"
            />
            <span
              className={`font-black italic text-xl uppercase tracking-wider transition-colors ${
                isScrolled ? "text-[#103c35]" : "text-white"
              }`}
            >
              NIKE <span className="text-yellow-400 group-hover:text-yellow-300">DUNK</span>
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden transition-colors ${
              isScrolled ? "text-[#103c35]" : "text-white"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Navigation Links - Desktop */}
          <div
            className={`hidden lg:flex items-center transition-colors ${
              isScrolled ? "bg-[#103c35] text-white" : "bg-white text-[#103c35]"
            } rounded-full px-6 py-2`}
          >
            <button
              onClick={() => handleNav()}
              className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNav("popular")}
              className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Best Collection
            </button>
            <button
              onClick={() => navigate("/products")}
              className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => handleNav("About")}
              className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Right Side Icons - Desktop */}
          <div
            className={`hidden lg:flex items-center rounded-full px-6 py-2 transition-colors ${
              isScrolled ? "bg-[#103c35] text-white" : "bg-white text-[#103c35]"
            }`}
          >
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-yellow-400 transition-colors px-3 cursor-pointer">
              <FaSearch size={20} />
            </button>
            <button
              onClick={() => navigate("/favorites")}
              className="hover:text-yellow-400 transition-colors px-3 cursor-pointer"
            >
              <FaHeart size={20} />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="hover:text-yellow-400 transition-colors px-3 relative cursor-pointer"
            >
              <motion.div
                key={cartCount}
                animate={cartCount > 0 ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative"
              >
                <FaShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-yellow-400 text-[10px] font-bold text-black rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="hover:text-yellow-400 transition-colors px-3 cursor-pointer"
            >
              <FaUserCircle size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2 bg-white rounded-2xl p-4 mb-4 shadow-lg">
              <button
                onClick={() => handleNav()}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => handleNav("About")}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors text-left"
              >
                Best Collection
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/products");
                }}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors text-left"
              >
                Products
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/products");
                }}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors text-left"
              >
                Shop
              </button>
              <button
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors text-left"
                onClick={() => handleNav("popular")}
              >
                FAQ
              </button>
            </div>
            <div className="bg-white rounded-full px-6 py-3 flex justify-around shadow-lg">
              <button
                onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
                className="text-gray-800 hover:text-yellow-600 transition-colors px-3"
              >
                <FaSearch size={20} />
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/favorites");
                }}
                className="text-gray-800 hover:text-yellow-600 transition-colors px-3"
              >
                <FaHeart size={20} />
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/cart");
                }}
                className="text-gray-800 hover:text-yellow-600 transition-colors px-3 relative"
              >
                <motion.div
                  key={cartCount}
                  animate={cartCount > 0 ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="relative"
                >
                  <FaShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-1 bg-yellow-400 text-[10px] font-bold text-black rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </motion.div>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/profile");
                }}
                className="text-gray-800 hover:text-yellow-600 transition-colors px-3"
              >
                <FaUserCircle size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.header>
  );
};

export default React.memo(Header);

