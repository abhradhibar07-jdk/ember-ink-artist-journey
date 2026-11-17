import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Command,
  Eye,
  Layers3,
  LockKeyhole,
  MousePointer2,
  Move,
  PenTool,
  Play,
  Plus,
  RotateCcw,
  Scan,
  Sparkles,
  Type,
  UnlockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Scene Element Data Contract (Aligned with BriefLock Foundation)
type BaseElement = {
  id: string;
  name: string;
  locked: boolean;
};

export type TextElement = BaseElement & {
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontWeight?: string;
  letterSpacing?: number;
};

export type ShapeElement = BaseElement & {
  type: "rect" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  rx?: number;
  fill: string;
  opacity?: number;
};

export type DesignElement = TextElement | ShapeElement;

const DEFAULT_ELEMENTS: DesignElement[] = [
  {
    id: "nova-logo",
    name: "NOVA Brand Mark",
    type: "text",
    text: "NOVA",
    x: 60,
    y: 110,
    fontSize: 42,
    fill: "#1A1918",
    fontWeight: "700",
    letterSpacing: 2,
    locked: true,
  },
  {
    id: "event-tag",
    name: "Event Category",
    type: "text",
    text: "THE CREATIVE SUMMIT • KOLKATA 2026",
    x: 60,
    y: 145,
    fontSize: 10,
    fill: "#66615B",
    fontWeight: "600",
    letterSpacing: 3,
    locked: true,
  },
  {
    id: "geo-sun",
    name: "Geometric Sun (Orb)",
    type: "circle",
    x: 440,
    y: 300,
    radius: 95,
    fill: "#EA580C",
    opacity: 0.92,
    locked: false,
  },
  {
    id: "geo-accent",
    name: "Arch Pillar Form",
    type: "rect",
    x: 260,
    y: 220,
    width: 130,
    height: 210,
    rx: 65,
    fill: "#0D9488",
    opacity: 0.85,
    locked: false,
  },
  {
    id: "headline",
    name: "Main Headline",
    type: "text",
    text: "DESIGN FUTURES",
    x: 60,
    y: 520,
    fontSize: 34,
    fill: "#1A1918",
    fontWeight: "800",
    letterSpacing: -0.5,
    locked: false,
  },
  {
    id: "subhead",
    name: "Sub-headline",
    type: "text",
    text: "REIMAGINING THE VISUAL SPECTRUM",
    x: 60,
    y: 565,
    fontSize: 14,
    fill: "#66615B",
    fontWeight: "500",
    letterSpacing: 1.5,
    locked: false,
  },
  {
    id: "date-venue",
    name: "Date & Location",
    type: "text",
    text: "21 NOV 2026 • SCIENCE CITY CONVENTION CENTER",
    x: 60,
    y: 735,
    fontSize: 11,
    fill: "#1A1918",
    fontWeight: "600",
    letterSpacing: 2,
    locked: true,
  },
];

const LOCAL_STORAGE_KEY = "brieflock_studio_poster_v2";

