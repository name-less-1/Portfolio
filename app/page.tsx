"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import { ProjectsSection } from "@/components/Projects";
import Experience from "@/components/Experience";
import Rails from "@/components/Rails";
import Stack from "@/components/Stack";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { projects } from "@/lib/data";

const LOAD_MS = 2200;

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    // hold at 100% briefly, then slow fog-dissolve
    setTimeout(() => setLoading(false), 200);
    setTimeout(() => setLoaded(true), 1000);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(100);
      setLoading(false);
      setLoaded(true);
      doneRef.current = true;
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (doneRef.current) return;
      const elapsed = now - start;
      // game-like pacing: slight ease + stall in the 60-85 band (heavy index load)
      const linear = Math.min(1, elapsed / LOAD_MS);
      const stall =
        linear > 0.6 && linear < 0.85 ? 0.82 : 1;
      const eased = linear * stall + (1 - stall) * 0.6 * linear;
      const jitter = Math.sin(now / 210) * 0.6;
      const pct = Math.min(99, Math.max(0, eased * 100 + jitter));
      setProgress(pct);
      if (linear >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  // lock scroll during loader
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <Loader progress={progress} done={!loading} onSkip={finish} />
      <Rails visible={loaded} />

      <Navbar loaded={loaded} />
      <main id="main" className="relative z-10">
        <Hero loaded={loaded} />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Divider label="The archive" />
        </div>
        <ProjectsSection projects={projects} />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Divider label="Record" />
        </div>
        <Experience />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Divider label="Instruments" />
        </div>
        <Stack />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Divider label="Interlude" />
        </div>
        <About />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Divider label="Correspondence" />
        </div>
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
