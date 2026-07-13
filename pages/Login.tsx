import React, { useState, useEffect } from "react";
import { useFirebase } from "../hooks/useFirebaseContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Login: React.FC = () => {
  const { signup, login, user, loading } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Only navigate when Firebase is done loading *and* user exists
  useEffect(() => {
    if (!loading && user) {
      const state = location.state as { redirect?: string; triggerCheckout?: boolean } | null;
      if (state?.redirect) {
        navigate(state.redirect, { replace: true, state: { triggerCheckout: state.triggerCheckout } });
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);

    try {
      if (mode === "signup") {
        await signup(email, password, username);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setEmail("");
    setUsername("");
    setPassword("");
  };

  // ✅ Prevent blank screen during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
        <div className="w-12 h-12 border-4 border-[#103c35] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-gray-600">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans py-12 px-4">
      {/* Floating Background decorative blobs */}
      <motion.div
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -35, 20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -left-20 w-[25rem] h-[25rem] bg-[#103c35]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 40, -15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
        }}
        className="absolute -bottom-20 -right-20 w-[25rem] h-[25rem] bg-yellow-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 w-[35rem] h-[35rem] bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      />

      {/* Main glassmorphism card container */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[390px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 relative z-10 flex flex-col justify-between"
      >
        <div>
          {/* Brand Swoosh Indicator / Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[#103c35] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg relative overflow-hidden group">
              <span className="relative z-10">N</span>
              <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>
          </div>

          <div className="text-center mb-6">
            <motion.h1
              layout="position"
              className="text-3xl font-black text-gray-900 tracking-tight"
            >
              {mode === "login" ? "Welcome Back" : "Join the Club"}
            </motion.h1>
            <motion.p
              layout="position"
              className="text-gray-500 text-sm mt-1.5"
            >
              {mode === "login"
                ? "Access your customized Nike experience."
                : "Create your profile and start shopping."}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <Label htmlFor="username" className="text-xs font-bold text-gray-700">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-[#103c35] w-4.5 h-4.5" />
                    <Input
                      id="username"
                      type="text"
                      required={mode === "signup"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="yourname"
                      disabled={localLoading}
                      className="pl-10.5 py-5.5 bg-white/50 border-gray-200 focus-visible:ring-[#103c35] rounded-xl text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-[#103c35] w-4.5 h-4.5" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={localLoading}
                  className="pl-10.5 py-5.5 bg-white/50 border-gray-200 focus-visible:ring-[#103c35] rounded-xl text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-[#103c35] w-4.5 h-4.5" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={localLoading}
                  className="pl-10.5 pr-10 bg-white/50 border-gray-200 focus-visible:ring-[#103c35] rounded-xl text-gray-900 placeholder:text-gray-400 py-5.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  disabled={localLoading}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl py-2 px-3 text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={localLoading}
              className="w-full bg-[#103c35] hover:bg-[#0c2c27] text-white font-extrabold rounded-xl py-6 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {localLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleModeSwitch}
                disabled={localLoading}
                className="text-[#103c35] hover:underline font-bold"
              >
                Create one free
              </button>
            </>
          ) : (
            <>
              Already a member?{" "}
              <button
                type="button"
                onClick={handleModeSwitch}
                disabled={localLoading}
                className="text-[#103c35] hover:underline font-bold"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
