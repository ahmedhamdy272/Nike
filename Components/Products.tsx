import React, { useState } from "react";
import { FaHeart, FaArrowRight, FaShoppingCart } from "react-icons/fa";

import { motion } from "framer-motion";
import { useAddToCartAnimation } from "../hooks/useAddToCartAnimation";
import AddToCartAnimation from "./AddToCartAnimation";
import Alert from "./Alert";

const Products: React.FC = () => {
  const shoes = [
    {
      id: 1,
      title: "Nike Air Force ",
      color: "1 COLOR",
      price: "$134.98",
      rating: 4.3,
      reviews: 123,
      image: "/images/image_20.png",
    },
    {
      id: 2,
      title: "Nike Air Max 90",
      color: "1 COLOR",
      price: "$134.98",
      rating: 4.3,
      reviews: 123,
      image: "/images/image_12.png",
    },
    {
      id: 3,
      title: "Nike Air Force Spider",
      color: "1 COLOR",
      price: "$134.98",
      rating: 4.3,
      reviews: 123,
      image: "/images/image_4.png",
    },
  ];

  const { isAnimating, handleAnimationComplete } = useAddToCartAnimation();

  const [showAlert, setShowAlert] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const handleHeartClick = () => {
    setIsHeartClicked(!isHeartClicked);
    setShowAlert(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, translateX: "-50%" }}
      whileInView={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 1 }}
      className="py-16 px-4 md:px-8 bg-white"
      id="products"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Redefine Your Style with New Arrivals!
          </h2>
          <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors group">
            <a
              href="https://www.nike.com/w/new-3n82y"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore More
            </a>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shoes.map((shoe) => (
            <div
              key={shoe.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col relative group hover:shadow-xl transition-shadow duration-300"
            >
              <button className="absolute top-8 right-8 z-10 text-gray-400 hover:text-red-500 transition-colors">
                <FaHeart size={24} />
              </button>
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={shoe.image}
                  alt={shoe.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
              <button
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-3 flex items-center justify-center transition-colors duration-300"
                onClick={handleHeartClick}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <AddToCartAnimation
                isVisible={isAnimating}
                productImage={shoe.image}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Alert Component */}
      <Alert
        message="Added Successfully 😉!"
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </motion.section>
  );
};

export default Products;
