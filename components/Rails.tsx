"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = ["01", "02", "03", "04", "05"];

/**
 * Fixed gutter ornament for wide screens — original arch geometry,
 * hairline rules, vertical volume mark + section numerals.
 * Atmosphere-inspired, nothing borrowed. Hidden below xl.
 */
export default function Rails({ visible }: { visible: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main section[id], main section[aria-label]"));
    if (sections.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = sections.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(Math.min(i, SECTIONS.length - 1));
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 hidden xl:block" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      >
        {/* left rail */}
        <div className="absolute left-[max(1.25rem,calc(50%-46rem))] top-1/2 flex -translate-y-1/2 flex-col items-center gap-5">
          <svg width="28" height="72" viewBox="0 0 28 72" fill="none" className="text-bronze/40">
            <path
              d="M4 68 L4 26 A10 10 0 0 1 24 26 L24 68"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M9 68 L9 28 A5 5 0 0 1 19 28 L19 68"
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.6"
            />
            <line x1="2" y1="68" x2="26" y2="68" stroke="currentColor" strokeWidth="1" />
            <circle cx="14" cy="12" r="1.4" fill="currentColor" />
          </svg>
          <span className="h-40 w-px bg-gradient-to-b from-transparent via-ivory/15 to-transparent" />
          <span className="vertical-text font-mono text-[9px] uppercase tracking-[0.34em] text-ivory-ghost">
            Vol. I
          </span>
        </div>

        {/* right rail — section numerals */}
        <div className="absolute right-[max(1.25rem,calc(50%-46rem))] top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
          <span className="h-24 w-px bg-gradient-to-b from-transparent to-ivory/15" />
          {SECTIONS.map((n, i) => (
            <span
              key={n}
              className={`font-mono text-[9px] tracking-[0.2em] transition-colors duration-500 ${
                i === active ? "text-bronze" : "text-ivory-ghost/60"
              }`}
            >
              {i === active ? "◆" : "◇"}
              <span className="ml-1.5 tabular-nums">{n}</span>
            </span>
          ))}
          <span className="h-24 w-px bg-gradient-to-t from-transparent to-ivory/15" />
        </div>
      </motion.div>
    </div>
  );
}
