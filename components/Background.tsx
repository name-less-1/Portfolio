"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Restrained ambient background:
 * - two drifting fog gradients (CSS) that thin slightly as you scroll
 * - faint architectural arch forms (inline SVG)
 * - lightweight canvas dust particles (~38, capped, DPR-aware)
 * - slow ambient light drift
 * All disabled / static when prefers-reduced-motion.
 */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Fog sits densest at the hero, thins mid-page — ±15% only.
  const fogAOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.85, 0.55, 0.7]);
  const fogBOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.7, 0.45, 0.6]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 18 : 28;

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
    let parts: P[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const seed = () => {
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: -0.08 + Math.random() * 0.16,
        vy: -0.06 + Math.random() * 0.1,
        a: 0.12 + Math.random() * 0.3,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    seed();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });

    let t = 0;
    const tick = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.015;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 223, 201, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* base */}
      <div className="absolute inset-0 bg-ink-950" />
      {/* faint stone gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(42,36,29,0.5) 0%, transparent 65%), radial-gradient(ellipse 60% 45% at 50% 110%, rgba(74,17,21,0.22) 0%, transparent 60%)",
        }}
      />
      {/* fog layers — density follows scroll */}
      <motion.div
        className="absolute -inset-[12%] animate-fogA"
        style={{
          opacity: reduceMotion ? 0.7 : fogAOpacity,
          background:
            "radial-gradient(ellipse 45% 32% at 22% 38%, rgba(143,134,114,0.10) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 78% 62%, rgba(143,134,114,0.08) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <motion.div
        className="absolute -inset-[12%] animate-fogB"
        style={{
          opacity: reduceMotion ? 0.6 : fogBOpacity,
          background:
            "radial-gradient(ellipse 38% 28% at 68% 28%, rgba(166,138,91,0.07) 0%, transparent 70%), radial-gradient(ellipse 42% 30% at 30% 78%, rgba(126,30,36,0.06) 0%, transparent 70%)",
          filter: "blur(34px)",
        }}
      />
      {/* faint architectural arches */}
      <svg
        className="absolute left-1/2 top-1/2 h-[135vmin] w-[135vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        viewBox="0 0 600 600"
        fill="none"
      >
        {[260, 210, 160, 110].map((r) => (
          <g key={r}>
            <path
              d={`M ${300 - r} 520 L ${300 - r} ${300} A ${r} ${r} 0 0 1 ${300 + r} ${300} L ${300 + r} 520`}
              stroke="#E8DFC9"
              strokeWidth="1"
            />
            <line x1={300 - r - 14} y1="520" x2={300 + r + 14} y2="520" stroke="#E8DFC9" strokeWidth="1" />
          </g>
        ))}
        <circle cx="300" cy="132" r="2.5" fill="#E8DFC9" />
      </svg>
      {/* dust canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* slow light drift */}
      <div
        className="absolute left-1/2 top-[-20%] h-[60vmin] w-[80vmin] -translate-x-1/2 animate-breathe opacity-40"
        style={{
          background: "radial-gradient(ellipse at center, rgba(166,138,91,0.08) 0%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
