import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaArrowRight } from "react-icons/fa";
import Alert from "./Alert";

interface Shoe {
  id: number;
  title: string;
  color: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

const Popular: React.FC = () => {
  const shoes: Shoe[] = [
    {
      id: 4,
      title: "Nike Air Max",
      color: "2 COLORS",
      price: "$144.98",
      rating: 4.5,
      reviews: 156,
      image: "/images/image_16.png",
    },
    {
      id: 5,
      title: "Nike Running Shoes",
      color: "3 COLORS",
      price: "$129.99",
      rating: 4.4,
      reviews: 142,
      image: "/images/image_15.png",
    },
    {
      id: 6,
      title: "Nike Sport Edition",
      color: "2 COLORS",
      price: "$139.99",
      rating: 4.6,
      reviews: 178,
      image: "/images/image_19.png",
    },
    {
      id: 7,
      title: "Nike Air Force",
      color: "1 COLOR",
      price: "$149.99",
      rating: 4.7,
      reviews: 165,
      image: "/images/image_10.png",
    },
    {
      id: 8,
      title: "Nike Free Run",
      color: "2 COLORS",
      price: "$124.99",
      rating: 4.4,
      reviews: 134,
      image: "/images/image_7.png",
    },
    {
      id: 9,
      title: "Nike Air Jordan",
      color: "1 COLOR",
      price: "$119.99",
      rating: 4.8,
      reviews: 112,
      image: "/images/image_14.png",
    },
  ];

  const [showAlert, setShowAlert] = useState(false);
  const handleHeartClick = () => {
    setShowAlert(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, translateY: "-50%" }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 1 }}
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
      id="popular"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold">Redefine Your Style!</h2>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors group">
          <a href="https://www.nike.com/w/new-mens-3n82yznik1" target="_blank">
            Explore Now
          </a>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shoes.map((shoe) => (
          <div
            key={shoe.id}
            className="bg-gray-50 rounded-3xl p-6 group relative hover:shadow-xl transition-shadow duration-300"
          >
            {/* Favorite Button */}
            <button
              onClick={handleHeartClick}
              className="absolute top-8 right-8 z-10 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaHeart size={24} />
            </button>

            {/* Image Container */}
            <div className="relative mb-6 aspect-square rounded-2xl overflow-hidden bg-white">
              <img
                src={shoe.image}
                alt={shoe.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{shoe.title}</h3>
              <p className="text-gray-500">{shoe.color}</p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">{shoe.price}</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-600">{shoe.rating}</span>
                  <span className="text-gray-400">({shoe.reviews})</span>
                </div>
              </div>

              <button
                onClick={handleHeartClick}
                className="w-full mt-4 bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
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

export default Popular;
