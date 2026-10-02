"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nav } from "@/lib/data";
import Emblem from "./Emblem";

export default function Navbar({ loaded }: { loaded: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: loaded ? 0 : -32, opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-500 sm:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* backdrop only after scroll — keeps hero clean */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 border-b transition-all duration-500 ${
            scrolled
              ? "border-ivory/10 bg-ink-950/80 backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
        />
        <a href="#top" className="relative flex items-center gap-3 text-ivory" data-hover>
          <Emblem className="h-8 w-8 text-bronze" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-wide">Aryan</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ivory-faint">
              Archive · Vol I
            </span>
          </span>
        </a>

        <ul className="relative flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-hover
                className="group relative rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ivory-dim transition-colors hover:text-ivory"
              >
                <span className="mr-1.5 hidden text-[9px] text-crimson-bright/70 sm:inline">
                  {item.number}
                </span>
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-bronze transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
