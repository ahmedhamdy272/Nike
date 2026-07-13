import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaCheckCircle, FaUser } from "react-icons/fa";
import { useToast } from "./Toast";

interface Review {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  date: string;
}

const Hook: React.FC = () => {
  const { addToast } = useToast();

  // Preset reviews showing real customer experiences
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "rev-1",
      name: "Marcus K.",
      rating: 5,
      category: "Fit & Comfort",
      comment: "The premium Dunk High is a work of art. The comfort levels and vertical assembly design blew my mind! 👟",
      date: "Just now",
    },
    {
      id: "rev-2",
      name: "Sarah L.",
      rating: 5,
      category: "Usability",
      comment: "Fabulous interface! Submitting my feedback was super easy, and my cart update speed is incredibly responsive. 🌟",
      date: "2 hours ago",
    },
    {
      id: "rev-3",
      name: "David T.",
      rating: 5,
      category: "Style & Design",
      comment: "Outstanding customer service and the fast checkout feels way better than Amazon. Will buy again! 🔥",
      date: "1 day ago",
    },
  ]);

  // Form states
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState("Fit & Comfort");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = ["Fit & Comfort", "Style & Design", "Usability", "Delivery Speed"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Please enter your name.", "error");
      return;
    }
    if (!comment.trim()) {
      addToast("Please write a review comment.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        name: name.trim(),
        rating,
        category,
        comment: comment.trim(),
        date: "Just now",
      };

      setReviews((prev) => [newReview, ...prev]);
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast("Review submitted successfully! Thank you! 🌟", "success");

      // Reset form fields after delay
      setTimeout(() => {
        setName("");
        setRating(5);
        setComment("");
        setIsSubmitted(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="w-full bg-zinc-950 py-12 md:py-16 px-4 md:px-12 lg:px-20 text-white flex flex-col justify-center relative overflow-hidden">
      {/* Decorative Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,#103c35_0%,transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Live Reviews Feed */}
        <div className="col-span-12 lg:col-span-6 flex flex-col space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-3.5 py-1.5 rounded-full border border-yellow-400/20">
              Live Feed
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mt-4 leading-none">
               User <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Reviews</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed max-w-md">
              Hear from our community of athletes and creators about their purchase experiences and product styles.
            </p>
          </div>

          {/* Scrolling Review Cards */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {reviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-zinc-900/60 border border-white/5 p-5 rounded-2xl backdrop-blur-md flex flex-col gap-3 shadow-lg hover:border-yellow-400/25 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-white/10">
                        <FaUser size={14} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/10 mt-1 inline-block">
                          {rev.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t border-white/5 sm:border-none pt-2 sm:pt-0 mt-1 sm:mt-0 gap-1.5 shrink-0">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={11}
                            className={i < rev.rating ? "text-yellow-400" : "text-zinc-700"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-light">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs font-light leading-relaxed">"{rev.comment}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Interactive Review Form */}
        <div className="col-span-12 lg:col-span-6">
          <motion.div 
            className="bg-zinc-900/40 border border-white/10 p-5 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black text-white leading-none mb-2">WRITE A REVIEW</h3>
            <p className="text-zinc-400 text-xs font-light mb-6">Share your rating and feedback with us.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex M."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* Rating Selector */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  Experience Rating
                </label>
                <div className="flex gap-1.5 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="text-2xl transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                    >
                      <FaStar
                        className={
                          star <= (hoverRating ?? rating) ? "text-yellow-400" : "text-zinc-800"
                        }
                      />
                    </button>
                  ))}
                  <span className="text-[10px] font-bold text-zinc-400 ml-2">
                    {(hoverRating ?? rating)} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  What did you love most?
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                        category === cat
                          ? "bg-yellow-400 border-yellow-400 text-black shadow-md shadow-yellow-400/10"
                          : "bg-zinc-950/80 border-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the sizing, fit, aesthetics, or usability of your treatments..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full bg-yellow-400 disabled:bg-zinc-800 hover:bg-yellow-300 text-black disabled:text-zinc-600 font-extrabold uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <FaCheckCircle className="text-base" />
                    <span>Review Submitted!</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Hook;
