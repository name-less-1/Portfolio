import Emblem from "./Emblem";
import Divider from "./Divider";

export default function Footer() {
  return (
    <footer className="relative mx-auto max-w-6xl px-5 pb-12 pt-4 sm:px-8" aria-label="Footer">
      <Divider />
      <div className="flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 text-ivory-dim">
          <Emblem className="h-7 w-7 text-bronze/70" />
          <p className="font-mono text-[11px] uppercase tracking-[0.24em]">
            Aryan — Set in Cormorant & Inter
          </p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory-ghost">
          © {new Date().getFullYear()} · Built with Next.js · No templates
        </p>
        <a
          href="#top"
          data-hover
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-bronze transition-colors hover:text-ivory"
        >
          Return to threshold ↑
        </a>
      </div>
    </footer>
  );
}
