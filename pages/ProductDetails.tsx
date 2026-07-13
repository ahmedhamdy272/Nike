import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaArrowLeft, FaStar, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useToast } from "../Components/Toast";
import { useStore } from "../hooks/useStore";
import { useAddToCartAnimation } from "../hooks/useAddToCartAnimation";
import AddToCartAnimation from "../Components/AddToCartAnimation";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { catalog, addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAnimating, triggerAnimation, handleAnimationComplete } = useAddToCartAnimation();
  const { addToast } = useToast();

  // Find product
  const product = catalog.find((item) => item.id === Number(id));

  // Selections
  const [activeImage, setActiveImage] = useState(product?.images[0] || product?.image || "");
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(product?.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  
  // Interactive Info Sections
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  // Animations & Alerts
  const [animatingImage, setAnimatingImage] = useState<string | undefined>(undefined);

  // Get related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return catalog
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 3);
  }, [catalog, product]);

  // Entrance Animations
  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.from(".detail-animate-up", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".size-btn", {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    });
    return () => ctx.revert();
  }, [product]);

  // GSAP animation on load & active product details
  useEffect(() => {
    if (!product) return;

    // Reset active elements
    setActiveImage(product.images[0] || product.image);
    setSelectedColor(product.colors[0]);
    setSelectedSize(null);

    // GSAP load staggers
    gsap.fromTo(
      ".detail-gallery-thumbnail",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
    );
    gsap.fromTo(
      ".detail-animate-up",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    );
    gsap.fromTo(
      ".size-btn",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "back.out(1.7)" }
    );
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <main className="max-w-7xl mx-auto px-4 pt-28 pb-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-8">The shoe model you are looking for does not exist.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#103c35] text-white px-8 py-3.5 rounded-full font-bold shadow-md cursor-pointer"
          >
            Back to Catalog
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize === null) {
      addToast("Please select a size first! 👟", "error");
      return;
    }

    // Wrap product details to carry selected attributes
    const cartProduct = {
      ...product,
      title: `${product.title} (US ${selectedSize})`,
      color: `${(selectedColor?.name || "").toUpperCase()}`,
      image: activeImage, // use the color-aligned/gallery image
    } as any;

    addToCart(cartProduct);
    setAnimatingImage(activeImage);
    triggerAnimation();
    addToast(`Added ${product.title} in Size ${selectedSize} to Cart! 👟`, "success");
  };

  const handleHeartClick = () => {
    if (!product) return;
    toggleFavorite(product);
    const fav = isFavorite(product.id);
    if (fav) {
      addToast(`Added ${product.title} to Favorites! ❤️`, "success");
    } else {
      addToast(`Removed ${product.title} from Favorites.`, "info");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
          {/* Back Button */}
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-gray-500 hover:text-black font-semibold text-sm mb-8 cursor-pointer"
          >
            <FaArrowLeft /> Back to Catalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column: Image Gallery */}
            <div className="space-y-6">
              {/* Main Display Image */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex items-center justify-center aspect-square relative overflow-hidden group">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-h-[85%] object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`detail-gallery-thumbnail w-24 h-24 bg-white border rounded-2xl p-2 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all ${
                      activeImage === img ? "border-[#103c35] border-2" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`${product.title} angle ${idx + 1}`} loading="lazy" decoding="async" className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Selections & Details */}
            <div className="space-y-8">
              {/* Core Specs */}
              <div className="detail-animate-up space-y-3">
                <span className="text-xs font-black uppercase text-yellow-500 tracking-wider">
                  Nike {product.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-[#103c35]">{product.price}</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 border-l border-gray-200 pl-4">
                    <FaStar className="text-yellow-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400">({product.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Color Selector */}
              <div className="detail-animate-up space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Select Style Color: <span className="text-gray-900 font-bold ml-1">{selectedColor?.name || ""}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer shadow-inner transition-transform duration-200 ${
                        selectedColor?.name === color.name ? "border-[#103c35] scale-110" : "border-transparent"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="detail-animate-up space-y-3">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400">
                  <span>Select Size (US Men)</span>
                  <button className="text-gray-500 hover:text-black lowercase">Size guide</button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-btn py-3 border rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="detail-animate-up flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#103c35] text-white py-4 rounded-full font-bold hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  <FaShoppingCart /> Add to Cart
                </button>

                <button
                  onClick={handleHeartClick}
                  className={`p-4 border rounded-full transition-all cursor-pointer ${
                    isFavorite(product.id)
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-400 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <FaHeart size={20} className={isFavorite(product.id) ? "fill-current" : ""} />
                </button>
              </div>

              {/* Descriptions & Accordions */}
              <div className="detail-animate-up border-t border-gray-200 pt-6 space-y-4">
                {/* Accordion 1: Description */}
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setIsDescOpen(!isDescOpen)}
                    className="w-full flex justify-between items-center font-bold text-gray-900 cursor-pointer"
                  >
                    <span>Product Story</span>
                    <FaChevronDown className={`transition-transform duration-200 ${isDescOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isDescOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-gray-500 mt-3 leading-relaxed"
                      >
                        {product.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accordion 2: Features */}
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                    className="w-full flex justify-between items-center font-bold text-gray-900 cursor-pointer"
                  >
                    <span>Key Features</span>
                    <FaChevronDown className={`transition-transform duration-200 ${isFeaturesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isFeaturesOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="list-disc list-inside text-sm text-gray-500 mt-3 space-y-2"
                      >
                        {product.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Grid */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((shoe) => (
                  <div
                    key={shoe.id}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer"
                    onClick={() => navigate(`/product/${shoe.id}`)}
                  >
                    <div className="relative mb-4 aspect-square rounded-2xl overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                      <img
                        src={shoe.image}
                        alt={shoe.title}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full object-contain transform group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-[#103c35] transition-colors">
                        {shoe.title}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-[#103c35]">{shoe.price}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="text-yellow-400">★</span>
                          <span>{shoe.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      <AddToCartAnimation
        isVisible={isAnimating}
        productImage={animatingImage}
        onAnimationComplete={handleAnimationComplete}
      />


    </div>
  );
};

export default ProductDetails;
