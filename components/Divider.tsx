"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Divider({ label }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex items-center gap-4 py-2" aria-hidden={label ? false : true}>
      <motion.span
        className="hairline flex-1"
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />
      <motion.span
        className="flex items-center gap-3 text-bronze/70"
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-45" aria-hidden="true">
          <rect x="2.2" y="2.2" width="5.6" height="5.6" fill="none" stroke="currentColor" strokeWidth="0.9" />
        </svg>
        {label && (
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{label}</span>
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-45" aria-hidden="true">
          <rect x="2.2" y="2.2" width="5.6" height="5.6" fill="none" stroke="currentColor" strokeWidth="0.9" />
        </svg>
      </motion.span>
      <motion.span
        className="hairline flex-1"
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "right" }}
      />
    </div>
  );
}
