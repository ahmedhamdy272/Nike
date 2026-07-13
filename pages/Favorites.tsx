import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Alert from "../Components/Alert";
import { useStore, Product } from "../hooks/useStore";
import { useAddToCartAnimation } from "../hooks/useAddToCartAnimation";
import AddToCartAnimation from "../Components/AddToCartAnimation";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useStore();
  const { isAnimating, triggerAnimation, handleAnimationComplete } = useAddToCartAnimation();
  const [animatingImage, setAnimatingImage] = useState<string | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleAddToCart = (shoe: Product) => {
    addToCart(shoe);
    setAnimatingImage(shoe.image);
    triggerAnimation();
    setAlertMessage(`Added ${shoe.title} to Cart!`);
    setShowAlert(true);
  };

  const handleRemoveFavorite = (shoe: Product) => {
    toggleFavorite(shoe);
    setAlertMessage(`Removed ${shoe.title} from Favorites`);
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                  Loved Items
                </h1>
                <p className="text-gray-500 mt-1">Your personal collection of Nike styles.</p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold text-sm border border-gray-300 hover:border-black rounded-full px-5 py-2.5 transition-all cursor-pointer bg-white"
              >
                <FaArrowLeft /> Back to Products
              </button>
            </div>

            {/* Grid display */}
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 animate-pulse">
                  <FaHeart size={40} className="fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Loved Items Yet</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  Tap the heart icon on any shoe in our store to save it to your loved items list. They will show up here so you can easily view or add them to the cart later.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#103c35] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Discover Shoes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {favorites.map((shoe) => (
                    <motion.div
                      key={shoe.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl p-6 group relative shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                    >
                      {/* Heart Button */}
                      <button
                        onClick={() => handleRemoveFavorite(shoe)}
                        className="absolute top-8 right-8 z-10 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                      >
                        <FaHeart size={20} className="fill-current" />
                      </button>

                      {/* Image Container */}
                      <div className="relative mb-6 aspect-square rounded-2xl overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                        <img
                          src={shoe.image}
                          alt={shoe.title}
                          loading="lazy"
                          decoding="async"
                          className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info & Add */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">{shoe.title}</h3>
                          <p className="text-gray-400 text-sm">{shoe.color}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-extrabold text-[#103c35]">{shoe.price}</span>
                          <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-700">
                            <span>⭐</span>
                            <span>{shoe.rating}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(shoe)}
                          className="w-full bg-gray-900 text-white py-3.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-2 font-bold shadow-sm"
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <Footer />

      {/* Fly-to-cart Animation */}
      <AddToCartAnimation
        isVisible={isAnimating}
        productImage={animatingImage}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Alert Component */}
      <Alert
        message={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default Favorites;
