"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Ambient background - constellation with a loose orbital hole:
 * - two drifting fog gradients (CSS) that thin slightly as you scroll
 * - canvas point field: fine dust (straight drift) + candle-points
 * - a dark disc bends nearby points into loose, wobbly orbits -
 *   nothing is swallowed, new points wander in from the corners
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
  // Fog sits densest at the hero, thins mid-page - ±15% only.
  const fogAOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [1.0, 0.7, 0.85]);
  const fogBOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.85, 0.6, 0.75]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let frame = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth < 768;
    const DUST_COUNT = isMobile ? 16 : 24;
    const CANDLE_COUNT = isMobile ? 7 : 14;

    type Dust = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number; orb: number; fd: number };
    type Candle = { x: number; y: number; vx: number; vy: number; r: number; ph: number; a: number; c: string; orb: number; fd: number };
    type Filament = { rf: number; ang: number; len: number; w: number; a: number; c: string; sp: number };
    let dust: Dust[] = [];
    let candles: Candle[] = [];
    let filaments: Filament[] = [];
    const TILT = -0.26; // oval lean, like the reference

    // the hole - center-right mass, fixed, never drifts
    const holeFx = () => (w < 768 ? 0.55 : 0.6);
    const holeFy = () => (w < 768 ? 0.38 : 0.46);
    const holeR = () => Math.min(w, h) * (w < 768 ? 0.12 : 0.17);
    const influenceR = () => Math.min(w, h) * 0.7;

    // fresh points wander in from the corners, never from mid-edge
    const cornerSpawn = () => {
      const cx = Math.random() < 0.5 ? Math.random() * w * 0.2 : w - Math.random() * w * 0.2;
      const cy = Math.random() < 0.5 ? Math.random() * h * 0.2 : h - Math.random() * h * 0.2;
      return { cx, cy };
    };

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
        orb: 0.5 + Math.random() * 1.0,
        fd: 1,
      }));
      candles = Array.from({ length: CANDLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: -0.05 + Math.random() * 0.1,
        vy: -0.04 + Math.random() * 0.08,
        r: 1.2 + Math.random() * 1.0,
        ph: Math.random() * Math.PI * 2,
        a: 0.35 + Math.random() * 0.25,
        c: CANDLE_COLORS[Math.floor(Math.random() * CANDLE_COLORS.length)],
        orb: 0.5 + Math.random() * 1.0,
        fd: 1,
      }));
      // filament web: 3 log-spiral arms sweeping to ~3x core - the pic's web
      filaments = Array.from({ length: isMobile ? 40 : 85 }, (_, i) => {
        const rf = 1.05 + Math.pow(Math.random(), 1.2) * 1.95;
        const arm = (i % 3) * ((Math.PI * 2) / 3);
        return {
          rf,
          ang: arm + 2.2 * Math.log(rf) + (Math.random() - 0.5) * 0.5,
          len: 1.2 + Math.random() * 1.2,
          w: 0.7 + Math.random() * 0.9,
          a: 0.02 + Math.random() * 0.05,
          c: Math.random() < 0.62 ? "232,223,201" : Math.random() < 0.75 ? "166,138,91" : "166,43,51",
          sp: 0.0035 / Math.pow(rf, 1.5),
        };
      });
    };

    // bend a velocity into a loose inward spiral around the hole.
    // per-particle `orb` looseness + jitter keeps rings ragged, never perfect.
    // inward pull is ~40% of tangential: points visibly tighten lap by lap,
    // sink over ~30-45s, dim out at the core edge, respawn from the corners.
    const orbit = (pt: { x: number; y: number; vx: number; vy: number; orb: number }, hx: number, hy: number, hr: number, ir: number) => {
      const dx = pt.x - hx;
      const dy = pt.y - hy;
      const dist = Math.hypot(dx / 1.4, dy) + 0.001; // elliptical metric hugs the wide disc
      if (dist > ir) return;
      const raw = Math.hypot(dx, dy) + 0.001;
      const tx = -dy / raw;
      const ty = dx / raw;
      const nx = -dx / raw;
      const ny = -dy / raw;
      const sp = Math.min(1.2, (7 / Math.sqrt(dist)) * pt.orb);
      pt.vx += ((tx * sp + nx * sp * 0.4) - pt.vx) * 0.03 + (Math.random() - 0.5) * 0.007;
      pt.vy += ((ty * sp + ny * sp * 0.4) - pt.vy) * 0.03 + (Math.random() - 0.5) * 0.007;
      // last-ditch bumper deep inside the rim only - infall wins everywhere else
      if (raw < hr * 1.1) {
        pt.vx += (dx / raw) * 0.05;
        pt.vy += (dy / raw) * 0.05;
      }
    };

    const respawn = (pt: { x: number; y: number; vx: number; vy: number; fd: number }) => {
      const { cx, cy } = cornerSpawn();
      pt.x = cx;
      pt.y = cy;
      pt.vx = -0.08 + Math.random() * 0.16;
      pt.vy = -0.06 + Math.random() * 0.1;
      pt.fd = 1;
    };

    // dim toward the core over a wide band - a slow ~2s sink, then corner respawn
    type Orbiter = { x: number; y: number; vx: number; vy: number; fd: number };
    const coreFade = (pt: Orbiter, hx: number, hy: number, hr: number) => {
      const d = Math.hypot((pt.x - hx) / 1.4, pt.y - hy);
      if (d < hr * 1.6) {
        pt.fd -= 0.008;
        if (pt.fd <= 0) respawn(pt);
      } else if (pt.fd < 1) {
        pt.fd = Math.min(1, pt.fd + 0.05);
      }
    };

    resize();
    seed();
    window.addEventListener("resize", () => {
      resize();
      seed();
    });

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);
      const hx = holeFx() * w;
      const hy = holeFy() * h;
      const hr = holeR();
      const ir = influenceR();

      // filament web - smoke catching light, additive so crossings glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const f of filaments) {
        f.ang += f.sp;
        const r = hr * f.rf;
        ctx.beginPath();
        ctx.ellipse(hx, hy, r, r * 0.62, TILT, f.ang, f.ang + f.len);
        ctx.strokeStyle = `rgba(${f.c}, ${f.a.toFixed(3)})`;
        ctx.lineWidth = f.w;
        ctx.stroke();
      }
      ctx.restore();

      for (const p of dust) {
        orbit(p, hx, hy, hr, ir);
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.015;
        coreFade(p, hx, hy, hr);
        if (p.x < -12 || p.x > w + 12 || p.y < -12 || p.y > h + 12) respawn(p);
        const alpha = p.a * p.fd * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 223, 201, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      // candles: integrated drift + orbital bend, rendered with a small wander
      for (const c of candles) {
        orbit(c, hx, hy, hr, ir);
        c.x += c.vx;
        c.y += c.vy;
        c.ph += 0.008;
        coreFade(c, hx, hy, hr);
        if (c.x < -12 || c.x > w + 12 || c.y < -12 || c.y > h + 12) respawn(c);
        const x = c.x + Math.sin(c.ph) * 6;
        const y = c.y + Math.cos(c.ph * 0.8) * 6;
        const breathe = 0.85 + 0.15 * Math.sin(c.ph * 1.7);
        const alpha = c.a * c.fd * breathe;
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

      // soft wide-disc void over the filament roots - warm shadow, feathered, never hard
      ctx.save();
      ctx.translate(hx, hy);
      ctx.scale(1.5, 0.85);
      ctx.rotate(TILT * 0.4);
      const vg = ctx.createRadialGradient(0, 0, hr * 0.1, 0, 0, hr * 1.45);
      vg.addColorStop(0, "rgba(24,16,11,0.78)");
      vg.addColorStop(0.55, "rgba(24,16,11,0.6)");
      vg.addColorStop(1, "rgba(24,16,11,0)");
      ctx.fillStyle = vg;
      ctx.beginPath();
      ctx.arc(0, 0, hr * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // single bright rim arc on the wide rim, lower-left - the lensing cue, barely breathing
      const rimA = 0.24 + 0.08 * Math.sin(frame * 0.01);
      ctx.beginPath();
      ctx.ellipse(hx, hy, hr * 1.56, hr * 0.9, TILT, 1.9, 2.9);
      ctx.strokeStyle = `rgba(232,223,201,${rimA.toFixed(3)})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();

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
      {/* fog layers - density follows scroll */}
      <motion.div
        className="absolute -inset-[12%] animate-fogA"
        style={{
          opacity: reduceMotion ? 0.7 : fogAOpacity,
          background:
            "radial-gradient(ellipse 55% 38% at 30% 42%, rgba(143,134,114,0.13) 0%, transparent 70%), radial-gradient(ellipse 50% 36% at 72% 62%, rgba(143,134,114,0.10) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <motion.div
        className="absolute -inset-[12%] animate-fogB"
        style={{
          opacity: reduceMotion ? 0.6 : fogBOpacity,
          background:
            "radial-gradient(ellipse 46% 34% at 66% 30%, rgba(166,138,91,0.09) 0%, transparent 70%), radial-gradient(ellipse 50% 36% at 32% 78%, rgba(126,30,36,0.08) 0%, transparent 70%)",
          filter: "blur(34px)",
        }}
      />
      {/* constellation point field */}
      {reduceMotion ? (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="voidfill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#18100B" stopOpacity="0.82" />
              <stop offset="65%" stopColor="#18100B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#18100B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g transform="rotate(-15 60 46)" fill="none">
            <path d="M 38 46 A 24 14.9 0 1 1 74 37" stroke="#E8DFC9" strokeWidth="0.25" opacity="0.16" />
            <path d="M 45 58 A 17 10.5 0 1 0 77 48" stroke="#A68A5B" strokeWidth="0.25" opacity="0.18" />
            <path d="M 40 34 A 29 18 0 1 1 80 56" stroke="#E8DFC9" strokeWidth="0.2" opacity="0.12" />
            <path d="M 48 50 A 14 8.7 0 0 1 70 39" stroke="#E8DFC9" strokeWidth="0.35" opacity="0.26" />
          </g>
          <ellipse cx="60" cy="46" rx="20" ry="10" transform="rotate(-9 60 46)" fill="url(#voidfill)" />
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
