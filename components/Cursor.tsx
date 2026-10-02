"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Subtle custom cursor: small dot + trailing ring.
 * Scales on interactive elements. Disabled on touch / reduced-motion.
 * Also drives a faint cursor-reactive ambient light.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const lightX = useSpring(x, { stiffness: 60, damping: 20 });
  const lightY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("custom-cursor-active");
    active.current = true;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-hover]");
      document.documentElement.dataset.cursor = interactive ? "hover" : "";
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("custom-cursor-active");
      active.current = false;
    };
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden [@media(pointer:fine)]:block" aria-hidden="true">
      {/* ambient light following cursor */}
      <motion.div
        className="absolute h-[34vmin] w-[34vmin] rounded-full opacity-0 transition-opacity duration-500 [:root[data-cursor='hover']_&]:opacity-100"
        style={{
          x: lightX,
          y: lightY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(166,138,91,0.09) 0%, transparent 65%)",
        }}
      />
      {/* dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ width: 0, height: 0 }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory" />
      </div>
      {/* ring */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <div className="flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bronze/50 transition-transform duration-300 [:root[data-cursor='hover']_&]:scale-150 [:root[data-cursor='hover']_&]:border-bronze">
          <div className="h-px w-px rounded-full bg-bronze/0" />
        </div>
      </motion.div>
    </div>
  );
}
