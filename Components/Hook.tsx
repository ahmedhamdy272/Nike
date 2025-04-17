import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Hook: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: "-50%" }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 1 }}
      className="max-w-7xl mx-auto px-4 py-8 md:py-12"
      id="hero"
    >
      <div className="bg-[#1B4D3E] rounded-[2rem] overflow-hidden relative shadow-xl">
        {/* Price Tag */}
        <div className="absolute right-16 top-16 z-20 rotate-12">
          <div className="bg-white text-black px-6 py-2 rounded-lg shadow font-bold text-lg transform rotate-12 border border-gray-200">
            $899.99
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
          {/* Left side with image */}
          <div className="w-full md:w-1/2 flex justify-center items-center relative mb-8 md:mb-0">
            <img
              src="/images/image_21.png"
              alt="Colorful Sneaker"
              className="w-full max-w-[400px] mx-auto drop-shadow-2xl animate-float"
              style={{ zIndex: 1 }}
            />
          </div>

          {/* Right side with content */}
          <div className="w-full md:w-1/2 space-y-8 text-white text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Elegance Craft
              <br />
              Accent <span className="text-[#FF6B00]">Shoes</span>
            </h2>
            <div className="flex flex-row justify-center md:justify-start gap-4 w-full">
              <button className="bg-[#FF6B00] hover:bg-[#FF8533] text-white px-8 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 group text-lg font-semibold shadow-lg">
                <a
                  href="https://www.nike.com/w/new-mens-3n82yznik1"
                  target="_blank"
                >
                  Shop Now
                </a>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hook;
