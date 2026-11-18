import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock, LockKeyhole, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Sprint Roadmap — BriefLock Studio" },
      {
        name: "description",
        content:
          "50% Pre-event Foundation scope vs 100% Live Sprint deliverables for the GeNarrative Clash Hackathon 2026.",
      },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <div className="homepage min-h-screen bg-[var(--paper)] text-[var(--ink-paper)]">
      <SiteNav />

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center gap-2 font-mono text-[9px] text-stone-500 uppercase tracking-widest">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-burnt-orange">
            <ArrowLeft size={11} /> BriefLock Studio
          </Link>
          <span>/</span>
          <span className="text-burnt-orange font-semibold">Sprint Roadmap</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className="eyebrow">
            <span className="section-index">04</span> HACKATHON SCOPE &amp; DELIVERY
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Clear Boundaries.
            <br />
            <span className="headline-serif-accent">
              <em>Honest Delivery.</em>
              <svg className="accent-underline-glow" viewBox="0 0 200 12" fill="none">
                <path d="M3 8C45 2 140 2 197 7" />
              </svg>
            </span>
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-xs leading-relaxed text-stone-600">
            Per the Visual Art &amp; Design Assist track rules, this foundation is 50% pre-built to
            ensure stability. All AI integration and generative validation are reserved for the live
            sprint on November 21 at Science City Kolkata.
          </p>
        </div>

        {/* Roadmap Grid: 50% Foundation vs 100% Live Sprint */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* 50% Foundation Box */}
          <div className="rounded-2xl border-2 border-stone-800 bg-white/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="rounded bg-stone-900 px-2 py-0.5 font-mono text-[9px] font-bold text-stone-100 uppercase tracking-wider">
                  Phase 01 • Complete
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-stone-900">
                  50% Pre-Event Foundation
                </h2>
              </div>
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>

            <ul className="mt-6 space-y-4 font-mono text-xs text-stone-700">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                  ✓
                </span>
                <div>
                  <strong className="text-stone-900">Vector Scene Model:</strong> Structured
                  geometry (text, circles, rectangles) with coordinate &amp; style bindings.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                  ✓
                </span>
                <div>
                  <strong className="text-stone-900">Interactive Canvas:</strong> Responsive 600×800
                  SVG artboard with direct element selection outlines.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                  ✓
                </span>
                <div>
                  <strong className="text-stone-900">Manual Constraint Locking:</strong> Per-layer
                  immutable locking preventing accidental edits to critical brand details.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                  ✓
                </span>
                <div>
                  <strong className="text-stone-900">Local Persistence:</strong> Automatic saving to
                  browser LocalStorage with error-safe hydration guards.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                  ✓
                </span>
                <div>
                  <strong className="text-stone-900">Properties Inspector:</strong> Real-time text,
                  font size, radius, coordinate, and color swatch editing.
                </div>
              </li>
            </ul>

            <div className="mt-8 border-t border-stone-200 pt-4">
              <Link
                to="/editor"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 font-mono text-xs font-semibold text-stone-100 transition-colors hover:bg-burnt-orange"
              >
                Test Foundation in Studio Editor <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* 100% Live Sprint Box */}
          <div className="rounded-2xl border-2 border-burnt-orange/50 bg-burnt-orange/5 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-burnt-orange/20 pb-4">
              <div>
                <span className="rounded bg-burnt-orange px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                  Phase 02 • Nov 21 Sprint
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-stone-900">
                  100% Live Event Deliverables
                </h2>
              </div>
              <Clock size={28} className="text-burnt-orange" />
            </div>

            <ul className="mt-6 space-y-4 font-mono text-xs text-stone-700">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-burnt-orange/20 text-[10px] font-bold text-burnt-orange">
                  ⏳
                </span>
                <div>
                  <strong className="text-stone-900">Gemini 2.5 API Integration:</strong> Natural
                  language prompt parsing for generative style variations.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-burnt-orange/20 text-[10px] font-bold text-burnt-orange">
                  ⏳
                </span>
                <div>
                  <strong className="text-stone-900">Automated Contract Guard:</strong> AI
                  generations strictly validate against locked layers; invalid diffs are rejected.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-burnt-orange/20 text-[10px] font-bold text-burnt-orange">
                  ⏳
                </span>
                <div>
                  <strong className="text-stone-900">Generative Vector Inpainting:</strong> Fill and
                  adapt empty or unlocked poster zones based on theme prompts.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-burnt-orange/20 text-[10px] font-bold text-burnt-orange">
                  ⏳
                </span>
                <div>
                  <strong className="text-stone-900">Multi-Format Vector Export:</strong> Download
                  production-ready SVG and high-resolution print PDF.
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-xl border border-burnt-orange/30 bg-white/60 p-4 font-mono text-[10px] text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-burnt-orange">
                <Sparkles size={12} /> Venue: Science City Kolkata
              </div>
              <p className="mt-1">
                Live sprint presentation scheduled for November 21, 2026 at the GeNarrative Clash.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="site-footer mt-16">
        <Link to="/" className="wordmark wordmark-light">
          <span className="brand-mark">
            <LockKeyhole size={15} />
          </span>
          <span>
            BriefLock <b>Studio</b>
          </span>
        </Link>
        <span>MAKE ROOM FOR WHAT&apos;S NEXT. PROTECT WHAT MATTERS.</span>
        <span className="font-mono text-[8px]">
          VISUAL ART &amp; DESIGN ASSIST • GENARRATIVE CLASH 2026
        </span>
      </footer>
    </div>
  );
}
