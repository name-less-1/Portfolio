"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Emblem from "./Emblem";

/**
 * "CRASHOUT" - 1.5s false calm → full-screen rupture → resolve.
 * Time-skip language: static burst, rolling band, tracking skew,
 * scanlines, one blackout dip - analog-TV takeover, all original code.
 * Own cold-moon palette (nothing from the warm site system):
 *   silver #C9D2DC · ice #E4EAF0 · slate #788A9E
 *   abyss black #050505 · flare white #E8ECF0 · signal red (mosaic only)
 * Calm (0-0.35): emblem + name + fast log over dim ash.
 * Crash (0.35-0.66): shake, RGB split, full-height slices, 2 flashes, ash surge.
 * Resolve (0.66-1.0): snap clean, serif lands, veil parts.
 * progress drives everything; skip and reduced-motion escape cleanly.
 */
function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const C_SILVER = "201,210,220";
const C_ICE = "228,234,240";
const C_SLATE = "120,138,158";
const C_FLARE = "232,236,240";
const C_RED = "255,70,55"; // mosaic signal lines only - nowhere else

// rupture intensity 0..1 - the single dial for the whole takeover
const RUPTURE = 1.15;

// envelope: ramps 0.35→0.42, holds, snaps out 0.6→0.66
function ruptureAt(p: number): number {
  if (p < 0.35 || p >= 0.66) return 0;
  if (p < 0.42) return ((p - 0.35) / 0.07) * RUPTURE;
  if (p < 0.6) return RUPTURE;
  return (1 - (p - 0.6) / 0.06) * RUPTURE;
}

