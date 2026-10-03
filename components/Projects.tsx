"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/data";
import { Reveal, Heading, Eyebrow } from "./Reveal";

function Visual({ project, expanded }: { project: Project; expanded: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Artwork drifts hard against the scroll.
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [48, -48]);
  const emberOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0.35, 0.75, 0.45]);
  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full overflow-hidden border border-ivory/10 bg-ink-900"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800 via-ink-900 to-ink-950" />
      <motion.svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-[115%] w-full opacity-40" style={reduce ? undefined : { y: artY }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse
            key={i}
            cx="400"
            cy={430 - i * 6}
            rx={120 + i * 42}
            ry={36 + i * 22}
            fill="none"
            stroke="#A68A5B"
            strokeOpacity={0.22 - i * 0.015}
            strokeWidth="1"
          />
        ))}
        <path
          d={`M ${400 - 130} 450 L ${400 - 130} 210 A 130 130 0 0 1 ${400 + 130} 210 L ${400 + 130} 450`}
          fill="none"
          stroke="#E8DFC9"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        <path
          d={`M ${400 - 88} 450 L ${400 - 88} 225 A 88 88 0 0 1 ${400 + 88} 225 L ${400 + 88} 450`}
          fill="none"
          stroke="#E8DFC9"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <line x1="230" y1="450" x2="570" y2="450" stroke="#E8DFC9" strokeOpacity="0.3" />
      </motion.svg>
      <motion.div
        className="absolute left-1/2 top-[46%] h-24 w-40 -translate-x-1/2 -translate-y-1/2 blur-2xl"
        style={{
          background: "radial-gradient(ellipse, rgba(126,30,36,0.5) 0%, transparent 70%)",
          opacity: reduce ? (expanded ? 0.9 : 0.55) : emberOpacity,
        }}
      />
      <VisualScene slug={project.slug} expanded={expanded} />
      <span className="absolute bottom-3 right-5 font-display text-6xl italic text-ivory/10 sm:text-7xl">
        {project.index}
      </span>
      <motion.div
        className="absolute inset-0"
        animate={expanded ? { scale: 1.04 } : { scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="absolute left-4 top-4 border border-ivory/15 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ivory-dim backdrop-blur-sm">
        {project.status}
      </span>
    </div>
  );
}

const SCENES: Record<string, { lines: string[]; tone: string }> = {
  "wiki-search-engine": {
    tone: "text-ivory-dim/90",
    lines: [
      '> query: "inverted index"',
      "────────────────────────────────",
      "[1] postings ............ 0.42",
      "[2] tf-idf rank ......... 0.38",
      "[3] pagerank blend ...... 0.31",
      "────────────────────────────────",
      "3 results in 0.004s",
    ],
  },
  kite: {
    tone: "text-ivory-dim/90",
    lines: [
      "┌─ schemes ─────┬─ laws ────────┐",
      "│ scholarships  │ jobs          │",
      "│ antariksh     │ raksha        │",
      "│ jan-seva in(3)│ legislative   │",
      "└───────────────┴───────────────┘",
    ],
  },
  detectiveai: {
    tone: "text-bronze/90",
    lines: [
      "YOU: where were you that night?",
      "HIM: ...home. alone.",
      "YOU: the logs say otherwise.",
      "HIM: ...",
      "YOU: one more chance.",
    ],
  },
};

