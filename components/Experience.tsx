import { experience } from "@/lib/data";
import { Reveal, Heading, Eyebrow } from "./Reveal";

export default function Experience() {
  return (
    <section aria-label="Experience" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <Eyebrow index="02" label="Record — experience" />
      <Heading className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-5xl leading-[1.02] text-ivory sm:text-6xl lg:col-span-7">
          Where the time
          <br />
          <span className="italic text-ivory-dim">has gone.</span>
        </h2>
        <p className="max-w-md text-[16.5px] leading-relaxed text-ivory-dim lg:col-span-5">
          Study, training, and one long-running rabbit hole in retrieval.
        </p>
      </Heading>
      <div className="mt-12 border-t border-ivory/10">
        {experience.map((item, i) => (
          <Reveal key={`${item.role}-${i}`} delay={i * 0.12} x={i % 2 === 0 ? -48 : 48} y={56}>
            <article className="grid gap-6 border-b border-ivory/10 py-10 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bronze">{item.period}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory-ghost">
                  {item.status === "ongoing" ? "● ongoing" : "○ done"}
                </p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-3xl leading-tight text-ivory">{item.role}</h3>
                <p className="mt-1 text-[15px] text-ivory-faint">
                  {item.org}
                  {item.note ? ` — ${item.note}` : ""}
                </p>
                <ul className="mt-5 max-w-2xl space-y-3">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15.5px] leading-relaxed text-ivory-dim">
                      <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rotate-45 bg-bronze" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
