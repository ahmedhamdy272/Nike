import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const { catalog } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return catalog.filter((shoe) =>
      shoe.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [catalog, query]);

  // Reset query when overlay opens & autofocus
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleResultClick = (id: number) => {
    navigate(`/product/${id}`);
    onClose();
  };

  const renderResults = () => {
    if (!query.trim()) {
      return (
        <p className="text-center text-gray-400 py-8">
          Start typing to search...
        </p>
      );
    }

    if (results.length === 0) {
      return (
        <p className="text-center text-gray-400 py-8">No results found</p>
      );
    }

    return (
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {results.map((shoe) => (
          <div
            key={shoe.id}
            onClick={() => handleResultClick(shoe.id)}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
          >
            <img
              src={shoe.image}
              alt={shoe.title}
              className="w-14 h-14 rounded-lg object-cover bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {shoe.title}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-900 font-semibold">
                  {shoe.price}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{shoe.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* DESKTOP */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:block bg-white max-w-2xl mx-auto mt-32 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <hr className="border-gray-200 mb-4" />
            {renderResults()}
          </motion.div>

          {/* MOBILE FULL SCREEN */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="sm:hidden bg-white h-full flex flex-col"
          >
            <div className="flex items-center gap-4 p-4 border-b border-gray-200">
              <button
                onClick={onClose}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                <FaArrowLeft size={22} />
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">{renderResults()}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
