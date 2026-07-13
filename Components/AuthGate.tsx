import React, { useEffect, useState } from "react";
import { useFirebase } from "../hooks/useFirebaseContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// 🌀 Loading screen
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-black">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white text-lg">Checking session...</p>
    </div>
  </div>
);

// ✨ Smart Auth Gate
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, logout } = useFirebase();
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  // When auth state settles, show welcome briefly if session exists
  useEffect(() => {
    if (!loading && user) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 1500); // show for 1.5 seconds Snappy transition
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (loading) return <LoadingScreen />;

  const handleContinue = () => {
    setShowWelcome(false);
    navigate('/', { replace: true });
  };

  // 🔓 If returning user
  if (showWelcome && user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-black text-white text-center"
      >
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Welcome back, {user.email?.split("@")[0]}!
        </h1>
        <p className="text-zinc-400 mb-6">
          Redirecting you to your Nike Store...
        </p>
        <Button
          variant="outline"
          className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
          onClick={handleContinue}
        >
          Continue
        </Button>
        <Button
          variant="ghost"
          className="mt-3 text-zinc-400 hover:text-white"
          onClick={logout}
        >
          Log out
        </Button>
      </motion.div>
    );
  }

  // 🏠 Once session handled, render normal app
  return <>{children}</>;
};
