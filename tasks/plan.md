# Implementation Plan: Gothic Developer Portfolio — Aryan

## Overview
Cinematic dark-gothic experimental portfolio for Aryan (MERN, AI, search systems). Next.js App Router + TS + Tailwind + Framer Motion + Lenis. Editorial sections, archive-style projects, ambient fog/grain/particles, custom cursor, cinematic loader. Original visual identity — atmosphere-inspired, not game fan-art.

Data source: `my_cv.pdf` — CitizenPulse, DetectiveAI, Wiki Search Engine, Spectral Graph patent, LPU BTech.

## Architecture Decisions
- **Next 14.2 App Router** (stable) + React 18, TypeScript strict. Single `app/page.tsx` composing modular section components.
- **Tailwind 3.4** as primary styling, custom tokens in `tailwind.config.ts` (ink, charcoal, ivory, crimson, bronze). No purple/neon/glassmorphism.
- **Fonts via next/font**: Cormorant Garamond (display serif), Inter (sans), JetBrains Mono (mono for metadata).
- **Framer Motion 11** for entrances, stagger reveals, parallax (`useScroll`+`useTransform`), dividers, hover. **Lenis 1.x** for smooth scroll, disabled if `prefers-reduced-motion`.
- **Background**: pure CSS layers (fog gradients drifting) + SVG noise grain + lightweight canvas particles (~40) + faint SVG arch forms. No images, no copyrighted assets.
- **Loader**: client state in `page.tsx`, ~2.2s, emblem + hairline progress, `AnimatePresence` fade. Skipped fast on reduced-motion.
- **Cursor**: custom dot+ring, `mix-blend` subtle, cursor-reactive ambient light (radial gradient div following mouse via springs). `pointer: fine` only.
- **Copy**: natural, concise, modern. No fantasy quotes. Atmosphere from visuals only.

## Task List

### Phase 1: Foundation
- [x] Task 1: Scaffold (package.json, next/ts/postcss/tailwind configs, app shell)
- [ ] Task 2: Tokens + globals.css + background atmosphere

### Checkpoint: Foundation
- [ ] `npm install` succeeds, `npm run build` passes on shell

### Phase 2: Shell & Atmosphere
- [ ] Task 3: Loader, Cursor, Navbar, layout, Emblem, Reveal/Divider primitives
- [ ] Task 4: Hero + editorial Section system

### Checkpoint: Core
- [ ] Loader transitions, nav anchors work, hero parallax smooth

### Phase 3: Content
- [ ] Task 5: Projects archive (3 entries from CV + patent note)
- [ ] Task 6: About + Contact (interactive, no form) + Footer

### Checkpoint: Complete
- [ ] Responsive 360/768/1024/1440, keyboard nav, reduced-motion respected, `npm run build` clean

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-animation hurting perf/readability | High | Motion hierarchy, `once:true`, canvas capped, `will-change` minimal, reduced-motion kill-switch |
| Tailwind v4 breaking manual setup | Med | Pin Tailwind 3.4, PostCSS config explicit |
| Lenis + anchor conflict | Med | Lenis `anchors:true` or manual scrollTo, fallback native smooth |
| Fonts FOUT | Low | next/font with display:swap, preconnect |

## Open Questions — resolved with assumptions
- Name/role: Aryan — full-stack developer (MERN, search, applied AI) → Correct if wrong.
- Contact: GitHub, LinkedIn, email from CV. No form.
- Visuals: CSS/SVG only, no screenshots (original identity).

Build order: scaffold → tokens/bg → shell → hero → projects → about/contact → verify.
