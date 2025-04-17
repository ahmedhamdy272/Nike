import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Best: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, translateY: "-50%" }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 1 }}
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
      id="About"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold">
          Best Shoes Collection
        </h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors group">
            <a href="https://www.nike.com/w/best-76m50" target="_blank">
              Explore More
            </a>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Large Image - Spans 2 rows on larger screens */}
        <div className="relative bg-gray-50 rounded-3xl overflow-hidden md:row-span-2 group">
          <img
            src="/images/image_11.jpg"
            alt="Colorful Sneaker"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Sign Up Promotion */}
        <div className="relative bg-gray-200 rounded-3xl overflow-hidden flex items-center justify-center p-8 group">
          <div className="absolute inset-0">
            <img
              src="/images/image_1.png"
              alt="Background Shoes"
              className="w-full h-full object-cover object-center opacity-50"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="relative text-center text-white z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">
              SIGN UP & GET
            </h3>
            <p className="text-4xl md:text-5xl font-bold">25% OFF</p>
          </div>
        </div>

        {/* Small Image */}
        <div className="relative bg-gray-50 rounded-3xl overflow-hidden group">
          <img
            src="/images/image_2.jpeg"
            alt="White Sneaker"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Large Colorful Image */}
        <div className="relative bg-gray-50 rounded-3xl overflow-hidden md:col-span-2 group">
          <img
            src="/images/image_3.jpg"
            alt="Colorful Modern Sneaker"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>
    </motion.section>
  );
};

export default Best;
