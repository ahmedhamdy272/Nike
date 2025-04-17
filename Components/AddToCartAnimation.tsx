import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";

interface AddToCartAnimationProps {
  isVisible: boolean;
  productImage?: string;
  onAnimationComplete?: () => void;
}

const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({
  isVisible,
  productImage,
  onAnimationComplete,
}) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleAnimationComplete = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      onAnimationComplete?.();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Product flying animation */}
          <motion.div
            initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: 0.5,
              x: "calc(100vw - 6rem)",
              y: "-100vh + 6rem",
              opacity: 0,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              opacity: { duration: 0.8 },
            }}
            onAnimationComplete={handleAnimationComplete}
            className="fixed z-50"
          >
            <div className="w-16 h-16 bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={productImage || "/images/image_hook.png"}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Cart icon animation */}
          <motion.div
            className="fixed top-6 right-6 z-40"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              ease: "easeInOut",
            }}
          >
            <FaShoppingCart className="text-[#FF6B00] text-3xl" />
          </motion.div>

          {/* Notification popup */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="fixed top-16 right-6 bg-white px-4 py-2 rounded-lg shadow-lg z-40"
              >
                <p className="text-sm font-medium text-gray-800">
                  Added to Cart
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartAnimation;
