import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import AddToCartAnimation from "./AddToCartAnimation";

import { useStore } from "../hooks/useStore";
import { useProductActions } from "../hooks/useProductActions";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { catalog, setQuickViewProduct } = useStore();
  const shoes = catalog.slice(0, 3);
  const {
    handleAddToCart,
    handleHeartClick,
    isAnimating,
    animatingImage,
    handleAnimationComplete,
    isFavorite,
  } = useProductActions();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-16 px-6 md:px-12 lg:px-20 bg-white w-full max-w-full"
      id="products"
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">New</span> Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors group cursor-pointer"
          >
            <span>Explore More</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {shoes.map((shoe) => (
            <motion.div
              key={shoe.id}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
              }}
              whileHover={{ scale: 1.03, y: -8, boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col relative group transition-shadow duration-300 products-card cursor-pointer"
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleHeartClick(shoe); }}
                className="absolute top-8 right-8 z-10 transition-colors cursor-pointer"
              >
                <FaHeart
                  size={24}
                  className={isFavorite(shoe.id) ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-500"}
                />
              </button>
              <div
                className="relative overflow-hidden rounded-lg mb-6 aspect-square bg-gray-50 flex items-center justify-center p-4"
              >
                <div onClick={() => navigate(`/product/${shoe.id}`)} className="w-full h-full flex items-center justify-center">
                  <img
                    src={shoe.image}
                    alt={shoe.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Quick View Button overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(shoe);
                    }}
                    className="bg-white/95 text-zinc-900 font-bold text-xs py-2.5 px-5 rounded-full shadow-lg border border-black/5 transition-transform duration-200 transform translate-y-3 group-hover:translate-y-0 cursor-pointer hover:bg-black hover:text-white"
                  >
                    Quick View
                  </button>
                </div>
              </div>
              <h3
                onClick={() => navigate(`/product/${shoe.id}`)}
                className="text-xl font-semibold text-gray-900 mb-2 hover:text-yellow-600 transition-colors"
              >
                {shoe.title}
              </h3>
              <p className="text-gray-500 mb-4">{shoe.color}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {shoe.price}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="text-gray-600">
                    {shoe.rating} ({shoe.reviews})
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-3 flex items-center justify-center transition-colors duration-300 shadow-sm font-bold"
                onClick={(e) => { e.stopPropagation(); handleAddToCart(shoe); }}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AddToCartAnimation
        isVisible={isAnimating}
        productImage={animatingImage}
        onAnimationComplete={handleAnimationComplete}
      />


    </motion.section>
  );
};

export default React.memo(Products);
