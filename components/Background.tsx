"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Ambient background — constellation edition:
 * - two drifting fog gradients (CSS) that thin slightly as you scroll
 * - two-layer canvas point field: fine dust + candle-points with halos
 * - slow ambient light drift
 * Canvas sleeps when tab hidden; static dots under prefers-reduced-motion.
 */

const CANDLE_COLORS = ["232,223,201", "166,138,91", "166,43,51"];

// Fixed no-motion fallback dots (deterministic positions, no RNG).
const STATIC_DOTS = [
  { x: "12%", y: "22%", r: 1.5, c: "#E8DFC9", o: 0.35 },
  { x: "24%", y: "68%", r: 1.2, c: "#A68A5B", o: 0.4 },
  { x: "38%", y: "34%", r: 2, c: "#E8DFC9", o: 0.28 },
  { x: "55%", y: "58%", r: 1.4, c: "#A62B33", o: 0.35 },
  { x: "66%", y: "24%", r: 1.1, c: "#A68A5B", o: 0.4 },
  { x: "76%", y: "72%", r: 1.8, c: "#E8DFC9", o: 0.3 },
  { x: "86%", y: "42%", r: 1.3, c: "#A68A5B", o: 0.38 },
  { x: "46%", y: "82%", r: 1.2, c: "#E8DFC9", o: 0.25 },
  { x: "8%", y: "52%", r: 1, c: "#A68A5B", o: 0.3 },
  { x: "93%", y: "64%", r: 1.4, c: "#E8DFC9", o: 0.28 },
];

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
    const DUST_COUNT = isMobile ? 16 : 24;
    const CANDLE_COUNT = isMobile ? 7 : 14;

    type Dust = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
    type Candle = { x: number; y: number; r: number; bx: number; by: number; ph: number; a: number; c: string };
    let dust: Dust[] = [];
    let candles: Candle[] = [];

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
      dust = Array.from({ length: DUST_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 0.8,
        vx: -0.08 + Math.random() * 0.16,
        vy: -0.06 + Math.random() * 0.1,
        a: 0.1 + Math.random() * 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
      candles = Array.from({ length: CANDLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.2 + Math.random() * 1.0,
        bx: Math.random() * w,
        by: Math.random() * h,
        ph: Math.random() * Math.PI * 2,
        a: 0.35 + Math.random() * 0.25,
        c: CANDLE_COLORS[Math.floor(Math.random() * CANDLE_COLORS.length)],
      }));
    };

    resize();
    seed();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of dust) {
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
      // candles: near-static, wander ±6px, breathe gently — no twinkle
      for (const c of candles) {
        c.ph += 0.008;
        const x = c.bx + Math.sin(c.ph) * 6;
        const y = c.by + Math.cos(c.ph * 0.8) * 6;
        const breathe = 0.85 + 0.15 * Math.sin(c.ph * 1.7);
        const alpha = c.a * breathe;
        // halo
        ctx.beginPath();
        ctx.arc(x, y, c.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.c}, ${(alpha * 0.18).toFixed(3)})`;
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(x, y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.c}, ${alpha.toFixed(3)})`;
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
      {/* constellation point field */}
      {reduceMotion ? (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {STATIC_DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r / 8} fill={d.c} opacity={d.o} />
          ))}
        </svg>
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0" />
      )}
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
