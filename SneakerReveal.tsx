import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./SneakerReveal.module.css";
import { shoeImg, l1Img, l2Img, l3Img, l4Img, finalImg } from "./sneakerAssets";

/**
 * SneakerReveal
 * ------------------------------------------------------------------
 * A self-contained, text-free, background-free assembly animation:
 * exploded sneaker layers converge into place (with stagger, motion
 * blur, and slight overshoot), crossfade into the final polished
 * render, then settle into a gentle float with mouse-driven 3D
 * parallax. Plays once on mount.
 *
 * Usage:
 *   <div style={{ width: 640, height: 520 }}>
 *     <SneakerReveal />
 *   </div>
 *
 * The component fills its parent (100% / 100%) and paints nothing
 * of its own behind the shoe — position/size it via a wrapper.
 * ------------------------------------------------------------------
 */

export interface SneakerRevealProps {
  /** Extra class name applied to the outer stage element. */
  className?: string;
  /** Inline style applied to the outer stage element. */
  style?: React.CSSProperties;
  /** Max mouse-parallax tilt, in degrees. Defaults to 8. */
  maxTilt?: number;
  /** Called once the main reveal timeline finishes (before the float loop starts). */
  onComplete?: () => void;
}

const SneakerReveal: React.FC<SneakerRevealProps> = ({
  className,
  style,
  maxTilt = 8,
  onComplete,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const explodeGroupRef = useRef<HTMLDivElement | null>(null);

  const shoeRef = useRef<HTMLDivElement | null>(null);
  const l1Ref = useRef<HTMLDivElement | null>(null);
  const l2Ref = useRef<HTMLDivElement | null>(null);
  const l3Ref = useRef<HTMLDivElement | null>(null);
  const l4Ref = useRef<HTMLDivElement | null>(null);

  const finalShoeRef = useRef<HTMLDivElement | null>(null);
  const floatWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const camera = cameraRef.current;
    const shadow = shadowRef.current;
    const explodeGroup = explodeGroupRef.current;
    const shoe = shoeRef.current;
    const l1 = l1Ref.current;
    const l2 = l2Ref.current;
    const l3 = l3Ref.current;
    const l4 = l4Ref.current;
    const finalShoe = finalShoeRef.current;
    const floatWrap = floatWrapRef.current;

    if (
      !stage || !tilt || !camera || !shadow || !explodeGroup ||
      !shoe || !l1 || !l2 || !l3 || !l4 || !finalShoe || !floatWrap
    ) {
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Calm, static fallback: show the final shoe only.
      gsap.set(explodeGroup, { display: "none" });
      gsap.set(finalShoe, { opacity: 1 });
      gsap.set(shadow, { opacity: 1 });
      return;
    }

    let hasPlayed = false;
    let floatTl: gsap.core.Timeline | null = null;
    let mainTl: gsap.core.Timeline | null = null;

    /** Scale exploded offsets relative to the stage's live height,
     *  so the composition holds up at any container size. */
    const stageScale = (): number => {
      const h = stage.getBoundingClientRect().height;
      return gsap.utils.clamp(0.55, 1, h / 520);
    };

    const setExplodedPositions = (): void => {
      const s = stageScale();
      gsap.set(shoe, { y: -190 * s, x: 0, rotation: -2, scale: 0.98, opacity: 0, filter: "blur(0px)" });
      gsap.set(l1,   { y:   10 * s, x: 6,  rotation:  1.5, scale: 0.96, opacity: 0, filter: "blur(0px)" });
      gsap.set(l2,   { y:  85 * s, x: -6,  rotation: -1.5, scale: 0.96, opacity: 0, filter: "blur(0px)" });
      gsap.set(l3,   { y: 160 * s, x: 6,   rotation:  1.2, scale: 0.96, opacity: 0, filter: "blur(0px)" });
      gsap.set(l4,   { y: 235 * s, x: -4,  rotation: -1.2, scale: 0.96, opacity: 0, filter: "blur(0px)" });
    };

    interface AssembledTargets {
      shoe: { y: number };
      l1: { y: number };
      l2: { y: number };
      l3: { y: number };
      l4: { y: number };
    }

    const assembledPositions = (): AssembledTargets => {
      const s = stageScale();
      return {
        shoe: { y: -78 * s },
        l1:   { y: -18 * s },
        l2:   { y:   6 * s },
        l3:   { y:  28 * s },
        l4:   { y:  50 * s },
      };
    };

    setExplodedPositions();

    const handleResize = (): void => {
      if (!hasPlayed) setExplodedPositions();
    };
    window.addEventListener("resize", handleResize);

    gsap.set(finalShoe, { opacity: 0 });
    gsap.set(floatWrap, { y: 0, rotation: 0 });
    gsap.set(shadow, { opacity: 0, scaleX: 1 });
    gsap.set(camera, { scale: 1.08 });

    const targets = assembledPositions();

    const startFloatLoop = (): void => {
      floatTl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
      floatTl
        .to(floatWrap, { y: -10, duration: 2.2 }, 0)
        .to(shadow, { scaleX: 0.92, opacity: 0.48, duration: 2.2 }, 0);
    };

    mainTl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        hasPlayed = true;
        startFloatLoop();
        onComplete?.();
      },
    });

    // Parts fade/settle into their exploded positions, staggered.
    mainTl
      .to([shoe, l1, l2, l3, l4], {
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power1.out",
      }, 0.1)
      .to(shadow, { opacity: 0.5, duration: 0.6 }, 0.25);

    // Slow camera push-in.
    mainTl.to(camera, { scale: 1, duration: 1.4, ease: "power2.inOut" }, 0.35);

    // Each layer converges with a motion-blur pulse and slight overshoot.
    const moveStart = 0.9;
    const order: Array<{ el: HTMLDivElement; to: { y: number } }> = [
      { el: l4,   to: targets.l4 },
      { el: l3,   to: targets.l3 },
      { el: l2,   to: targets.l2 },
      { el: l1,   to: targets.l1 },
      { el: shoe, to: targets.shoe },
    ];

    order.forEach((item, i) => {
      const t = moveStart + i * 0.16;
      mainTl!
        .to(item.el, { filter: "blur(5px)", duration: 0.14, ease: "power1.in" }, t)
        .to(item.el, {
          x: 0,
          y: item.to.y,
          rotation: 0,
          scale: 1,
          duration: 0.62,
          ease: "back.out(1.6)",
        }, t)
        .to(item.el, { filter: "blur(0px)", duration: 0.32, ease: "power2.out" }, t + 0.3);
    });

    // Seamless crossfade from the converged exploded stack to the final render.
    const crossfadeStart = moveStart + order.length * 0.16 + 0.35;
    mainTl
      .to(explodeGroup, { opacity: 0, duration: 0.55, ease: "power1.inOut" }, crossfadeStart)
      .to(finalShoe, { opacity: 1, duration: 0.55, ease: "power1.inOut" }, crossfadeStart)
      .to(shadow, { opacity: 0.62, scaleX: 1.05, duration: 0.55, ease: "power1.inOut" }, crossfadeStart);

    // Mouse-driven 3D parallax tilt, independent of the reveal/float transforms.
    const quickRotX = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
    const quickRotY = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });

    const handlePointerMove = (e: MouseEvent): void => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 2 * maxTilt;
      const rotX = (0.5 - py) * 2 * maxTilt;
      quickRotX(rotX);
      quickRotY(rotY);
    };

    const resetPointer = (): void => {
      quickRotX(0);
      quickRotY(0);
    };

    stage.addEventListener("mousemove", handlePointerMove);
    stage.addEventListener("mouseleave", resetPointer);
    stage.addEventListener("touchend", resetPointer, { passive: true });

    // Cleanup on unmount: kill tweens/timelines and remove listeners
    // so nothing leaks or keeps animating a detached DOM node.
    return () => {
      window.removeEventListener("resize", handleResize);
      stage.removeEventListener("mousemove", handlePointerMove);
      stage.removeEventListener("mouseleave", resetPointer);
      stage.removeEventListener("touchend", resetPointer);
      mainTl?.kill();
      floatTl?.kill();
      gsap.killTweensOf([shoe, l1, l2, l3, l4, finalShoe, floatWrap, shadow, camera, tilt]);
    };
  }, [maxTilt, onComplete]);

  return (
    <div ref={stageRef} className={[styles.stagePerspective, className].filter(Boolean).join(" ")} style={style}>
      <div ref={tiltRef} className={styles.parallaxTilt}>
        <div ref={cameraRef} className={styles.camera}>
          <div ref={shadowRef} className={styles.shadow} />

          <div ref={explodeGroupRef} className={styles.explodeGroup}>
            <div ref={shoeRef} className={`${styles.layer} ${styles.layerShoe}`}>
              <img src={shoeImg} alt="" draggable={false} />
            </div>
            <div ref={l1Ref} className={`${styles.layer} ${styles.layerL1}`}>
              <img src={l1Img} alt="" draggable={false} />
            </div>
            <div ref={l2Ref} className={`${styles.layer} ${styles.layerL2}`}>
              <img src={l2Img} alt="" draggable={false} />
            </div>
            <div ref={l3Ref} className={`${styles.layer} ${styles.layerL3}`}>
              <img src={l3Img} alt="" draggable={false} />
            </div>
            <div ref={l4Ref} className={`${styles.layer} ${styles.layerL4}`}>
              <img src={l4Img} alt="" draggable={false} />
            </div>
          </div>

          <div ref={finalShoeRef} className={styles.finalShoe}>
            <div ref={floatWrapRef} className={styles.floatWrap}>
              <img src={finalImg} alt="Sneaker" draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SneakerReveal;
