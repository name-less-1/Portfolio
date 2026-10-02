import { profile } from "@/lib/data";
import { Reveal, Eyebrow } from "./Reveal";
import Divider from "./Divider";

export default function About() {
  return (
    <section id="about" aria-label="About" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <Eyebrow index="05" label="About — the hand behind the work" />
      <div className="mt-6 grid gap-12 lg:grid-cols-12">
        <h2 className="font-display text-5xl leading-[1.02] text-ivory sm:text-6xl lg:col-span-7">
          {profile.role}
          <br />
          <span className="italic text-ivory-dim">{profile.years} · {profile.location}</span>
        </h2>
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-[17px] leading-relaxed text-ivory-dim">{profile.bio}</p>
            <p className="mt-5 text-[17px] leading-relaxed text-ivory-dim">
              I like small, legible codebases, clear data models, and deployments
              that stay up without ceremony.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-bronze">
              {profile.node} · {profile.status}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-12">
        <Divider label="Education" />
        <Reveal>
          <div className="grid gap-6 py-8 sm:grid-cols-2">
            <div>
              <p className="font-display text-2xl text-ivory">Lovely Professional University</p>
              <p className="mt-1 text-[15px] text-ivory-dim">B.Tech, Computer Science — {profile.years}</p>
            </div>
            <div className="sm:text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory-faint">Training</p>
              <p className="mt-1 text-[15px] text-ivory-dim">Splen 45-day DSA training, 2026</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
