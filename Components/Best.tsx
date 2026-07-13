import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Best: React.FC = () => {
  return (
    <section
      className="py-16 px-6 md:px-12 w-full max-w-full bg-white text-zinc-900 flex flex-col justify-center relative overflow-hidden"
      id="About"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 leading-none">
            Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Collections</span>
          </h2>
          <p className="text-zinc-500 mt-2.5 text-xs uppercase tracking-widest font-semibold">
            Handpicked flagships. High-fidelity craftsmanship.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-300 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 transition-all group cursor-pointer bg-transparent">
          <a href="https://www.nike.com/w/best-76m50" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider font-bold">
            Explore More
          </a>
          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1: Large Image - Spans 2 rows */}
        <div className="relative bg-zinc-950 rounded-3xl overflow-hidden md:row-span-2 group border border-zinc-100 shadow-2xl h-[380px] md:h-auto">
          <img
            src="/images/image_11.jpg"
            alt="Colorful Sneaker"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
              Retro Classic
            </span>
            <h3 className="text-2xl font-black text-white mt-3">AIR FORCE 1 RETRO</h3>
            <p className="text-xs text-zinc-300 mt-2 font-light leading-relaxed">
              Timeless leather styling meets legacy comfort cushions.
            </p>
          </div>
        </div>

        {/* Card 2: Sign Up Promotion */}
        <div className="relative bg-gradient-to-br from-[#103c35] to-[#1B4D3E] rounded-3xl overflow-hidden flex items-center justify-center p-8 group border border-zinc-100 shadow-2xl min-h-[220px] cursor-pointer">
          <div className="absolute inset-0">
            <img
              src="/images/image_1.png"
              alt="Background Shoes"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-25 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="relative text-center text-white z-10 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-sm font-bold animate-pulse">
              ★
            </div>
            <h3 className="text-2xl font-black tracking-tight leading-none">
              SIGN UP & UNLOCK
            </h3>
            <div className="bg-black/30 backdrop-blur-md border border-white/10 px-5 py-3.5 rounded-2xl shadow-lg mt-1">
              <p className="text-4xl font-black text-yellow-400 leading-none">25% OFF</p>
              <p className="text-[9px] uppercase tracking-widest text-zinc-300 mt-1 font-bold">First Order Privileges</p>
            </div>
          </div>
        </div>

        {/* Card 3: Small Image */}
        <div className="relative bg-zinc-950 rounded-3xl overflow-hidden group border border-zinc-100 shadow-2xl min-h-[220px]">
          <img
            src="/images/image_2.jpeg"
            alt="White Sneaker"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
          
          {/* Details Overlay */}
          <div className="absolute bottom-5 left-5 right-5 z-20 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              Lifestyle Essential
            </span>
            <h3 className="text-xl font-black text-white mt-3.5">AIR MAX LITE</h3>
            <p className="text-[11px] text-zinc-300 mt-1.5 font-light">
              Crafted for street aesthetics and day-long wearability.
            </p>
          </div>
        </div>

        {/* Card 4: Large Colorful Image - Spans 2 columns */}
        <div className="relative bg-zinc-950 rounded-3xl overflow-hidden md:col-span-2 group border border-zinc-100 shadow-2xl h-[260px] md:h-auto">
          <img
            src="/images/image_3.jpg"
            alt="Colorful Modern Sneaker"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Limited Edition
            </span>
            <h3 className="text-2xl font-black text-white mt-3">AIR ZOOM PEGASUS</h3>
            <p className="text-xs text-zinc-300 mt-2 font-light leading-relaxed">
              Performance engineered mesh paired with responsive zoom cushions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Best);
