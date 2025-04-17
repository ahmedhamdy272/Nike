import React, { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  {
    src: "/images/image_8.webp",
    alt: "Featured Shoe",
  },
  {
    src: "/images/image_5.webp",
    alt: "Second Shoe",
  },
  {
    src: "/images/image_6.jpg",
    alt: "Third Shoe",
  },
  {
    src: "/images/image_9.jpg",
    alt: "Third Shoe",
  },
  {
    src: "/images/image_11.jpg",
    alt: "Third Shoe",
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-swap images on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  return (
    <motion.section
      initial={{ opacity: 0, translateX: "100%" }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 1 }}
      className="bg-[#103c35] min-h-screen pt-0 md:pt-24 relative overflow-hidden"
      id="hero"
    >
      <div className=" relative h-[calc(100vh-6rem)] pt-24 md:pt-0 box-content">
        {/* Center Content */}
        <div className="relative  z-20 h-full flex flex-col justify-center py-12 px-6">
          {/* Main Text */}
          <div className="flex flex-col items-center  mb-20 w-full">
            <h1 className="text-white text-7xl md:text-9xl font-bold leading-none tracking-tight w-full">
              <div className="-mb-2 text-center md:text-left md:ml-38">
                DESIGN
              </div>
              <div className="text-6xl md:text-7xl mb-2 text-yellow-400 text-center">
                &
              </div>
              <div className="text-center md:text-right md:mr-20">
                HIGH QUALITY
              </div>
            </h1>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-12 left-0 w-full px-6">
            <div className="hidden md:flex max-w-7xl mx-auto justify-between items-center">
              {/* Left - Brand & Counter */}
              <div className="flex items-center gap-8">
                <span className="text-yellow-400 font-semibold text-xl">
                  Nike
                </span>
                <div className="text-white/80 flex items-center">
                  <span className="font-bold text-xl">{currentSlide}</span>
                  <span className="mx-2 text-sm">/</span>
                  <span className="text-sm">{totalSlides}</span>
                </div>
              </div>

              {/* Center - Product Name */}
              <div className="text-white/80 hidden sm:block">
                Product name and Model
              </div>

              {/* Right - Navigation */}
              <div className="flex items-center gap-6">
                <button
                  onClick={prevSlide}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  <FaArrowLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
                >
                  <span>View Products</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal Design with Grid (Desktop/Tablet) */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-0 right-0 w-[85%] h-full">
            <div className="grid grid-cols-3 gap-8 h-full transform rotate-[10deg] origin-top-right -translate-y-[10%]">
              {/* First stripe */}
              <div className="relative h-[140%] bg-white/10 overflow-hidden group">
                <img
                  src="/images/image_5.webp"
                  alt="Featured Shoe"
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>

              {/* Second stripe */}
              <div className="relative h-[140%] bg-white/10 overflow-hidden group">
                <img
                  src="/images/image_8.webp"
                  alt="Second Shoe"
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>

              {/* Third stripe */}
              <div className="relative h-[140%] bg-white/10 overflow-hidden group">
                <img
                  src="/images/image_6.jpg"
                  alt="Third Shoe"
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Carousel (show only one image at a time) */}
        <div className="absolute inset-0  overflow-hidden sm:hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage].src}
              alt={images[currentImage].alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            />
          </AnimatePresence>
          {/* Mobile navigation buttons */}
          {/* <div className="flex flex-row justify-center items-center gap-8 mt-4">
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="bg-white/80 text-[#103c35] rounded-full p-2 shadow hover:bg-yellow-400 transition-colors"
              aria-label="Previous image"
            >
              <FaArrowLeft size={18} />
            </button>
            <button
              onClick={() =>
                setCurrentImage((prev) => (prev + 1) % images.length)
              }
              className="bg-white/80 text-[#103c35] rounded-full p-2 shadow hover:bg-yellow-400 transition-colors"
              aria-label="Next image"
            >
              <FaArrowRight size={18} />
            </button>
          </div> */}
        </div>

        {/* Small Nike text */}
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 -rotate-90">
          <span className="text-white/60 tracking-widest text-sm">Nike</span>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
