import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaCheckCircle, FaTruck, FaBoxOpen, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useStore, parsePrice } from "../hooks/useStore";
import { useFirebase } from "../hooks/useFirebaseContext";
import { supabase } from "../src/constant/supabase.config";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useFirebase();
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Calculate pricing
  const subtotal = useMemo(() => cart.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0), [cart]);

  const shipping = useMemo(() => subtotal === 0 ? 0 : subtotal > 150 ? 0 : 15, [subtotal]);
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (!user) {
      // Redirect to login page, preserving path and trigger checkout flag
      navigate("/login", { state: { redirect: "/cart", triggerCheckout: true } });
      return;
    }

    setCheckoutError(null);
    setIsCheckoutOpen(true);
    setIsCheckingOut(true);
    setCheckoutStep(1);

    let dbSuccess = true;

    // Save live transaction to Supabase with "Processing" status
    if (cart.length > 0) {
      try {
        const txId = `TX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        setCurrentTxId(txId);
        
        const productTitles = cart.map(item => `${item.title} x${item.quantity}`).join(", ");
        const calculatedCogs = parseFloat((subtotal * 0.55).toFixed(2));

        const { error } = await supabase
          .from("transactions")
          .insert([
            {
              id: txId,
              email: user.email || "",
              uid: user.uid || "",
              date: new Date().toISOString().split("T")[0],
              product: productTitles,
              amount: parseFloat(total.toFixed(2)),
              cogs: calculatedCogs,
              freight: 15.00, // flat freight-in cost
              status: "Processing",
              created_at: new Date().toISOString()
            }
          ]);
        if (error) {
          console.error("Failed to save transaction to Supabase:", error);
          setCheckoutError(`Database Error: ${error.message} (Code: ${error.code})`);
          dbSuccess = false;
        }
      } catch (err: any) {
        console.error("Failed to save transaction to Supabase error:", err);
        setCheckoutError(`Checkout Error: ${err.message || err}`);
        dbSuccess = false;
      } finally {
        setIsCheckingOut(false);
      }
    } else {
      setIsCheckingOut(false);
    }

    if (dbSuccess) {
      // Simulate shipping tracking steps
      setTimeout(() => setCheckoutStep(2), 2000);
      setTimeout(() => setCheckoutStep(3), 4000);
    }
  }, [user, cart, total, subtotal]);

  const handleCloseCheckout = useCallback(async () => {
    setIsCheckoutOpen(false);

    if (checkoutError) {
      // Don't clear cart or redirect to profile if checkout failed
      return;
    }

    // Update active transaction status to Completed only if simulation reached step 3 (Done)
    if (currentTxId && checkoutStep === 3) {
      try {
        const { error } = await supabase
          .from("transactions")
          .update({ status: "Completed" })
          .eq("id", currentTxId);
        if (error) {
          console.error("Failed to complete transaction in Supabase:", error);
        }
      } catch (err) {
        console.error("Failed to complete transaction in Supabase error:", err);
      }
    }

    clearCart();
    navigate("/profile", { state: { tab: "orders" } });
  }, [currentTxId, checkoutStep, clearCart, navigate, checkoutError]);

  React.useEffect(() => {
    // If user returned from login with triggerCheckout flag, immediately open the checkout modal
    const state = location.state as { triggerCheckout?: boolean } | null;
    if (state?.triggerCheckout && user) {
      // Clear navigation history state to prevent loop triggers on reload
      navigate(location.pathname, { replace: true, state: {} });
      handleCheckout();
    }
  }, [location, user, handleCheckout, navigate]);

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
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
              Shopping Cart
            </h1>

            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-24 h-24 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-500 mb-6">
                  <FaShoppingBag size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  Looks like you haven't added any premium Nike products to your cart yet. Explore our latest collection to find your perfect pair.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#103c35] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col sm:flex-row items-center gap-6 relative group"
                      >
                        <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 w-full text-center sm:text-left">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-400 mb-3">{item.color}</p>
                          <div className="flex justify-center sm:justify-start items-center gap-4">
                            <span className="text-xl font-extrabold text-[#103c35]">{item.price}</span>
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1.5 px-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-black p-1 transition-colors cursor-pointer"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="font-semibold text-gray-800 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-black p-1 transition-colors cursor-pointer"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer sm:self-center"
                        >
                          <FaTrash size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 sticky top-28">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 text-sm text-gray-600 mb-6">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold text-gray-950">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-semibold text-gray-950">
                          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax (8%)</span>
                        <span className="font-semibold text-gray-950">${tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-gray-100 my-4 pt-4 flex justify-between text-lg font-extrabold text-gray-950">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {shipping > 0 && (
                      <p className="text-xs text-yellow-600 bg-yellow-50 p-3 rounded-xl mb-6">
                        💡 Add <strong>${(150 - subtotal).toFixed(2)}</strong> more to get <strong>FREE SHIPPING</strong>!
                      </p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-[#103c35] text-white py-4 rounded-full font-bold hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <Footer />

      {/* Checkout Tracker Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center relative"
            >
              {/* Top-Right Close/Exit Button */}
              <button
                onClick={handleCloseCheckout}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                aria-label="Close modal"
              >
                <FaTimes size={18} />
              </button>

              {checkoutError ? (
                <div className="py-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                    <FaTimes size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Checkout Failed</h3>
                  <p className="text-red-500 text-sm mb-8">{checkoutError}</p>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full bg-[#103c35] text-white py-3.5 rounded-full font-bold hover:bg-opacity-95 transition-all shadow-md cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <FaCheckCircle size={48} className="animate-bounce" />
                  </div>

                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h3>
                  <p className="text-gray-500 text-sm mb-8">
                    Thank you for shopping at Nike. Your delivery is simulated below.
                  </p>

                  {/* Progress Steps */}
                  <div className="relative flex justify-between items-center max-w-xs mx-auto mb-10">
                    {/* Horizontal Line background */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                    
                    {/* Dynamic filler line */}
                    <motion.div
                      className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0"
                      initial={{ width: "0%" }}
                      animate={{
                        width: checkoutStep === 1 ? "0%" : checkoutStep === 2 ? "50%" : "100%",
                      }}
                      transition={{ duration: 0.8 }}
                    />

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        checkoutStep >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}>
                        1
                      </div>
                      <span className="text-[10px] font-bold text-gray-800 mt-2">Placed</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        checkoutStep >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}>
                        {checkoutStep === 2 ? <FaBoxOpen className="animate-spin text-[10px]" /> : "2"}
                      </div>
                      <span className="text-[10px] font-bold text-gray-800 mt-2">Packed</span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                        checkoutStep >= 3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}>
                        {checkoutStep === 3 ? <FaTruck className="animate-bounce text-[10px]" /> : "3"}
                      </div>
                      <span className="text-[10px] font-bold text-gray-800 mt-2">Shipped</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    {checkoutStep === 1 && (
                      <p className="text-sm text-gray-600 font-medium animate-pulse">
                         verification is in progress...
                      </p>
                    )}
                    {checkoutStep === 2 && (
                      <p className="text-sm text-gray-600 font-medium">
                        📦 Product packaged. Awaiting courier pickup...
                      </p>
                    )}
                    {checkoutStep === 3 && (
                      <p className="text-sm text-green-600 font-bold">
                        🚚 Out for delivery! Your simulated courier is nearby.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleCloseCheckout}
                    className="w-full bg-[#103c35] text-white py-3.5 rounded-full font-bold hover:bg-opacity-95 transition-all shadow-md cursor-pointer"
                  >
                    {checkoutStep === 3 ? "Complete & Close Transaction" : "Continue Shopping (In Process)"}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
