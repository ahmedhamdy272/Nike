import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaSearch, FaShoppingCart, FaSlidersH, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

import { useStore, parsePrice } from "../hooks/useStore";
import { useProductActions } from "../hooks/useProductActions";
import AddToCartAnimation from "../Components/AddToCartAnimation";

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { catalog, setQuickViewProduct } = useStore();
  const {
    handleAddToCart,
    handleHeartClick,
    isAnimating,
    animatingImage,
    handleAnimationComplete,
    isFavorite,
  } = useProductActions();

  // State filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Styles");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = ["All Styles", "Running", "Basketball", "Lifestyle", "Training"];

  // Filter & Sort Logic
  const sortedProducts = useMemo(() => {
    const filteredProducts = catalog.filter((shoe) => {
      const matchesSearch = shoe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            shoe.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Styles" || shoe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") {
        return parsePrice(a.price) - parsePrice(b.price);
      }
      if (sortBy === "price-high") {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "reviews") {
        return b.reviews - a.reviews;
      }
      // "featured" default
      return a.id - b.id;
    });
  }, [catalog, searchQuery, selectedCategory, sortBy]);

  // GSAP animation on mount & filter changes
  useEffect(() => {
    // Stagger sidebar items
    gsap.fromTo(
      ".category-item",
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // Fade & slide up product cards
    gsap.fromTo(
      ".product-grid-card",
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" }
    );
  }, [selectedCategory, searchQuery, sortBy]);


  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Nike Catalog
              </h1>
              <p className="text-gray-500 mt-1">Discover high performance shoes designed for you.</p>
            </div>
            
            {/* Sorting and Search Top Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#103c35] transition-all shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#103c35] transition-all cursor-pointer shadow-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                  <option value="reviews">Most Reviews</option>
                </select>

                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden bg-[#103c35] text-white p-3 rounded-full cursor-pointer shadow-md"
                >
                  <FaSlidersH />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Desktop Sidebar Column */}
            <aside ref={sidebarRef} className="hidden md:block col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <h3 className="text-sm font-extrabold tracking-widest text-gray-400 uppercase mb-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`category-item w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#103c35] text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid Column */}
            <div className="md:col-span-3">
              {sortedProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-gray-100 flex flex-col items-center">
                  <span className="text-5xl mb-4">🔍</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Shoes Found</h3>
                  <p className="text-gray-500 max-w-sm mb-6">
                    We couldn't find any products matching your active criteria. Try broadening your query or selecting another category.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All Styles");
                    }}
                    className="bg-[#103c35] text-white px-6 py-2.5 rounded-full font-bold shadow-md cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div
                  ref={gridRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {sortedProducts.map((shoe) => (
                    <motion.div
                      key={shoe.id}
                      whileHover={{ scale: 1.02, y: -5, boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      className="product-grid-card bg-white rounded-3xl p-5 relative border border-gray-100 shadow-md transition-shadow duration-300 flex flex-col justify-between group cursor-pointer"
                    >
                      {/* Heart Wishlist */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleHeartClick(shoe); }}
                        className="absolute top-6 right-6 z-10 p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                      >
                        <FaHeart
                          size={18}
                          className={isFavorite(shoe.id) ? "text-red-500 fill-current animate-ping-once" : ""}
                        />
                      </button>

                      {/* Product image */}
                      <div
                        className="relative mb-5 aspect-square rounded-2xl overflow-hidden bg-gray-50 p-4 flex items-center justify-center"
                      >
                        <div onClick={() => navigate(`/product/${shoe.id}`)} className="w-full h-full flex items-center justify-center">
                          <img
                            src={shoe.image}
                            alt={shoe.title}
                            loading="lazy"
                            decoding="async"
                            className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
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

                      {/* Details & Button */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-yellow-500 tracking-wider">
                            {shoe.category}
                          </span>
                          <h3
                            onClick={() => navigate(`/product/${shoe.id}`)}
                            className="text-lg font-bold text-gray-900 hover:text-yellow-600 transition-colors truncate"
                          >
                            {shoe.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">{shoe.color}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xl font-black text-[#103c35]">{shoe.price}</span>
                          <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                            <span className="text-yellow-400">★</span>
                            <span>{shoe.rating}</span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(shoe); }}
                          className="w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart size={16} />
                          Add to Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white w-80 h-full p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-extrabold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="text-gray-500 hover:text-black cursor-pointer"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                      Categories
                    </h4>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? "bg-[#103c35] text-white"
                              : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-[#103c35] text-white py-3 rounded-full font-bold shadow-md cursor-pointer"
              >
                Close Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddToCartAnimation
        isVisible={isAnimating}
        productImage={animatingImage}
        onAnimationComplete={handleAnimationComplete}
      />


    </div>
  );
};

export default ProductsPage;
