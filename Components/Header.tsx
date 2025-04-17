import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaHeart,
  FaShoppingBag,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 650);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ translateX: "-100%" }}
      animate={{ translateX: 0 }}
      transition={{ duration: 1 }}
      className="bg-white/10 backdrop-blur-md border-b border-white/20 py-4 px-6 fixed w-full top-0 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-yellow-400 p-2 rounded-full">
              <img
                src="/images/image_17.png"
                alt="Shoe Icon"
                className="w-6 h-6"
              />
            </div>
            <span
              className={`font-semibold px-1.5 text-lg ${
                isScrolled ? "text-[#103c35]" : "text-white"
              }`}
            >
              Catalog
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${
              isScrolled ? "text-[#103c35]" : "text-white"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Navigation Links - Desktop */}
          <div
            className={`hidden lg:flex items-center ${
              isScrolled ? "bg-[#103c35] text-white" : "bg-white text-[#103c35]"
            } rounded-full px-6 py-2`}
          >
            <button className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors">
              Home
            </button>
            <button className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors">
              Best Collection
            </button>
            <button className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors">
              Products
            </button>
            <button className="hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors">
              Shop
            </button>
            <a
              href=""
              className=" hover:bg-gray-100 hover:text-[#103c35] px-4 py-2 rounded-full transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Right Side Icons - Desktop */}
          <div className="hidden lg:flex items-center bg-white rounded-full px-6 py-2">
            <button className="text-gray-800 hover:text-gray-600 transition-colors px-3">
              <FaSearch size={20} />
            </button>
            <button className="text-gray-800 hover:text-gray-600 transition-colors px-3">
              <FaHeart size={20} />
            </button>
            <button className="text-gray-800 hover:text-gray-600 transition-colors px-3 relative">
              <FaShoppingBag size={20} />
              <span className="absolute -top-2 -right-1 bg-yellow-400 text-xs text-black rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="text-gray-800 hover:text-gray-600 transition-colors px-3">
              <FaUserCircle size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2 bg-white rounded-2xl p-4 mb-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
              >
                Best Collection
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
              >
                Shop
              </button>
              <button
                className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </button>
            </div>
            <div className="bg-white rounded-full px-6 py-3 flex justify-around">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:text-gray-600 transition-colors px-3"
              >
                <FaSearch size={20} />
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:text-gray-600 transition-colors px-3"
              >
                <FaHeart size={20} />
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:text-gray-600 transition-colors px-3 relative"
              >
                <FaShoppingBag size={20} />
                <span className="absolute -top-2 -right-1 bg-yellow-400 text-xs text-black rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:text-gray-600 transition-colors px-3"
              >
                <FaUserCircle size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
