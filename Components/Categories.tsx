import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";

const categories = [
  {
    name: "Running",
    image: "/images/image_8.webp",
    description: "Built for speed",
    gradient: "from-blue-600/80 to-blue-900/90",
  },
  {
    name: "Basketball",
    image: "/images/image_5.webp",
    description: "Court-ready kicks",
    gradient: "from-orange-600/80 to-red-900/90",
  },
  {
    name: "Lifestyle",
    image: "/images/image_6.jpg",
    description: "Everyday comfort",
    gradient: "from-emerald-600/80 to-emerald-900/90",
  },
  {
    name: "Training",
    image: "/images/image_9.jpg",
    description: "Push your limits",
    gradient: "from-purple-600/80 to-purple-900/90",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 15 },
  },
};

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate("/products", { state: { category: categoryName } });
  };

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 w-full max-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
          Shop by
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600"> Category</span>
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Find the perfect pair for every occasion
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            variants={cardVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(cat.name)}
            className="relative rounded-3xl overflow-hidden cursor-pointer aspect-[3/4] group shadow-lg"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-5 md:p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                {cat.description}
              </p>
              <h3 className="text-xl md:text-2xl font-black">{cat.name}</h3>
              <div className="mt-3 flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-yellow-400 transition-colors">
                <span>Shop Now</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default React.memo(Categories);
