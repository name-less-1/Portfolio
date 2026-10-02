"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 72,
  x = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Drop the blur filter once settled so scrolled-past sections
  // stop compositing as filtered layers (up-scroll repaint cost).
  const [settled, setSettled] = useState(false);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale: 0.98, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setSettled(true)}
      style={settled ? { filter: "none" } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Section headings: big rise + de-blur so entrances hit hard. */
export function Heading({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(false);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 96, scale: 0.985, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 1.25, delay, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setSettled(true)}
      style={settled ? { filter: "none" } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function StaggerWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "120%", rotate: 2.5 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.95, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <Reveal y={28} x={-16}>
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] uppercase text-bronze">
        <span className="text-crimson-bright/80">{index}</span>
        <span className="h-px w-8 bg-bronze/40" aria-hidden="true" />
        <span>{label}</span>
      </p>
    </Reveal>
  );
}
