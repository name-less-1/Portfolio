"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { Reveal, Eyebrow } from "./Reveal";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      data-hover
      aria-live="polite"
      className="inline-flex items-center gap-2 border border-ivory/15 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory-dim transition-all hover:border-bronze hover:text-ivory"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function Contact() {
  const channels = [
    {
      n: "I",
      name: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      note: "Best for project inquiries. I reply within a day or two.",
      external: false,
    },
    {
      n: "II",
      name: "GitHub",
      value: "github.com/name-less-1",
      href: profile.github,
      note: "Source code, experiments, work in progress.",
      external: true,
    },
    {
      n: "III",
      name: "LinkedIn",
      value: "linkedin.com/in/aryan-a-14ab31337",
      href: profile.linkedin,
      note: "Background, education, and professional history.",
      external: true,
    },
  ];

  return (
    <section id="contact" aria-label="Contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
      <Eyebrow index="05" label="Contact — open doors" />
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-5xl leading-[1.02] text-ivory sm:text-6xl lg:col-span-8 lg:text-7xl">
          Say hello
          <span className="italic text-ivory-dim"> — plainly.</span>
        </h2>
        <div className="lg:col-span-4">
          <Reveal>
            <p className="max-w-sm text-[16.5px] leading-relaxed text-ivory-dim">
              No form, no ticket queue. Pick the channel that suits you.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CopyButton text={profile.email} label="Copy email" />
              <CopyButton text={profile.phone} label="Copy phone" />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 border-t border-ivory/10">
        {channels.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.06}>
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              data-hover
              className="group grid items-center gap-3 border-b border-ivory/10 py-6 transition-colors hover:bg-ivory/[0.025] sm:grid-cols-12 sm:gap-6 sm:px-4"
            >
              <span className="font-display text-2xl italic text-bronze/60 sm:col-span-1">{c.n}</span>
              <span className="sm:col-span-4">
                <span className="block font-mono text-[11px] uppercase tracking-[0.24em] text-ivory-faint">{c.name}</span>
                <span className="mt-1 block break-all font-display text-2xl text-ivory sm:text-[1.7rem]">{c.value}</span>
              </span>
              <span className="text-[15px] text-ivory-faint sm:col-span-5">{c.note}</span>
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-bronze sm:col-span-2 sm:text-right">
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">Open ↗</span>
              </span>
            </a>
          </Reveal>
        ))}
        {/* copy-only phone row — no tel: link per decision */}
        <Reveal delay={0.18}>
          <div className="grid items-center gap-3 border-b border-ivory/10 py-6 sm:grid-cols-12 sm:gap-6 sm:px-4">
            <span className="font-display text-2xl italic text-bronze/60 sm:col-span-1">IV</span>
            <span className="sm:col-span-4">
              <span className="block font-mono text-[11px] uppercase tracking-[0.24em] text-ivory-faint">Phone · copy only</span>
              <span className="mt-1 block font-display text-2xl text-ivory sm:text-[1.7rem]">{profile.phone}</span>
            </span>
            <span className="text-[15px] text-ivory-faint sm:col-span-5">Available on request — copy the number, no direct dial link.</span>
            <span className="sm:col-span-2 sm:text-right">
              <CopyButton text={profile.phone} label="Copy" />
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory-ghost">
          {profile.status} — internships, freelance builds, research collaboration.
        </p>
      </Reveal>
    </section>
  );
}
