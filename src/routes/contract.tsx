import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Eye, LockKeyhole, Move, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/contract")({
  head: () => ({
    meta: [
      { title: "Design Contract — BriefLock Studio" },
      {
        name: "description",
        content:
          "The Design Contract: Decide what stays put and what can move. Protect brand integrity while keeping creative expression open.",
      },
    ],
  }),
  component: ContractPage,
});

function ContractPage() {
  return (
    <div className="homepage min-h-screen bg-[var(--paper)] text-[var(--ink-paper)]">
      <SiteNav />

      <main className="contract-page-container mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center gap-2 font-mono text-[9px] text-stone-500 uppercase tracking-widest">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-burnt-orange">
            <ArrowLeft size={11} /> BriefLock Studio
          </Link>
          <span>/</span>
          <span className="text-burnt-orange font-semibold">Design Contract</span>
        </div>

        {/* 4. Design Contract Section */}
        <section className="contract-section">
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
            <Link
              to="/editor"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-burnt-orange px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-md transition-all hover:bg-stone-900"
            >
              Open Studio Editor <ArrowUpRight size={14} />
            </Link>
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

        {/* Detailed Contract Rules Grid */}
        <section className="mt-16 border-t border-stone-300/40 pt-12">
          <div className="mb-8">
            <span className="eyebrow">CONTRACT MECHANICS</span>
            <h3 className="font-display text-2xl font-bold text-stone-900">
              How the Constraint Engine Protects Your Work
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-stone-200/80 bg-white/70 p-6 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-burnt-orange/15 text-burnt-orange">
                <LockKeyhole size={16} />
              </div>
              <h4 className="mt-4 font-display text-base font-bold text-stone-900">
                Immutable Brand Anchors
              </h4>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-stone-600">
                Logos, sponsor wordmarks, and key geometric symbols can be flagged as immutable.
                Direct edits are blocked to ensure brand identity remains untarnished.
              </p>
              <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-emerald-700">
                <Check size={12} /> Strict Contract Guard
              </div>
            </div>

            <div className="rounded-xl border border-stone-200/80 bg-white/70 p-6 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-stone-100">
                <Move size={16} />
              </div>
              <h4 className="mt-4 font-display text-base font-bold text-stone-900">
                Spatial Coordinate Bounds
              </h4>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-stone-600">
                Maintain visual hierarchy. Guarded elements retain fixed anchor coordinates on the
                SVG artboard so layouts don&apos;t shift during manual or AI alterations.
              </p>
              <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-emerald-700">
                <Check size={12} /> Bounding Box Locking
              </div>
            </div>

            <div className="rounded-xl border border-stone-200/80 bg-white/70 p-6 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-burnt-orange text-white">
                <Sparkles size={16} />
              </div>
              <h4 className="mt-4 font-display text-base font-bold text-stone-900">
                Fluid Expression Layers
              </h4>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-stone-600">
                Flexible headlines, background orbs, accent pillars, and experimental swatches
                remain fully editable for boundless creative iterations.
              </p>
              <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-burnt-orange">
                <Sparkles size={12} /> Fully Editable
              </div>
            </div>
          </div>
        </section>
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
