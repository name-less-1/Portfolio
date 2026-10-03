"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Emblem from "./Emblem";

/**
 * "THE GATE" at full power — full-viewport spectacle:
 * rising ember field, triple counter-rotating seal rings,
 * flickering giant word, god-ray seam, HUD telemetry,
 * boot-log stream, lock jolt. No loading bar. progress drives all.
 */
function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const LOGS = [
  { at: 0.04, text: "mount simple_english dump [350mb]" },
  { at: 0.13, text: "strip wikitext → plain text" },
  { at: 0.22, text: "build term → postings" },
  { at: 0.31, text: "score tf-idf · graph rank" },
  { at: 0.4, text: "verify index integrity [ok]" },
  { at: 0.49, text: "light the threshold" },
  { at: 0.57, text: "threshold clear" },
];

const SERIF = "The archive opens.";

/** Rising ember particles — lives only while the intro is on screen. */
function Embers({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

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
    const COUNT = window.innerWidth < 768 ? 32 : 70;
    const COLORS = ["166,138,91", "166,43,51", "232,223,201"];

    type P = { x: number; y: number; r: number; vy: number; drift: number; ph: number; a: number; c: string };
    let parts: P[] = [];
    const seed = () => {
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: h * 0.3 + Math.random() * h * 0.7,
        r: 0.7 + Math.random() * 2.1,
        vy: 0.25 + Math.random() * 0.75,
        drift: Math.random() * Math.PI * 2,
        ph: 0.02 + Math.random() * 0.05,
        a: 0.25 + Math.random() * 0.55,
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
      ctx.clearRect(0, 0, w, h);
      for (const pt of parts) {
        pt.y -= pt.vy;
        pt.drift += pt.ph;
        pt.x += Math.sin(pt.drift) * 0.3;
        if (pt.y < -12) {
          pt.y = h + 12;
          pt.x = Math.random() * w;
        }
        const flick = 0.6 + 0.4 * Math.sin(pt.drift * 2.3);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pt.c}, ${(pt.a * flick).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active ]);

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
  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  // seal: accelerating 2 turns over 0–62%, lock-settle after
  const spinT = clamp01(p / 0.62);
  const angle = 720 * Math.pow(spinT, 1.6) + Math.sin(clamp01((p - 0.62) / 0.1) * Math.PI) * 10;

  // veil parts 66 → 100
  const part = clamp01((p - 0.66) / 0.34);
  const easedPart = part * part * (3 - 2 * part);

  // lock jolt — one physical punch as the seal lands
  const jolt =
    p > 0.6 && p < 0.72 ? Math.sin(((p - 0.6) / 0.12) * Math.PI) * 0.009 : 0;

  const ember = Math.sin(clamp01((p - 0.58) / 0.37) * Math.PI);
  const lineIn = p >= 0.64;
  const sceneOut = 1 - clamp01((p - 0.68) / 0.22);
  const veilState = part <= 0 ? "SEALED" : part < 1 ? "PARTING" : "OPEN";

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
      className="fixed inset-0 z-[90] overflow-hidden bg-ink-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1, scale: done ? 1.02 : 1 + jolt }}
      transition={{ duration: done ? 1.0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: done ? "none" : "auto" }}
      role="status"
      aria-label="Opening the archive"
    >
      {/* ── veil halves ── */}
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        aria-hidden="true"
        style={{
          transform: `translateX(${-easedPart * 102}%)`,
          background:
            "linear-gradient(100deg, #0B0A08 60%, #14100C 100%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(143,134,114,0.08) 0%, transparent 70%)",
        }}
      >
        <div
          className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-bronze/70 to-transparent"
          style={{ opacity: clamp01((p - 0.6) / 0.1) }}
        />
        <svg viewBox="0 0 100 600" fill="none" className="absolute right-4 top-0 h-full w-24 opacity-90 sm:right-10 sm:w-32">
          {[
            { x: 62, y: 84, r: 2.2, c: "#E8DFC9", o: 0.5 },
            { x: 40, y: 168, r: 1.4, c: "#A68A5B", o: 0.55 },
            { x: 74, y: 252, r: 1.8, c: "#E8DFC9", o: 0.4 },
            { x: 52, y: 336, r: 2.6, c: "#A62B33", o: 0.5 },
            { x: 70, y: 424, r: 1.3, c: "#A68A5B", o: 0.5 },
            { x: 44, y: 502, r: 1.7, c: "#E8DFC9", o: 0.42 },
            { x: 64, y: 566, r: 1.2, c: "#A68A5B", o: 0.45 },
          ].map((d, i) => (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r={d.r * 3.2} fill={d.c} opacity={d.o * 0.22} />
              <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />
            </g>
          ))}
        </svg>
      </div>
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        aria-hidden="true"
        style={{
          transform: `translateX(${easedPart * 102}%)`,
          background:
            "linear-gradient(260deg, #0B0A08 60%, #14100C 100%), radial-gradient(ellipse 60% 40% at 20% 40%, rgba(126,30,36,0.07) 0%, transparent 70%)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-bronze/70 to-transparent"
          style={{ opacity: clamp01((p - 0.6) / 0.1) }}
        />
        <svg viewBox="0 0 100 600" fill="none" className="absolute left-4 top-0 h-full w-24 opacity-90 sm:left-10 sm:w-32">
          {[
            { x: 38, y: 104, r: 1.6, c: "#A68A5B", o: 0.5 },
            { x: 60, y: 196, r: 2.4, c: "#E8DFC9", o: 0.45 },
            { x: 30, y: 284, r: 1.3, c: "#E8DFC9", o: 0.4 },
            { x: 56, y: 372, r: 1.7, c: "#A62B33", o: 0.5 },
            { x: 36, y: 452, r: 2.2, c: "#A68A5B", o: 0.5 },
            { x: 62, y: 528, r: 1.4, c: "#E8DFC9", o: 0.42 },
          ].map((d, i) => (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r={d.r * 3.2} fill={d.c} opacity={d.o * 0.22} />
              <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />
            </g>
          ))}
        </svg>
      </div>

      {/* ── fog + embers over the veil ── */}
      <div
        className="absolute -inset-[10%] animate-fogA"
        aria-hidden="true"
        style={{
          opacity: 0.8 * (1 - easedPart),
          background:
            "radial-gradient(ellipse 45% 30% at 30% 40%, rgba(143,134,114,0.10) 0%, transparent 70%), radial-gradient(ellipse 42% 30% at 70% 65%, rgba(143,134,114,0.08) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <div style={{ opacity: 1 - easedPart }} className="absolute inset-0" aria-hidden="true">
        <Embers active={!done} />
      </div>
      {/* ember heart through the seam */}
      <div
        className="absolute left-1/2 top-1/2 h-[56vmin] w-[86vmin] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          opacity: 0.2 + ember * 0.8,
          background:
            "radial-gradient(ellipse, rgba(166,78,40,0.22) 0%, rgba(126,30,36,0.17) 45%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      {/* god-ray shaft down the parting seam */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2"
        aria-hidden="true"
        style={{
          width: `${4 + easedPart * 14}vmin`,
          opacity: easedPart * 0.85,
          background:
            "linear-gradient(90deg, transparent, rgba(232,223,201,0.13) 35%, rgba(166,138,91,0.20) 50%, rgba(232,223,201,0.13) 65%, transparent)",
          filter: "blur(18px)",
        }}
      />
      <div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-bronze/70"
        aria-hidden="true"
        style={{ opacity: easedPart * 0.9 }}
      />

      {/* ── giant flickering word ── */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
        style={{ opacity: 0.1 * sceneOut }}
      >
        <span
          className="flicker whitespace-nowrap font-display text-[26vw] font-medium leading-none tracking-tight sm:text-[21vw]"
          style={{
            transform: `translateY(${(0.5 - p) * 12}%)`,
            background: "linear-gradient(180deg, #E8DFC9 30%, #A68A5B 72%, #7E1E24 105%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ARCHIVE
        </span>
      </div>

      {/* ── side rails ── */}
      <div
        className="absolute bottom-28 left-5 top-28 hidden flex-col items-center justify-between md:flex"
        aria-hidden="true"
        style={{ opacity: sceneOut }}
      >
        <span className="h-20 w-px bg-gradient-to-b from-transparent to-ivory/20" />
        <span className="vertical-text font-mono text-[9px] uppercase tracking-[0.34em] text-ivory-ghost">
          Full-stack · MERN · GenAI
        </span>
        <span className="h-20 w-px bg-gradient-to-t from-transparent to-ivory/20" />
      </div>
      <div
        className="absolute bottom-28 right-5 top-28 hidden flex-col items-center justify-between md:flex"
        aria-hidden="true"
        style={{ opacity: sceneOut }}
      >
        <span className="h-20 w-px bg-gradient-to-b from-transparent to-ivory/20" />
        <span className="vertical-text font-mono text-[9px] uppercase tracking-[0.34em] text-ivory-ghost">
          Node DEV-01 · IST
        </span>
        <span className="h-20 w-px bg-gradient-to-t from-transparent to-ivory/20" />
      </div>

      {/* ── top HUD: volume left, telemetry right ── */}
      <div
        className="absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-6"
        style={{ opacity: sceneOut }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ivory-ghost">
          Archive · Vol I
        </span>
        <span className="text-right font-mono text-[10px] uppercase leading-[1.9] tracking-[0.22em] text-ivory-dim" aria-live="polite">
          <span className="block tabular-nums">
            Seal · {spinT < 1 ? String(pct).padStart(3, "0") : "Open"}
          </span>
          <span className="block tabular-nums text-ivory-faint">
            Ring · {String(Math.round(((angle % 360) + 360) % 360)).padStart(3, "0")}°
          </span>
          <span className={veilState === "OPEN" ? "block text-bronze" : "block text-ivory-faint"}>
            Veil · {veilState}
          </span>
        </span>
      </div>

      {/* ── the seal mechanism ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: sceneOut, transform: `scale(${1 - easedPart * 0.15})` }}
      >
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
          {/* charge glow builds with the spin */}
          <div
            className="absolute inset-0 rounded-full"
            aria-hidden="true"
            style={{
              opacity: 0.15 + spinT * 0.55,
              background: "radial-gradient(circle, rgba(166,138,91,0.35) 0%, rgba(126,30,36,0.20) 45%, transparent 70%)",
              filter: "blur(18px)",
            }}
          />
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-ivory/25" aria-hidden="true">
            <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="2 13.65" />
          </svg>
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full text-bronze/70"
            aria-hidden="true"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="46 30" />
            <circle cx="100" cy="22" r="3.5" fill="currentColor" />
          </svg>
          {/* counter-rotating dotted ring */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full text-ivory/40"
            aria-hidden="true"
            style={{ transform: `rotate(${-angle * 0.55}deg)` }}
          >
            <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 11" />
          </svg>
          {/* comet sweep */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full text-bronze"
            aria-hidden="true"
            style={{ transform: `rotate(${angle * 1.5}deg)`, opacity: 0.35 + spinT * 0.65 }}
          >
            <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="26 514" strokeLinecap="round" />
          </svg>
          <div className="absolute left-1/2 top-[6px] h-2 w-px -translate-x-1/2 bg-ivory/50" aria-hidden="true" />
          <Emblem className="h-14 w-14 text-bronze sm:h-16 sm:w-16" />
        </div>
        <p className="mt-6 font-display text-3xl tracking-wide text-ivory sm:text-4xl">Aryan</p>
        <div className="mt-3 flex h-7 items-center" aria-live="polite">
          {lineIn &&
            SERIF.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.035, duration: 0.45 }}
                className="font-display text-lg italic text-ivory-dim"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
        </div>
      </div>

      {/* ── bottom row: boot log + enter ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 sm:px-8 sm:pb-8"
        style={{ opacity: sceneOut }}
      >
        <div className="min-h-[128px] font-mono text-[10px] uppercase leading-[1.9] tracking-[0.18em]" aria-live="polite">
          {LOGS.map(
            (log) =>
              p >= log.at && (
                <motion.p
                  key={log.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={log.text === "threshold clear" ? "text-bronze" : "text-ivory-faint"}
                >
                  <span className="mr-2 text-bronze/80">&gt;</span>
                  {log.text}
                </motion.p>
              )
          )}
          <span className="ml-4 inline-block h-3 w-2 animate-pulse bg-bronze/80" aria-hidden="true" />
        </div>
        {!done && onSkip && (
          <button
            onClick={onSkip}
            data-hover
            className="shrink-0 border border-ivory/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ivory-dim transition-colors hover:border-bronze hover:text-ivory"
          >
            Enter →
          </button>
        )}
      </div>
    </motion.div>
  );
}