// deterministic per-bucket hash - identical every run, skip-safe
function hashBucket(bucket: number, seed: number): number {
  const v = Math.sin(bucket * 12.9898 + seed * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

const LOGS = [
  { at: 0.05, text: "mount simple_english dump" },
  { at: 0.12, text: "express routes [ok]" },
  { at: 0.2, text: "atlas linked" },
  { at: 0.28, text: "groq suspect awake" },
  { at: 0.55, text: "threshold clear", hot: true },
];

const SERIF = "The archive opens.";

/** Dense cinder storm - density/heat follow the `storm` envelope. */
function Embers({ active, storm }: { active: boolean; storm: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stormRef = useRef(1);
  stormRef.current = storm;

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const COUNT = window.innerWidth < 768 ? 40 : 90;
    const COLORS = [C_ICE, C_ICE, C_SLATE, C_SLATE, C_SILVER];

    type P = { x: number; y: number; r: number; vy: number; drift: number; ph: number; a: number; c: string };
    let parts: P[] = [];
    const seed = () => {
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.85,
        r: 0.6 + Math.random() * 1.2,
        vy: 0.3 + Math.random() * 0.8,
        drift: Math.random() * Math.PI * 2,
        ph: 0.02 + Math.random() * 0.05,
        a: 0.2 + Math.random() * 0.35,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const s = stormRef.current;
      ctx.clearRect(0, 0, w, h);
      if (s > 0.01) {
      for (const pt of parts) {
        pt.y += pt.vy * (0.3 + s);
        pt.drift += pt.ph;
        pt.x += Math.sin(pt.drift) * 0.9;
        if (pt.y > h + 12) {
          pt.y = -12;
          pt.x = Math.random() * w;
        }
          const flick = 0.6 + 0.4 * Math.sin(pt.drift * 2.3);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pt.c}, ${(pt.a * flick * s).toFixed(3)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/** Block mosaic - 70 tiles of displaced static laced with red signal lines.
 *  Redrawn off the parent's progress ticks; unmounted outside the rupture. */
function Mosaic({ active, progress }: { active: boolean; progress: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const COLS = 10;
    const ROWS = 7;
    const bw = w / COLS;
    const bh = h / ROWS;
    const bucket = Math.floor(clamp01(progress / 100) * 48);
    const rnd = (i: number, s: number) => {
      const v = Math.sin(i * 12.9898 + bucket * 0.717 + s * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };

    ctx.clearRect(0, 0, w, h);
    let i = 0;
    for (let cx = 0; cx < COLS; cx++) {
      for (let cy = 0; cy < ROWS; cy++, i++) {
        const jx = (rnd(i, 1) - 0.5) * 28;
        const jy = (rnd(i, 2) - 0.5) * 20;
        const x = cx * bw + jx;
        const y = cy * bh + jy;
        // displaced dark tile
        ctx.fillStyle = `rgba(5,8,12,${(0.35 + rnd(i, 3) * 0.3).toFixed(3)})`;
        ctx.fillRect(x, y, bw, bh);
        // per-tile static
        for (let d = 0; d < 22; d++) {
          const dx = x + rnd(i * 31 + d, 4) * bw;
          const dy = y + rnd(i * 31 + d, 5) * bh;
          const c = rnd(i * 31 + d, 6) < 0.5 ? C_ICE : C_SLATE;
          ctx.fillStyle = `rgba(${c},${(0.1 + rnd(i * 31 + d, 7) * 0.3).toFixed(3)})`;
          ctx.fillRect(dx, dy, 1.5, 1.5);
        }
        // red signal line on ~40% of tiles, top or left edge
        if (rnd(i, 8) > 0.6) {
          ctx.fillStyle = `rgba(${C_RED},${(0.3 + rnd(i, 9) * 0.5).toFixed(3)})`;
          if (rnd(i, 10) < 0.5) ctx.fillRect(x, y, bw, 1);
          else ctx.fillRect(x, y, 1, bh);
        }
      }
    }
  }, [active, progress]);

  if (!active) return null;
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export default function Loader({
  progress,
  done,
  onSkip,
}: {
  progress: number;
  done: boolean;
  onSkip?: () => void;
}) {
  const reduce = useReducedMotion();
  const p = clamp01(progress / 100);

  // envelopes - 1.5s crashout: calm 0-0.35, rupture 0.35-0.66, resolve 0.66-1.0
  const rupture = ruptureAt(p);
  const bucket = Math.floor(p * 48);
  const shakeX = (hashBucket(bucket, 1) - 0.5) * 20 * rupture;
  const shakeY = (hashBucket(bucket, 2) - 0.5) * 16 * rupture;
  const rgbSplit = 10 * rupture;
  const skew = (hashBucket(bucket, 3) - 0.5) * 5 * rupture;
  const blackout = p >= 0.5 && p < 0.53 ? 0.75 : 0;
  const part = clamp01((p - 0.62) / 0.38);
  const easedPart = part * part * (3 - 2 * part);
  const lineIn = p >= 0.6;
  const sceneOut = 1 - clamp01((p - 0.62) / 0.28);
  const flash =
    ((p >= 0.37 && p < 0.395) || (p >= 0.53 && p < 0.555) ? 0.14 : 0) * RUPTURE;

  if (reduce) {
    return (
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950"
        initial={{ opacity: 1 }}
        animate={{ opacity: done ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: done ? "none" : "auto" }}
        role="status"
        aria-label="Loading portfolio"
      >
        <Emblem className="h-10 w-10 text-bronze" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-[#050505]"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: done ? "none" : "auto" }}
      role="status"
      aria-label="Opening the archive"
    >
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px) skewX(${skew.toFixed(2)}deg)` }}
      >
      {/* ── veil halves (part at resolve) ── */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#050505]"
        aria-hidden="true"
        style={{ transform: `translateX(${-easedPart * 102}%)` }}
      >
        <div
          className="absolute inset-y-0 right-0 w-px"
          style={{
            opacity: clamp01((p - 0.6) / 0.1),
            background: `linear-gradient(180deg, transparent, rgba(${C_FLARE},0.8), transparent)`,
          }}
        />
      </div>
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#050505]"
        aria-hidden="true"
        style={{ transform: `translateX(${easedPart * 102}%)` }}
      >
        <div
          className="absolute inset-y-0 left-0 w-px"
          style={{
            opacity: clamp01((p - 0.6) / 0.1),
            background: `linear-gradient(180deg, transparent, rgba(${C_FLARE},0.8), transparent)`,
          }}
        />
      </div>

      {/* dim ash texture */}
      <div style={{ opacity: 1 - easedPart * 2 }} className="absolute inset-0" aria-hidden="true">
        <Embers active={!done} storm={0.45 + rupture * 1.1} />
      </div>

      {/* block mosaic takeover: 70 tiles of displaced static + red signal lines */}
      <div className="absolute inset-0" aria-hidden="true" style={{ opacity: rupture }}>
        <Mosaic active={rupture > 0 && !done} progress={progress} />
      </div>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          opacity: 0.05 + rupture * 0.07,
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute inset-0 bg-black" aria-hidden="true" style={{ opacity: blackout }} />

      {/* ── calm center: emblem + name (rupture splits them) ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
        style={{ opacity: sceneOut }}
      >
        <Emblem className="h-12 w-12 text-ivory/80" />
        <p className="relative mt-5 font-display text-3xl tracking-wide text-ivory sm:text-4xl">
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ transform: `translate(${-rgbSplit}px, 0)`, opacity: rupture * 0.8, color: `rgba(${C_FLARE},0.85)` }}
          >
            Aryan
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 text-ivory"
            style={{ transform: `translate(${rgbSplit}px, 0)`, opacity: rupture * 0.6 }}
          >
            Aryan
          </span>
          Aryan
        </p>
      </div>

      {/* ── top mark ── */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6"
        style={{ opacity: sceneOut }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: `rgba(${C_SLATE},0.9)` }}
        >
          Vol I
        </span>
        <span
          className="font-mono text-[10px] uppercase tabular-nums tracking-[0.28em]"
          style={{ color: `rgba(${C_ICE},0.75)` }}
          aria-live="polite"
        >
          {String(Math.min(100, Math.max(0, Math.round(progress)))).padStart(3, "0")}
        </span>
      </div>

      {/* ── serif line on resolve, stuttering in through the rupture ── */}
      <div
        className="absolute inset-x-0 bottom-[20vh] text-center"
        aria-hidden={!lineIn}
        style={
          rupture > 0
            ? { textShadow: `${rgbSplit}px 0 0 rgba(${C_FLARE},0.7), ${-rgbSplit}px 0 0 rgba(${C_SILVER},0.7)` }
            : undefined
        }
      >
        {lineIn && (
          <p className="font-display text-xl italic sm:text-2xl" style={{ color: `rgba(${C_ICE},0.9)` }}>
            {SERIF.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.018, duration: 0.3 }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </p>
        )}
      </div>

      {/* ── bottom row: short log + enter ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 sm:px-8 sm:pb-8"
        style={{ opacity: sceneOut }}
      >
        <div
          className="min-h-[76px] font-mono text-[10px] uppercase leading-[1.9] tracking-[0.18em]"
          aria-live="polite"
        >
          {LOGS.map(
            (log) =>
              p >= log.at && (
                <motion.p
                  key={log.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={
                    log.hot
                      ? { color: `rgba(${C_FLARE},0.95)` }
                      : { color: `rgba(${C_SLATE},0.85)` }
                  }
                >
                  <span className="mr-2" style={{ color: `rgba(${C_SILVER},0.8)` }}>&gt;</span>
                  {log.text}
                </motion.p>
              )
          )}
        </div>
        {!done && onSkip && (
          <button
            onClick={onSkip}
            data-hover
            className="shrink-0 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors"
            style={{ borderColor: `rgba(${C_SLATE},0.35)`, color: `rgba(${C_ICE},0.8)` }}
          >
            Enter →
          </button>
        )}
      </div>

      {/* ── rupture strobe: two low-contrast flashes, ever ── */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          opacity: ((p >= 0.37 && p < 0.395) || (p >= 0.53 && p < 0.555) ? 0.14 : 0) * RUPTURE,
          background: `rgba(${C_ICE},1)`,
        }}
      />
      </div>
    </motion.div>
  );
}