function VisualScene({ slug, expanded }: { slug: string; expanded: boolean }) {
  const scene = SCENES[slug];
  if (!scene) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <pre
        aria-hidden="true"
        className={`font-mono text-[10px] leading-[1.9] transition-all duration-700 sm:text-[12px] ${scene.tone} ${
          expanded ? "opacity-100" : "opacity-70"
        }`}
      >
        {scene.lines.join("\n")}
      </pre>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const links: { label: string; href: string }[] = [];
  if (project.repo) links.push({ label: "Source", href: project.repo });
  if (project.liveUrl) links.push({ label: "Live site", href: project.liveUrl });
  if (project.apiUrl) links.push({ label: "API", href: project.apiUrl });
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap content-start items-start gap-3">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          data-hover
          className="inline-flex items-center gap-2 border border-bronze/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory transition-all hover:border-bronze hover:bg-bronze/10 hover:text-ivory"
        >
          {l.label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

export default function ProjectEntry({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(project.slug === "wiki-search-engine");
  const reduce = useReducedMotion();
  const isWiki = project.slug === "wiki-search-engine";
  // Alternate entries slide in from opposite sides.
  const drift = parseInt(project.index, 10) % 2 === 0 ? 56 : -56;

  return (
    <Reveal x={drift} y={56}>
      <article
        aria-labelledby={`proj-${project.index}`}
        className="group grid gap-8 border-t border-ivory/10 py-8 md:grid-cols-12 md:gap-10 lg:py-10"
      >
        <div className="md:col-span-3">
          <p className="font-display text-5xl italic text-bronze/50">{project.index}</p>
          <dl className="mt-6 space-y-4 font-mono text-[11px] uppercase tracking-[0.18em]">
            <div>
              <dt className="text-ivory-ghost">Year</dt>
              <dd className="mt-1 text-[13px] normal-case tracking-normal text-ivory-dim">{project.year}</dd>
            </div>
            <div>
              <dt className="text-ivory-ghost">Kind</dt>
              <dd className="mt-1 text-[13px] normal-case leading-relaxed tracking-normal text-ivory-dim">{project.kind}</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-9">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={`proj-body-${project.index}`}
            data-hover
            className="block w-full text-left"
          >
            <h3 id={`proj-${project.index}`} className="font-display text-4xl leading-tight text-ivory sm:text-5xl">
              {project.title}
              <span className="ml-4 inline-block align-middle font-mono text-[10px] uppercase tracking-[0.28em] text-bronze">
                {expanded ? "- Close" : "+ Open"}
              </span>
            </h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ivory-faint">{project.kind}</p>
          </button>

          <div className="mt-7 overflow-hidden" onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(isWiki)}>
            <motion.div
              animate={reduce ? undefined : { y: expanded ? -6 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Visual project={project} expanded={expanded} />
            </motion.div>
          </div>

          <p className="mt-6 max-w-2xl text-[16.5px] leading-relaxed text-ivory-dim">{project.summary}</p>

          <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="border border-ivory/12 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-ivory-dim transition-colors group-hover:border-bronze/30"
              >
                {s}
              </li>
            ))}
          </ul>

          <motion.div
            id={`proj-body-${project.index}`}
            initial={false}
            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-7">
              {isWiki ? (
                <div className="space-y-6">
                  {project.lessons && (
                    <ul className="space-y-3 border-l border-crimson/50 pl-5 text-[15px] leading-relaxed text-ivory-dim">
                      {project.lessons.map((l) => (
                        <li key={l} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rotate-45 bg-bronze" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                  <ProjectLinks project={project} />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <ul className="space-y-3 border-l border-crimson/50 pl-5 text-[15px] leading-relaxed text-ivory-dim">
                    {(project.features ?? []).slice(0, 3).map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rotate-45 bg-bronze" />
                        {d}
                      </li>
                    ))}
                    {(project.features ?? []).length === 0 && (
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rotate-45 bg-bronze" />
                        Source and details on GitHub.
                      </li>
                    )}
                  </ul>
                  <ProjectLinks project={project} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-label="Selected work" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
      <Eyebrow index="01" label="Selected work - archive" />
      <Heading className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-5xl leading-[1.02] text-ivory sm:text-6xl lg:col-span-7 lg:text-7xl">
          Three entries,
          <br />
          <span className="italic text-ivory-dim">each a different craft.</span>
        </h2>
        <p className="max-w-md text-[16.5px] leading-relaxed text-ivory-dim lg:col-span-5">
          Each entry opens for detail - summaries up front, specifics inside.
        </p>
      </Heading>
      <div className="mt-10">
        {projects.map((p) => (
          <ProjectEntry key={p.index} project={p} />
        ))}
      </div>
    </section>
  );
}
