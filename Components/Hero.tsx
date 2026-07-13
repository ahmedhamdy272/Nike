import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import PromoBanner from "./PromoBanner";

interface HeroItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  image: string;
  bgGradient: string;
}

const HERO_ITEMS: HeroItem[] = [
  {
    id: "dunk-high",
    title: "Dunk High",
    subtitle: "Emerald Edition",
    tag: "Original Classic",
    description: "Experience the Nike Dunk High. Immerse yourself in a legendary 3D perspective product stage crafted for absolute premium styling.",
    image: "/images/image_17.png",
    bgGradient: "radial-gradient(circle 50vw at var(--mouse-x, 50%) var(--mouse-y, 40%), #0d2f2a 0%, #103c35 65%, #041210 100%)",
  },
  {
    id: "jordan-4",
    title: "Jordan 4",
    subtitle: "Crimson Flight",
    tag: "Retro Flight",
    description: "A timeless flight icon. Built with premium overlays, side mesh inserts, and dual pressurized Air units for historic street prestige.",
    image: "/images/AIR+JORDAN+4+RETRO.avif",
    bgGradient: "radial-gradient(circle 50vw at var(--mouse-x, 50%) var(--mouse-y, 40%), #2c0909 0%, #3d0c0c 65%, #100202 100%)",
  },
  {
    id: "reactx-wildhorse",
    title: "Wildhorse 10",
    subtitle: "Volt Trail",
    tag: "All-Terrain Trail",
    description: "Conquer rugged pathways with specialized ReactX dual foam cores. Engineered with high-abrasion mesh shields and multi-directional lugged traction.",
    image: "/images/NIKE+REACTX+WILDHORSE+10.avif",
    bgGradient: "radial-gradient(circle 50vw at var(--mouse-x, 50%) var(--mouse-y, 40%), #241804 0%, #362306 65%, #0e0901 100%)",
  },
  {
    id: "vapor-17",
    title: "Vapor 17",
    subtitle: "Elite Pitch",
    tag: "Pitch Speed",
    description: "Engineered for pure speed and control. Form-fitting Flyknit weaves combine with aerodynamically set blades to dominate firm ground play.",
    image: "/images/VAPOR+17+ELITE+FG+T.avif",
    bgGradient: "radial-gradient(circle 50vw at var(--mouse-x, 50%) var(--mouse-y, 40%), #1c2602 0%, #2a3b03 65%, #0c1001 100%)",
  }
];

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const finalShoeRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);

  // Normalize paths to prepend BASE_URL dynamically
  const normalizedHeroItems = React.useMemo(() => {
    return HERO_ITEMS.map((item) => {
      const normalizePath = (p: string) => {
        if (p.startsWith("/") && !p.startsWith(import.meta.env.BASE_URL)) {
          return `${import.meta.env.BASE_URL}${p.substring(1)}`;
        }
        return p;
      };
      return {
        ...item,
        image: normalizePath(item.image)
      };
    });
  }, []);

  const activeShoe = normalizedHeroItems[activeIdx];

  const handleSelectShoe = (index: number) => {
    if (index === activeIdx) return;

    // Smooth transition: scale-down, swap, scale-up
    const tl = gsap.timeline();
    tl.to(finalShoeRef.current, {
      scale: 0.5,
      opacity: 0,
      rotate: -15,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActiveIdx(index);
      }
    })
    .to(finalShoeRef.current, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.5,
      ease: "back.out(1.2)"
    });
  };

  useEffect(() => {
    // 1. Initial states
    gsap.set(".hero-animate-text", { y: 35, opacity: 0 });
    gsap.set(shadowRef.current, { scale: 0.4, opacity: 0 });
    gsap.set(finalShoeRef.current, {
      opacity: 0,
      scale: 0.72,
    });

    // 2. Entrance Animation Timeline
    const tl = gsap.timeline();
    tl.to(".hero-animate-text", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "power4.out",
    })
      .to(
        finalShoeRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .to(
        shadowRef.current,
        {
          opacity: 0.75,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.8"
      );

    // 3. Continuous floating & 3D swiveling animation on mount
    gsap.to(".float-wrap", {
      y: -14,
      rotateY: 6,
      rotateX: 3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
      gsap.killTweensOf("*");
    };
  }, []);

  // Autoplay rotation timer: change active shoe model every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIdx = (activeIdx + 1) % HERO_ITEMS.length;
      handleSelectShoe(nextIdx);
    }, 10000);

    return () => clearInterval(timer);
  }, [activeIdx]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !tiltRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const xPct = x / (rect.width / 2);
    const yPct = y / (rect.height / 2);

    gsap.to(tiltRef.current, {
      rotateX: yPct * -12,
      rotateY: xPct * 12,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(shadowRef.current, {
      x: xPct * -15,
      y: yPct * -5,
      duration: 0.6,
      ease: "power2.out",
    });

    const mX = ((e.clientX - rect.left) / rect.width) * 100;
    const mY = ((e.clientY - rect.top) / rect.height) * 100;

    gsap.to(containerRef.current, {
      "--mouse-x": `${mX}%`,
      "--mouse-y": `${mY}%`,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(tiltRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(shadowRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(containerRef.current, {
      "--mouse-x": "50%",
      "--mouse-y": "40%",
      duration: 0.8,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-12 text-white md:px-12 lg:px-16"
      style={{
        background: activeShoe.bgGradient,
        transition: "background 0.8s ease-out"
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          backgroundPosition: "center center",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      <div className="relative z-20 grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="col-span-12 flex flex-col items-center text-center lg:col-span-5 lg:items-start lg:text-left">
          
          <div className="hero-animate-text mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400">
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            {activeShoe.tag}
          </div>

          <h1 className="hero-animate-text mb-5 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
            Built For <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {activeShoe.title}
            </span>
          </h1>

          <p className="hero-animate-text mb-6 max-w-md text-sm font-light leading-relaxed text-gray-300 md:text-base lg:text-lg min-h-[72px]">
            {activeShoe.description}
          </p>

          <div className="hero-animate-text flex w-full flex-wrap justify-center gap-3 lg:justify-start">
            <button
              onClick={() => {
                const target = document.getElementById("products");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-yellow-400 px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300 cursor-pointer"
            >
              Shop Collection
            </button>
          </div>

          {/* Model Switcher */}
          <div className="hero-animate-text mt-8 flex flex-col gap-2.5 items-center lg:items-start">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Select 3D Product Stage model
            </span>
            <div className="flex gap-3">
              {normalizedHeroItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectShoe(idx)}
                  className={`relative w-14 h-14 rounded-2xl border p-1 bg-zinc-950/60 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer ${
                    activeIdx === idx
                      ? "border-yellow-400 shadow-lg shadow-yellow-400/20 scale-[1.08]"
                      : "border-white/5 hover:border-white/20"
                  }`}
                  title={`${item.title} - ${item.subtitle}`}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="col-span-12 flex flex-col items-center justify-center lg:col-span-7">
          <div
            className="relative flex aspect-square w-full max-w-[290px] items-center justify-center xs:max-w-[340px] md:max-w-[480px] lg:max-w-[650px]"
            style={{ perspective: "1500px" }}
          >
            <div
              ref={tiltRef}
              className="relative h-full w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="float-wrap relative flex h-full w-full items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  ref={shadowRef}
                  className="absolute left-1/2 top-[66%] h-8 w-[70%] -translate-x-1/2 rounded-full bg-black blur-2xl opacity-60"
                  style={{
                    transform: "translate3d(-50%, 0, -160px) scaleY(0.7)",
                    willChange: "transform, opacity",
                  }}
                />

                <div
                  ref={finalShoeRef}
                  className="absolute left-1/2 top-1/2 w-[72%] pointer-events-none filter drop-shadow-[0_30px_35px_rgba(0,0,0,0.6)]"
                  style={{
                    transform: "translate3d(-50%, -50%, 90px)",
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    willChange: "transform, opacity",
                  }}
                >
                  <img
                    src={activeShoe.image}
                    alt={activeShoe.title}
                    className="block h-auto w-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            Hover over stage to tilt 3D shoe view
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-30 w-full">
        <PromoBanner />
      </div>
    </section>
  );
};

export default React.memo(Hero);