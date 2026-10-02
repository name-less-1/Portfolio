import { skillGroups, tickerItems } from "@/lib/data";
import { Reveal, Heading, Eyebrow } from "./Reveal";

export default function Stack() {
  const line = [...tickerItems, ...tickerItems].join("  ·  ");
  return (
    <section aria-label="Stack" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <Eyebrow index="03" label="Instruments — stack" />
      <Heading className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-5xl leading-[1.02] text-ivory sm:text-6xl lg:col-span-7">
          Tools kept
          <br />
          <span className="italic text-ivory-dim">close at hand.</span>
        </h2>
        <p className="max-w-md text-[16.5px] leading-relaxed text-ivory-dim lg:col-span-5">
          Grouped by use, not hype. The ticker below is the short list.
        </p>
      </Heading>

      <div className="mt-12 grid gap-px overflow-hidden border border-ivory/10 bg-ivory/10 sm:grid-cols-2">
        {skillGroups.map(([group, items], i) => (
          <Reveal key={group} delay={i * 0.12} y={64} className="bg-ink-950 p-8 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-bronze">{group}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {items.map((s) => (
                <li key={s} className="border border-ivory/12 px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-ivory-dim">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* restrained ticker — slow, dim, no neon */}
      <div className="relative mt-8 overflow-hidden border-y border-ivory/10 py-3" aria-hidden="true">
        <p className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-ivory-ghost">
          <span className="inline-block animate-ticker">{line}</span>
        </p>
      </div>
    </section>
  );
}