function Index() {
  const [started, setStarted] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState<DesignElement[]>(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState<string>("headline");
  const [saveStatus, setSaveStatus] = useState<string>("Auto-saved to LocalStorage");
  const [isClient, setIsClient] = useState(false);

  // Restore saved poster from localStorage after client mounts (eliminates SSR hydration mismatch!)
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setElements(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to restore poster from localStorage:", e);
    }
  }, []);

  // Save to localStorage whenever elements change
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(elements));
      setSaveStatus("Auto-saved to LocalStorage");
    } catch (e) {
      console.warn("Failed to persist poster to localStorage:", e);
    }
  }, [elements, isClient]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 24;
    const y = ((clientY - top) / height - 0.5) * 24;
    setMouseOffset({ x, y });
  }

  function handleMouseLeave() {
    setMouseOffset({ x: 0, y: 0 });
  }

  function startExploring() {
    setStarted(true);
    document.getElementById("studio-home")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function toggleLock(id: string) {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return { ...el, locked: !el.locked };
        }
        return el;
      }),
    );
  }

  function updateSelectedElement(patch: Partial<DesignElement>) {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId) {
          if (el.locked) return el;
          return { ...el, ...patch } as DesignElement;
        }
        return el;
      }),
    );
  }

  function resetToDefault() {
    setElements(DEFAULT_ELEMENTS);
    setSelectedId("headline");
    setSaveStatus("Reset to original demo");
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  }

  const selectedElement =
    elements.find((el) => el.id === selectedId) ??
    (elements[0] as DesignElement) ??
    (DEFAULT_ELEMENTS[0] as DesignElement);
  const lockedCount = elements.filter((el) => el.locked).length;

  return (
    <main>
      {/* 1. Opening Intro Screen (Playful Cream Paper & Ink Doodles with Burnt Orange Edge Shadows) */}
      <section
        className={`opening ${started ? "opening-started" : ""}`}
        aria-label="BriefLock Studio introduction"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          {
            "--mx": `${mouseOffset.x}px`,
            "--my": `${mouseOffset.y}px`,
          } as React.CSSProperties
        }
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

          {/* Character 1: Moved away from 'EVERY - E', now playfully perched atop the art frame on the left */}
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
            SCROLL TO EXPLORE <ArrowDown size={12} />
          </span>
        </div>
      </section>

      {/* 2. Studio Homepage: CREAMY COLOR & INK BLACK */}
      <div id="studio-home" className="homepage">
        {/* Navigation Bar */}
        <nav className="site-nav" aria-label="Main navigation">
          <a className="wordmark wordmark-light" href="#top">
            <span className="brand-mark">
              <LockKeyhole size={16} />
            </span>
            <span>
              BriefLock <b>Studio</b>
            </span>
          </a>
          <div className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#design-contract">Design Contract</a>
            <a href="#workspace">Studio Editor</a>
            <a href="#sprint-boundaries">Sprint Roadmap</a>
          </div>
          <div className="flex items-center gap-3">
            <a className="btn-burnt-orange hidden sm:inline-flex" href="#workspace">
              Explore the studio <ArrowUpRight size={14} />
            </a>
          </div>
        </nav>

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
              Explore a calmer way to create vector designs. Keep your logos, colors, and essential
              details protected by contract, while the rest stays yours to reimagine.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a className="btn-burnt-orange" href="#workspace">
                Open Studio Editor <ArrowUpRight size={16} />
              </a>
              <a className="btn-secondary-pill" href="#how-it-works">
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
          <div className="hero-art-container" aria-label="Conceptual vector poster editor preview">
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
                Start with a structured vector scene model. Build posters and brand collateral that
                feel unmistakably yours.
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
                Iterate manually now, and with constraint-aware AI in the live sprint. The creative
                contract remains fully in your hands.
              </p>
              <span className="step-accent-bar" />
            </article>
          </div>
        </section>

        {/* 4. Design Contract Section */}
        <section id="design-contract" className="contract-section">
          <div className="contract-copy">
            <span className="eyebrow">
              <span className="section-index">02</span> THE DESIGN CONTRACT
            </span>
            <h2>
              Your signature.
              <br />
              <span className="headline-serif-accent">
                <em>Still yours.</em>
                <svg className="accent-underline-glow" viewBox="0 0 160 12" fill="none">
                  <path d="M3 8C40 2 110 2 157 7" />
                </svg>
              </span>
            </h2>
            <p>
              A simple creative promise: decide what stays put, and what can move. Logos, brand
              colors, essential text, and positioning are marked as protected by contract — while
              flexible layers remain open for manual edits.
            </p>
            <a
              href="#workspace"
              className="mt-5 inline-flex items-center gap-2 border-b border-burnt-orange pb-1 font-mono text-xs font-semibold text-stone-900 transition-all hover:gap-3"
            >
              Explore the controls <ArrowRight size={14} />
            </a>
          </div>

          <div className="contract-visual">
            <div className="contract-diagram">
              <div className="orbit-line" />
              <div className="orbit-two" />
              <div className="contract-lock-main">
                <LockKeyhole size={26} strokeWidth={2.2} />
              </div>
              <span className="contract-pill-tag tag-logo">
                <LockKeyhole size={9} className="mr-1 inline text-burnt-orange" /> NOVA LOGO
              </span>
              <span className="contract-pill-tag tag-date">
                <LockKeyhole size={9} className="mr-1 inline text-burnt-orange" /> 21 NOV 2026
              </span>
              <span className="contract-pill-tag tag-color">
                <span /> BRAND COLOR
              </span>
              <span className="contract-pill-tag tag-headline">
                <span className="mr-1 text-burnt-orange">✎</span> HEADLINE [EDITABLE]
              </span>
              <div className="diagram-stamp">
                BY DESIGN
                <br />
                BY YOU
              </div>
            </div>
          </div>

          <div className="contract-details">
            <span>
              <LockKeyhole size={14} /> Protect the essentials
            </span>
            <span>
              <Move size={14} /> Keep creative layers flexible
            </span>
            <span>
              <Eye size={14} /> Visible contract boundaries
            </span>
          </div>
        </section>

        {/* 5. Working Space Section:
            THE OUTER SECTION IS CREAMY (#FAF7F2), ONLY THE WORKING SPACE (.editor-window) IS BLACKISH */}
        <section id="workspace" className="workspace-section">
          <div className="workspace-heading">
            <div>
              <span className="eyebrow">
                <span className="section-index">03</span> A SPACE THAT MAKES SENSE
              </span>
              <h2>Meet your creative corner.</h2>
            </div>
            <span className="concept-tag">
              <span className="mini-dot" /> FUNCTIONAL 50% FOUNDATION
            </span>
          </div>

          {/* THE WORKING SPACE — BLACKISH / DARK CHARCOAL CREATOR STUDIO */}
          <div className="editor-window">
            {/* Editor Top Bar */}
            <div className="editor-topbar">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-300">
                <LockKeyhole size={11} className="text-burnt-orange" />
                <span>nova_creative_summit_2026.bl</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-burnt-orange shadow-[0_0_6px_var(--burnt-orange)]" />
                  <span>{saveStatus}</span>
                </div>
                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 font-mono text-[8px] text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                  title="Reset to initial sample poster"
                >
                  <RotateCcw size={10} /> Reset Demo
                </button>
              </div>
            </div>

            {/* Left Sidebar: Layers Panel */}
            <aside className="editor-panel layer-panel">
              <div className="panel-title">
                <span className="flex items-center gap-1.5 font-bold">
                  <Layers3 size={13} /> LAYERS ({elements.length})
                </span>
                <Plus size={12} className="text-zinc-500" />
              </div>

              <div className="layer-group">
                <span>POSTER — NOVA 2026</span>
                <ChevronRight size={10} />
              </div>

              <div className="space-y-1">
                {elements.map((el) => {
                  const isSelected = el.id === selectedId;
                  const Icon = el.type === "text" ? Type : Scan;

                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`layer-row-item ${isSelected ? "layer-row-selected" : ""} ${el.locked ? "layer-row-locked" : ""}`}
                    >
                      <Icon
                        size={12}
                        className={el.locked ? "text-burnt-orange" : "text-zinc-400"}
                      />
                      <span>{el.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(el.id);
                        }}
                        className={`layer-lock-btn ${el.locked ? "is-locked" : ""}`}
                        aria-label={el.locked ? `Unlock ${el.name}` : `Lock ${el.name}`}
                        title={
                          el.locked
                            ? "Unlock layer to allow manual edits"
                            : "Lock layer to protect from changes"
                        }
                      >
                        {el.locked ? <LockKeyhole size={12} /> : <UnlockKeyhole size={12} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="panel-bottom">
                <span>
                  <Check size={11} /> {lockedCount} OF {elements.length} LAYERS PROTECTED
                </span>
              </div>
            </aside>

            {/* Center Canvas: Deep Dark Canvas with Responsive SVG Poster */}
            <div className="editor-canvas">
              <div className="canvas-ruler">
                A &nbsp;&nbsp; B &nbsp;&nbsp; C &nbsp;&nbsp; D &nbsp;&nbsp; E &nbsp;&nbsp; F
                &nbsp;&nbsp; G
              </div>

              {/* The SVG Poster Artboard */}
              <div className="relative aspect-[600/800] w-full max-w-[325px] overflow-hidden rounded-xl border border-stone-300/40 bg-[#FAF7F2] shadow-2xl select-none">
                <svg viewBox="0 0 600 800" className="h-full w-full">
                  {/* Poster Background Pattern */}
                  <rect width="600" height="800" fill="#FAF7F2" />
                  <circle
                    cx="540"
                    cy="60"
                    r="160"
                    fill="none"
                    stroke="#E2DDD5"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line x1="60" y1="165" x2="540" y2="165" stroke="#E5DFD7" strokeWidth="1.5" />
                  <line x1="60" y1="710" x2="540" y2="710" stroke="#E5DFD7" strokeWidth="1.5" />

                  {/* Render Elements Dynamically with Type-Safe Guards */}
                  {elements.map((el) => {
                    const isSelected = el.id === selectedId;

                    if (el.type === "circle") {
                      return (
                        <g
                          key={el.id}
                          onClick={() => setSelectedId(el.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <circle
                            cx={el.x}
                            cy={el.y}
                            r={el.radius ?? 80}
                            fill={el.fill}
                            opacity={el.opacity ?? 1}
                          />
                          {isSelected && (
                            <rect
                              x={el.x - (el.radius ?? 80) - 4}
                              y={el.y - (el.radius ?? 80) - 4}
                              width={(el.radius ?? 80) * 2 + 8}
                              height={(el.radius ?? 80) * 2 + 8}
                              fill="none"
                              stroke="var(--burnt-orange)"
                              strokeWidth="1.8"
                              strokeDasharray="4 2"
                            />
                          )}
                        </g>
                      );
                    }

                    if (el.type === "rect") {
                      return (
                        <g
                          key={el.id}
                          onClick={() => setSelectedId(el.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <rect
                            x={el.x}
                            y={el.y}
                            width={el.width ?? 120}
                            height={el.height ?? 180}
                            rx={el.rx ?? 0}
                            fill={el.fill}
                            opacity={el.opacity ?? 1}
                          />
                          {isSelected && (
                            <rect
                              x={el.x - 4}
                              y={el.y - 4}
                              width={(el.width ?? 120) + 8}
                              height={(el.height ?? 180) + 8}
                              fill="none"
                              stroke="var(--burnt-orange)"
                              strokeWidth="1.8"
                              strokeDasharray="4 2"
                            />
                          )}
                        </g>
                      );
                    }

                    // Text Element
                    const textEl = el as TextElement;
                    return (
                      <g
                        key={textEl.id}
                        onClick={() => setSelectedId(textEl.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <text
                          x={textEl.x}
                          y={textEl.y}
                          fill={textEl.fill}
                          fontSize={textEl.fontSize}
                          fontWeight={textEl.fontWeight ?? "normal"}
                          fontFamily={textEl.fontFamily ?? "Space Grotesk, sans-serif"}
                          letterSpacing={
                            textEl.letterSpacing ? `${textEl.letterSpacing}px` : undefined
                          }
                        >
                          {textEl.text}
                        </text>
                        {isSelected && (
                          <rect
                            x={textEl.x - 6}
                            y={textEl.y - textEl.fontSize + 4}
                            width={textEl.text.length * (textEl.fontSize * 0.58) + 12}
                            height={textEl.fontSize + 8}
                            fill="none"
                            stroke="var(--burnt-orange)"
                            strokeWidth="1.8"
                            strokeDasharray="4 2"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="canvas-footer">
                <span className="flex items-center gap-1.5">
                  <MousePointer2 size={11} className="text-burnt-orange" /> SELECT TOOL
                </span>
                <span>
                  X: {selectedElement.x} &nbsp; Y: {selectedElement.y}
                </span>
                <span>600 × 800 SVG</span>
              </div>
            </div>

            {/* Right Sidebar: Properties Inspector */}
            <aside className="editor-panel properties-panel">
              <div className="panel-title">
                <span className="font-bold">PROPERTIES</span>
                <CircleHelp size={12} className="text-zinc-500" />
              </div>

              <span className="property-label">SELECTION</span>
              <div className="selection-box">
                <span className="selection-icon">
                  {selectedElement.type === "text" ? <Type size={14} /> : <Scan size={14} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-white">{selectedElement.name}</div>
                  <small className="uppercase">
                    {selectedElement.type} • ID: {selectedElement.id}
                  </small>
                </div>
              </div>

              {/* Lock / Protected Status Switch */}
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={() => toggleLock(selectedElement.id)}
                  className={`flex w-full items-center justify-between rounded-lg p-2.5 font-mono text-[9px] transition-all ${
                    selectedElement.locked
                      ? "border border-burnt-orange/50 bg-burnt-orange/15 text-burnt-orange shadow-[0_0_12px_rgba(224,86,36,0.18)]"
                      : "border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {selectedElement.locked ? (
                      <LockKeyhole size={13} />
                    ) : (
                      <UnlockKeyhole size={13} />
                    )}
                    <span>
                      {selectedElement.locked ? "PROTECTED (LOCKED)" : "UNLOCKED (EDITABLE)"}
                    </span>
                  </span>
                  <span className="rounded bg-zinc-900/60 px-1.5 py-0.5 text-[8px]">
                    {selectedElement.locked ? "Contract Guarded" : "Tap to Lock"}
                  </span>
                </button>
              </div>

              {selectedElement.locked ? (
                <div className="property-lock-card">
                  <LockKeyhole size={14} className="shrink-0" />
                  <div>
                    <span className="font-semibold">Protected Detail</span>
                    <small>
                      Direct manual editing is disabled to preserve brand contract rules.
                    </small>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3.5">
                  {/* Text Content Input */}
                  {selectedElement.type === "text" && (
                    <div>
                      <span className="property-label">TEXT CONTENT</span>
                      <input
                        type="text"
                        value={(selectedElement as TextElement).text}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="inspector-input"
                        placeholder="Element text..."
                      />
                    </div>
                  )}

                  {/* Font Size */}
                  {selectedElement.type === "text" && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="property-label">FONT SIZE</span>
                        <span className="font-mono text-[9px] text-zinc-400">
                          {(selectedElement as TextElement).fontSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="80"
                        value={(selectedElement as TextElement).fontSize}
                        onChange={(e) =>
                          updateSelectedElement({ fontSize: Number(e.target.value) })
                        }
                        className="h-1.5 w-full cursor-pointer accent-burnt-orange"
                      />
                    </div>
                  )}

                  {/* Circle Radius */}
                  {selectedElement.type === "circle" && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="property-label">RADIUS</span>
                        <span className="font-mono text-[9px] text-zinc-400">
                          {(selectedElement as ShapeElement).radius ?? 80}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="160"
                        value={(selectedElement as ShapeElement).radius ?? 80}
                        onChange={(e) => updateSelectedElement({ radius: Number(e.target.value) })}
                        className="h-1.5 w-full cursor-pointer accent-burnt-orange"
                      />
                    </div>
                  )}

                  {/* Position Coordinates */}
                  <div>
                    <span className="property-label">POSITION</span>
                    <div className="field-pair">
                      <span>
                        X:
                        <input
                          type="number"
                          value={selectedElement.x}
                          onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                        />
                      </span>
                      <span>
                        Y:
                        <input
                          type="number"
                          value={selectedElement.y}
                          onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div>
                    <span className="property-label">COLOR FILL</span>
                    <div className="color-options">
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ fill: "#1A1918" })}
                        className={`swatch swatch-black ${selectedElement.fill === "#1A1918" ? "swatch-selected" : ""}`}
                        title="Ink Black"
                      />
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ fill: "#EA580C" })}
                        className={`swatch swatch-orange ${selectedElement.fill === "#EA580C" ? "swatch-selected" : ""}`}
                        title="Burnt Orange"
                      />
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ fill: "#0D9488" })}
                        className={`swatch swatch-teal ${selectedElement.fill === "#0D9488" ? "swatch-selected" : ""}`}
                        title="Accent Teal"
                      />
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ fill: "#FAF7F2" })}
                        className={`swatch swatch-cream ${selectedElement.fill === "#FAF7F2" ? "swatch-selected" : ""}`}
                        title="Cream Paper"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reserved Live Sprint AI Notice */}
              <div className="mt-6 border-t border-zinc-800 pt-4">
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/40 p-2 font-mono text-[8px] text-zinc-500 cursor-not-allowed"
                  title="Reserved for GeNarrative Clash live sprint on Nov 21"
                >
                  <Sparkles size={11} className="text-burnt-orange/60" />
                  <span>AI Edits — Live Sprint Nov 21</span>
                </button>
                <p className="mt-1.5 text-center font-mono text-[7px] text-zinc-500">
                  AI generative patch &amp; contract validator reserved.
                </p>
              </div>
            </aside>

            {/* Editor Footer Status Bar */}
            <div className="editor-footer">
              <span>
                <Command size={11} /> READY FOR MANUAL EDITS
              </span>
              <span className="hidden sm:inline-block">LOCAL PERSISTENCE • 50% FOUNDATION</span>
              <span>
                <Eye size={11} /> NO BACKEND / NO CLOUD DEPENDENCY
              </span>
            </div>
          </div>

          {/* Foundation Scope Disclaimer Card */}
          <div id="sprint-boundaries" className="editor-disclaimer">
            <span>
              ✦ 50% PRE-EVENT FOUNDATION: Responsive vector workspace, manual layer locking, and
              local persistence.
            </span>
            <span>
              AI API ORCHESTRATION &amp; CONTRACT VALIDATION ARE RESERVED FOR THE NOV 21 LIVE
              SPRINT.
            </span>
          </div>
        </section>

        {/* 6. Site Footer (Cream Paper with Ink Black Typography) */}
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
    </main>
  );
}
