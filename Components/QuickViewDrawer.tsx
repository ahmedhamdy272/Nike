import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useStore } from "../hooks/useStore";
import { useProductActions } from "../hooks/useProductActions";
import { useToast } from "./Toast";

export const QuickViewDrawer: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useStore();
  const { handleAddToCart, handleHeartClick, isFavorite } = useProductActions();
  const { addToast } = useToast();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Reset local selector states when product changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(null);
      setSelectedColor(quickViewProduct.color || "Standard Edition");
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const mockSizes = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
  const mockColors = ["Original", "Dark stealth", "Neon Volt"];

  const handleDrawerAddToCart = () => {
    if (!selectedSize) {
      addToast("Please select a size first! 👟", "error");
      return;
    }
    const productWithSize = {
      ...quickViewProduct,
      title: `${quickViewProduct.title} (${selectedSize})`,
    };
    handleAddToCart(productWithSize);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Glassmorphic Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        />

        {/* Slide-out Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 220, damping: 25 }}
          className="relative w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Quick View
            </span>
            <button
              onClick={() => setQuickViewProduct(null)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors duration-200 cursor-pointer"
              aria-label="Close panel"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {/* Product Gallery Placeholder/Image */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-50 aspect-video flex items-center justify-center p-4 border border-zinc-100">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="max-h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]"
              />
              <button
                onClick={() => handleHeartClick(quickViewProduct)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors cursor-pointer ${
                  isFavorite(quickViewProduct.id)
                    ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100"
                    : "bg-white border-zinc-100 text-zinc-400 hover:text-zinc-600"
                }`}
                aria-label="Toggle favorites"
              >
                <FaHeart />
              </button>
            </div>

            {/* Info Meta */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-none">
                {quickViewProduct.title}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-emerald-700">
                  {quickViewProduct.price}
                </span>
                <div className="flex items-center text-amber-500 text-sm gap-1 ml-2">
                  <FaStar />
                  <span className="font-bold text-zinc-700">{quickViewProduct.rating || "4.8"}</span>
                  <span className="text-zinc-400 font-normal">({quickViewProduct.reviews || "142"})</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed pt-2 border-t border-zinc-100">
                Premium craftsmanship engineered for athletes. Experience maximum responsiveness and style with breathable overlays and modern shock-absorbent cushioning.
              </p>
            </div>

            {/* Colors Select */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Select Style / Color
              </span>
              <div className="flex flex-wrap gap-2.5">
                {mockColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedColor === color
                        ? "bg-zinc-950 border-zinc-950 text-white shadow-md"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Select */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Select Size
              </span>
              <div className="grid grid-cols-3 gap-2">
                {mockSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-zinc-950 border-zinc-950 text-white shadow-md scale-98"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex gap-4">
            <button
              onClick={handleDrawerAddToCart}
              className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <FaShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>
        </motion.div>


      </div>
    </AnimatePresence>
  );
};
