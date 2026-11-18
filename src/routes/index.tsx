import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Layers3,
  LockKeyhole,
  MousePointer2,
  Move,
  PenTool,
  Play,
  RotateCcw,
  Scan,
  Sparkles,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BriefLock Studio — Creative freedom, without the chaos" },
      {
        name: "description",
        content:
          "Meet BriefLock Studio: a constraint-aware vector poster editor. Lock your logos and colors in place, and edit everything else with confidence.",
      },
      { property: "og:title", content: "BriefLock Studio — Creative freedom, without the chaos" },
      {
        property: "og:description",
        content:
          "Create freely. Keep your logos, colors, and important details exactly where they belong.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Track session state in memory: resets automatically whenever the browser tab is refreshed
let hasEnteredSession = false;

function Index() {
  const [started, setStarted] = useState(hasEnteredSession);
  const [isDismissing, setIsDismissing] = useState(false);

  // High-performance RAF lerp parallax (zero React re-renders, 60/120fps fluid motion)
  const openingRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  const runParallax = useCallback(() => {
    // Silky smooth inertia damping
    const factor = 0.08;
    const dx = targetOffset.current.x - currentOffset.current.x;
    const dy = targetOffset.current.y - currentOffset.current.y;

    currentOffset.current.x += dx * factor;
    currentOffset.current.y += dy * factor;

    if (openingRef.current) {
      openingRef.current.style.setProperty("--mx", `${currentOffset.current.x.toFixed(2)}px`);
      openingRef.current.style.setProperty("--my", `${currentOffset.current.y.toFixed(2)}px`);
    }

    if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) {
      rafId.current = requestAnimationFrame(runParallax);
    } else {
      rafId.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 26;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      targetOffset.current = { x, y };

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(runParallax);
      }
    },
    [runParallax],
  );

  const handleMouseLeave = useCallback(() => {
    targetOffset.current = { x: 0, y: 0 };
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(runParallax);
    }
  }, [runParallax]);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  function startExploring() {
    setIsDismissing(true);
    setTimeout(() => {
      hasEnteredSession = true;
      setStarted(true);
      setIsDismissing(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 400);
  }

  function scrollToHowItWorks(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <main>
      {/* 1. Opening Intro Screen (Shown on initial visit / refresh until clicking START) */}
      {!started && (
        <section
          ref={openingRef}
          className={`opening ${isDismissing ? "opening-dismissing" : ""}`}
          aria-label="BriefLock Studio introduction"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="opening-baseline" aria-hidden="true" />

          <header className="opening-nav">
            <a className="wordmark wordmark-ink" href="#top" aria-label="BriefLock Studio home">
              <span className="brand-mark">
                <LockKeyhole size={17} strokeWidth={2.2} />
              </span>
              <span>
                BriefLock <b>Studio</b>
              </span>
            </a>
            <span className="opening-category">
              VISUAL ART &amp; DESIGN ASSIST <ChevronRight size={12} />
            </span>
          </header>

          <div className="opening-art" aria-hidden="true">
            <svg className="drawing drawing-frame" viewBox="0 0 240 210" fill="none">
              <path d="M29 37 190 21l18 138-164 17z" stroke="currentColor" strokeWidth="2" />
              <path d="m50 60 112-11 11 81-112 12z" stroke="currentColor" strokeWidth="1.6" />
              <path d="m62 123 28-31 22 20 23-34 30 40" stroke="currentColor" strokeWidth="2" />
              <circle
                cx="29"
                cy="37"
                r="5"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="190"
                cy="21"
                r="5"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="47"
                cy="176"
                r="5"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="208"
                cy="159"
                r="5"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m15 92 25-29 12 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <svg className="drawing drawing-palette" viewBox="0 0 180 115" fill="none">
              <path d="M19 70 78 20l79 41-61 38z" stroke="currentColor" strokeWidth="2" />
              <path d="m48 70 18-15 16 10-17 15z" fill="var(--burnt-orange)" />
              <path d="m78 52 16-13 17 10-16 14z" fill="var(--accent-teal)" />
              <path
                d="m106 66 15-12 17 10-15 13z"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="66" cy="89" r="3" fill="currentColor" />
              <circle cx="98" cy="77" r="3" fill="currentColor" />
            </svg>

            <svg className="drawing drawing-pen" viewBox="0 0 180 180" fill="none">
              <path
                d="m35 136 83-96 22 20-84 96-27 5z"
                fill="var(--pen-fill)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="m118 40 13-14 21 18-12 16" stroke="currentColor" strokeWidth="2" />
              <path
                d="m35 136 21 20-27 5z"
                fill="var(--burnt-orange)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="m54 136 81-94" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="m144 23 4-9m8 15 8-5m-13-12 1-9"
                stroke="var(--burnt-orange)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <svg className="drawing drawing-type" viewBox="0 0 150 115" fill="none">
              <path
                d="m28 90 35-67 32 67m-54-21h43m15 21V25h23m-23 31h19m-19 34h23"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M118 20h12v12h-12z" stroke="var(--burnt-orange)" strokeWidth="2" />
            </svg>

            <svg className="drawing drawing-nodes" viewBox="0 0 220 150" fill="none">
              <path d="M20 116C59 32 104 125 197 28" stroke="currentColor" strokeWidth="2" />
              <path
                d="m20 116 49-35m7 9 53-12m68-50-40 30"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
              <circle
                cx="20"
                cy="116"
                r="6"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="76"
                cy="90"
                r="6"
                fill="var(--burnt-orange)"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="197"
                cy="28"
                r="6"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

            {/* Character 1: Moved away from 'EVERY - E', now perched atop the art frame on the left */}
            <div className="doodle-person doodle-one">
              <span className="person-hair" />
              <span className="person-face">·ᴗ·</span>
              <span className="person-body">
                <PenTool size={20} />
              </span>
            </div>

            {/* Character 2: Positioned on the right by the pencil and baseline */}
            <div className="doodle-person doodle-two">
              <span className="person-hair" />
              <span className="person-face">•‿•</span>
              <span className="person-body">
                <Layers3 size={18} />
              </span>
            </div>

            <span className="floating-label label-path">
              PATH 04 <span>↗</span>
            </span>
            <span className="floating-label label-lock">
              <LockKeyhole size={12} /> LOCKED
            </span>
            <span className="accent-star">✳</span>
            <span className="accent-cross">✳</span>
          </div>

          <div className="opening-copy">
            <span className="eyebrow opening-eyebrow">
              <span /> A NEW WAY TO DESIGN WITH AI <span />
            </span>
            <h1>
              EVERY
              <br />
              DETAIL
              <br />
              <em>MATTERS.</em>
            </h1>
            <p>
              Change what you want. Protect what matters.
              <br className="desktop-break" /> Meet the design studio that respects your creative
              decisions.
            </p>
            <Button onClick={startExploring} className="start-button">
              START <ArrowUpRight size={17} />
            </Button>
          </div>

          <div className="opening-footer">
            <span>BUILT FOR CREATORS. NOT COMPROMISES.</span>
            <span>
              CLICK START TO ENTER <ArrowUpRight size={12} />
            </span>
          </div>
        </section>
      )}

      {/* 2. Studio Homepage: Revealed upon clicking START — scrollable through Hero down to 'How it works' */}
      {started && (
        <div id="studio-home" className="homepage homepage-enter">
          {/* Navigation Bar */}
          <SiteNav onHowItWorksClick={scrollToHowItWorks} />

          {/* Hero Section */}
          <section id="top" className="home-hero">
            <div className="hero-copy">
              <span className="hero-pill-badge">
                <Sparkles size={13} />
                <span>THE CREATIVE STUDIO WITH A SAFER HAND</span>
              </span>

              <h2>
                Creative freedom.
                <br />
                <span className="headline-serif-accent">
                  <em>Without the chaos.</em>
                  <svg className="accent-underline-glow" viewBox="0 0 260 12" fill="none">
                    <path d="M3 8C60 2 180 2 257 7" />
                  </svg>
                </span>
              </h2>

              <p>
                Explore a calmer way to create vector designs. Keep your logos, colors, and
                essential details protected by contract, while the rest stays yours to reimagine.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link to="/editor" className="btn-burnt-orange inline-flex items-center gap-2">
                  Open Studio Editor <ArrowUpRight size={16} />
                </Link>
                <a
                  className="btn-secondary-pill inline-flex items-center gap-2"
                  href="#how-it-works"
                  onClick={scrollToHowItWorks}
                >
                  <Play size={13} fill="currentColor" /> Watch workflow
                </a>
              </div>

              <div className="hero-proof">
                <span>
                  <Check size={13} /> Your details, respected
                </span>
                <i />
                <span>
                  <Check size={13} /> Your layers, your call
                </span>
                <i />
                <span className="hidden sm:inline-flex">
                  <Sparkles size={12} className="text-burnt-orange" /> GeNarrative 50% Foundation
                </span>
              </div>
            </div>

            {/* Right Hero Graphic: Layered Burnt Orange Accent + Dark Workspace Artboard + Floating Cards */}
            <div
              className="hero-art-container"
              aria-label="Conceptual vector poster editor preview"
            >
              <div className="hero-art-offset-layer" />

              <div className="hero-art-card">
                <div className="hero-art-top">
                  <span>
                    <span className="live-dot" /> STUDIO PREVIEW
                  </span>
                  <span>POSTER — NOVA 01</span>
                </div>

                {/* Poster Art Artboard */}
                <div className="poster-art">
                  <span className="poster-small">
                    THE SHAPE
                    <br />
                    OF AN IDEA
                  </span>
                  <span className="poster-orbit orbit-a" />
                  <span className="poster-orbit orbit-b" />
                  <span className="poster-sun" />
                  <span className="poster-shape shape-orange" />
                  <span className="poster-shape shape-teal" />
                  <span className="poster-big">
                    NOVA
                    <br />
                    <i>SUMMIT</i>
                  </span>
                  <span className="poster-caption">21 NOV 2026 • KOLKATA</span>
                  <span className="poster-coordinates">
                    BL—001
                    <br />
                    45° 21&apos; N
                  </span>
                </div>

                <div className="art-toolbar">
                  <span className="toolbar-active">
                    <MousePointer2 size={15} />
                  </span>
                  <span>
                    <Move size={15} />
                  </span>
                  <span>
                    <Type size={15} />
                  </span>
                  <span>
                    <PenTool size={15} />
                  </span>
                  <span>
                    <Scan size={15} />
                  </span>
                  <i />
                  <span>
                    <RotateCcw size={14} />
                  </span>
                  <span>100%</span>
                </div>

                <div className="hero-art-foot">
                  <span>
                    <span className="mini-dot" /> VECTOR POSTER MODEL
                  </span>
                  <span>PROTECTED SVG &nbsp; / &nbsp; 01</span>
                </div>
              </div>

              {/* Floating Card 1: Top Right */}
              <div className="floating-hero-card floating-card-top hidden sm:block">
                <span className="font-mono text-[8px] uppercase tracking-wider text-stone-500">
                  Contract Lock
                </span>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-display text-lg font-bold text-stone-900">3 of 7</span>
                  <span className="font-mono text-[10px] text-stone-600">Protected</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-burnt-orange/15 text-burnt-orange">
                    <LockKeyhole size={8} />
                  </span>
                  <span className="font-mono text-[8.5px] text-stone-700">
                    NOVA &amp; Date Guarded
                  </span>
                </div>
              </div>

              {/* Floating Card 2: Bottom Left */}
              <div className="floating-hero-card floating-card-bottom">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-1.5">
                  <span className="flex items-center gap-1.5 font-mono text-[9px] font-semibold text-stone-900">
                    <LockKeyhole size={11} className="text-burnt-orange" /> Active Constraints
                  </span>
                  <span className="font-mono text-[7.5px] text-stone-500">TODAY</span>
                </div>
                <ul className="mt-2 space-y-1.5 font-mono text-[8.5px] text-stone-700">
                  <li className="flex items-center gap-1.5">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-stone-900 text-[8px] text-stone-100">
                      ✓
                    </span>
                    <span>NOVA Brand Mark Locked</span>
                    <span className="ml-auto text-[7.5px] text-stone-400">Strict</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-stone-900 text-[8px] text-stone-100">
                      ✓
                    </span>
                    <span>Event Date &amp; City Guarded</span>
                    <span className="ml-auto text-[7.5px] text-stone-400">Strict</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-burnt-orange text-[8px] text-white">
                      ✎
                    </span>
                    <span className="font-medium text-stone-900">Headline: DESIGN FUTURES</span>
                    <span className="ml-auto font-semibold text-burnt-orange text-[7.5px]">
                      Editable
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5 border-t border-stone-100 pt-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-burnt-orange shadow-[0_0_6px_var(--burnt-orange)]" />
                    <span className="text-stone-600">AI Validation Engine</span>
                    <span className="ml-auto rounded bg-burnt-orange/15 px-1.5 py-0.5 font-semibold text-burnt-orange text-[7px]">
                      Live Sprint
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sponsor / Partner Typography Strip */}
          <section
            className="border-b border-stone-300/40 bg-stone-100/60 px-6 py-4"
            aria-label="Event context"
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 font-mono text-[9px] tracking-wider text-stone-500 uppercase">
              <span>GENARRATIVE CLASH 2026 • 50% FOUNDATION</span>
              <span className="text-stone-800 font-semibold">NOVA LABS</span>
              <span>STRATUS</span>
              <span className="text-stone-800 font-semibold">VECTOR STUDIO</span>
              <span>PARCEL</span>
              <span className="text-stone-800 font-semibold">SCIENCE CITY KOLKATA</span>
              <span>ACME ART</span>
            </div>
          </section>

          {/* 3. Story Section: 01 Create, 02 Protect, 03 Control */}
          <section id="how-it-works" className="story-section">
            <div className="section-heading">
              <span className="eyebrow">
                <span className="section-index">01</span> YOUR PROCESS, IN YOUR HANDS
              </span>
              <h2>
                Three words.
                <br />
                <span className="headline-serif-accent">
                  <em>A better way to work.</em>
                  <svg className="accent-underline-glow" viewBox="0 0 240 12" fill="none">
                    <path d="M3 8C55 2 170 2 237 7" />
                  </svg>
                </span>
              </h2>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">
                  01 <PenTool size={18} />
                </span>
                <h3>Create</h3>
                <p>
                  Start with a structured vector scene model. Build posters and brand collateral
                  that feel unmistakably yours.
                </p>
                <span className="step-accent-bar" />
              </article>

              <article className="step-card step-card-accent">
                <span className="step-number">
                  02 <LockKeyhole size={18} className="text-burnt-orange" />
                </span>
                <h3>Protect</h3>
                <p>
                  Mark your logo, event date, brand colors, and critical placements. Lock the
                  signature details you cannot afford to lose.
                </p>
                <span className="step-accent-bar" />
              </article>

              <article className="step-card">
                <span className="step-number">
                  03 <Layers3 size={18} />
                </span>
                <h3>Control</h3>
                <p>
                  Iterate manually now, and with constraint-aware AI in the live sprint. The
                  creative contract remains fully in your hands.
                </p>
                <span className="step-accent-bar" />
              </article>
            </div>

            {/* End of Home Scroll — Transition Card to Studio Editor Route */}
            <div className="mt-14 rounded-2xl border-2 border-stone-800 bg-white/75 p-8 sm:p-10 text-center shadow-sm">
              <span className="eyebrow justify-center">
                <span className="section-index">02</span> READY TO DESIGN WITH INTEGRITY?
              </span>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-stone-900">
                Jump into the Studio Editor workspace.
              </h3>
              <p className="mt-2 max-w-md mx-auto font-mono text-xs text-stone-600 leading-relaxed">
                Lock your signature brand details, test coordinate bounds, and edit your poster on a
                dedicated canvas route.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/editor" className="btn-burnt-orange inline-flex items-center gap-2">
                  Open Studio Editor <ArrowUpRight size={16} />
                </Link>
                <Link
                  to="/contract"
                  className="btn-secondary-pill inline-flex items-center gap-1.5"
                >
                  <LockKeyhole size={13} className="text-burnt-orange" /> Read Design Contract
                </Link>
              </div>
            </div>
          </section>

          {/* Site Footer */}
          <footer className="site-footer">
            <a className="wordmark wordmark-light" href="#top">
              <span className="brand-mark">
                <LockKeyhole size={15} />
              </span>
              <span>
                BriefLock <b>Studio</b>
              </span>
            </a>
            <span>MAKE ROOM FOR WHAT&apos;S NEXT. PROTECT WHAT MATTERS.</span>
            <span className="font-mono text-[8px]">
              VISUAL ART &amp; DESIGN ASSIST • GENARRATIVE CLASH 2026
            </span>
          </footer>
        </div>
      )}
    </main>
  );
}
