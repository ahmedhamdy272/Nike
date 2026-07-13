import React from "react";
import { motion } from "framer-motion";
import { FaTruck, FaUndo, FaShieldAlt, FaStar } from "react-icons/fa";

const promoItems = [
  { icon: <FaTruck />, text: "Free Shipping Over $150" },
  { icon: <FaUndo />, text: "30-Day Easy Returns" },
  { icon: <FaShieldAlt />, text: "100% Authentic Nike" },
  { icon: <FaStar />, text: "Premium Quality Guaranteed" },
];

// Duplicate items for seamless infinite scroll
const marqueeItems = [...promoItems, ...promoItems, ...promoItems];

const PromoBanner: React.FC = () => {
  return (
    <div className="bg-[#103c35] text-white py-3 overflow-hidden relative">
      <motion.div
        className="flex gap-12 w-max"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {marqueeItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
          >
            <span className="text-yellow-400">{item.icon}</span>
            <span>{item.text}</span>
            <span className="text-yellow-400/50 ml-6">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default React.memo(PromoBanner);
