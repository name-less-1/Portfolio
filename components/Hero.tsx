"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import { StaggerWords, Reveal } from "./Reveal";

export default function Hero({ loaded }: { loaded: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 150]);
  const yMeta = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-5 pb-12 pt-32 sm:px-8 sm:pb-14"
    >
      <motion.div style={reduce ? undefined : { y: yMeta, opacity }} className="mb-10 flex items-center gap-4">
        <span className="h-px w-12 bg-crimson/70" aria-hidden="true" />
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ivory-dim">
          {profile.role}
        </p>
      </motion.div>

      <motion.div style={reduce ? undefined : { y: yTitle }}>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mb-6 font-display text-xl italic text-ivory-dim sm:text-2xl"
        >
          The work of {profile.name} — {profile.status}.
        </motion.p>

        <h1 className="display-shadow font-display text-balance text-[13.5vw] font-medium leading-[0.95] tracking-tight text-ivory sm:text-[9vw] lg:text-[7.2rem]">
          <StaggerWords text={profile.heroLine[0]} delay={0.25} />
          <br />
          <StaggerWords text={profile.heroLine[1]} delay={0.35} />
          <br />
          <span className="italic text-ivory-dim">
            <StaggerWords text={profile.heroLine[2]} delay={0.45} />
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={0.55} className="md:col-span-6">
            <p className="max-w-md text-[17px] leading-relaxed text-ivory-dim">{profile.bio}</p>
          </Reveal>
          <Reveal delay={0.65} className="md:col-span-6">
            <dl className="grid grid-cols-2 gap-6 border-t border-ivory/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] sm:grid-cols-3">
              <div>
                <dt className="mb-2 text-ivory-ghost">Base</dt>
                <dd className="text-ivory-dim">{profile.location}</dd>
              </div>
              <div>
                <dt className="mb-2 text-ivory-ghost">Signal</dt>
                <dd className="text-ivory-dim">{profile.coords}</dd>
              </div>
              <div>
                <dt className="mb-2 text-ivory-ghost">Node</dt>
                <dd className="flex items-center gap-2 text-ivory-dim">
                  <span className="inline-block h-8 w-px animate-breathe bg-gradient-to-b from-bronze to-transparent" aria-hidden="true" />
                  {profile.node}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </motion.div>

      {/* side index */}
      <p
        aria-hidden="true"
        className="vertical-text absolute right-4 top-1/3 hidden font-mono text-[10px] uppercase tracking-[0.32em] text-ivory-ghost lg:block"
      >
        Fig. 00 — Threshold
      </p>
    </section>
  );
}
