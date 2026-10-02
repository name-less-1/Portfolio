import { notes } from "@/lib/data";
import { Reveal, Heading, Eyebrow } from "./Reveal";

export default function Notes() {
  return (
    <section aria-label="Notes" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <Eyebrow index="04" label="Marginalia — notes" />
      <Heading className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-5xl leading-[1.02] text-ivory sm:text-6xl lg:col-span-7">
          Build logs,
          <br />
          <span className="italic text-ivory-dim">kept while shipping.</span>
        </h2>
        <p className="max-w-md text-[16.5px] leading-relaxed text-ivory-dim lg:col-span-5">
          Specific entries from the work above — no filler.
        </p>
      </Heading>
      <div className="mt-12 border-t border-ivory/10">
        {notes.map((n, i) => (
          <Reveal key={n.index} delay={i * 0.12} x={i % 2 === 0 ? 48 : -48} y={48}>
            <div className="grid items-baseline gap-2 border-b border-ivory/10 py-7 sm:grid-cols-12 sm:gap-6">
              <span className="font-display text-2xl italic text-bronze/60 sm:col-span-1">{n.index}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ivory-ghost sm:col-span-4">{n.tag}</span>
              <span className="font-display text-2xl leading-snug text-ivory sm:col-span-7">{n.title}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
