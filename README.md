# BriefLock Studio 🔒

### _Constraint-Aware Vector Design Assist_

> **Track:** Visual Art & Design Assist | **Event:** GeNarrative Clash 2026 (50% Pre-Event Foundation)  
> **Tagline:** _Make room for what’s next. Protect what matters._

---

## 💡 The Problem

Over the last two years, generative AI has transformed creative brainstorming. However, deploying generative visual models into professional production workflows exposes a major vulnerability: **Generative AI lacks deterministic discipline**.

- When prompted to adjust a headline or explore layout variations, models frequently distort corporate logos.
- Event dates, legal disclaimers, and partner branding marks are altered or hallucinated.
- Strictly governed color systems and brand guidelines get lost in probabilistic generation.

**In production design, creativity cannot come at the expense of brand integrity.**

---

## ⚡ The Solution: BriefLock Studio & Design Contracts

**BriefLock Studio** bridges creative generative freedom with deterministic brand rules through **Design Contracts**.

Instead of treating a poster as an unstructured flat image, BriefLock models artwork as an addressable, layer-based vector document. Creators declare an **Immutable Contract Guard** on mission-critical elements:

- **Guarded Layers** (Logos, dates, regulated marks): Strictly frozen against manual tampering and generative model hallucinations.
- **Flexible Layers** (Headlines, geometric accents, background art): Fully open for fluid modification and future AI-assisted iteration.

---

## 🎨 Design System & Aesthetic

- **Cream Parchment Paper (`#FAF7F2`)**: Warm, tactile editorial atmosphere reflecting physical print craft.
- **Rich Ink Black (`#1A1918`)**: Deep typographic contrast grounded in classical press tradition.
- **Burnt Orange Glow (`#EA580C`)**: Used with surgical precision for active state boundaries, 3D card edges, and contract lock alerts.
- **Focused Charcoal Workspace (`oklch(0.14 0.012 55)`)**: The studio editor window provides a sleek, low-distraction dark studio environment for precision vector work.

---

## 🚀 Pre-Event Functional MVP (50% Foundation Scope)

Built strictly in compliance with the **GeNarrative Clash 50/50 Hackathon Rules**, this submission delivers the complete client-side vector engine and contract enforcement architecture:

1. **Full-Viewport Studio Workspace (`/editor`)**:
   - Zero outer page scrolling and no browser zooming required.
   - Auto-fitting, responsive 600×800 SVG vector artboard with generous canvas breathing margins.
2. **Direct Canvas Drag & Drop Manipulation**:
   - Unlocked vector elements can be clicked and dragged smoothly across the canvas with real-time coordinate updates.
3. **Immutable Contract Guard**:
   - Guarded elements (such as the NOVA wordmark and summit date) actively reject manual drag or property alteration.
   - Interactive attempt triggers the floating **`IMMUTABLE CONTRACT GUARD`** badge directly over the element.
4. **Synchronized Layer Hierarchy**:
   - Two-way selection synchronization between the SVG artboard and the left layers panel.
   - Visibility toggles (`Eye` / `EyeOff`), z-index reordering (`Up` / `Down`), and 1-click contract locking (`LockKeyhole`).
   - Dynamic "+ Text" and "+ Shape" layer generation.
5. **Real-Time Properties Inspector**:
   - **Typography**: Live text content editing, font size slider (10px–84px), font family selector (`Space Grotesk`, `Playfair Display`, `JetBrains Mono`, `Inter`), font weight toggles (`400`, `500`, `700`, `800`), and letter spacing.
   - **Geometry**: Circle radius stepper, rectangle width/height inputs, and corner radius (`rx`) controls.
   - **Styling**: Opacity slider (10%–100%), curated brand swatches, and native HTML5 color picker for custom hex values.
6. **State Persistence & History**:
   - Interactive Undo/Redo stack with keyboard shortcuts (`Ctrl+Z` / `Cmd+Z`, `Ctrl+Y` / `Cmd+Shift+Z`).
   - Automatic synchronization to browser `localStorage` (`brieflock_studio_poster_v2`) restoring document and lock states across page refreshes.
   - "Reset Demo" button to restore initial sample state.
7. **Production Vector Export**:
   - Clean, client-side SVG download (`nova_summit_poster_2026.svg`) and 1-click SVG markup clipboard copy.

---

## 🔒 Reserved for November 21 Live Sprint

To honor the event's 50/50 integrity, all backend and AI orchestration code is intentionally excluded from this pre-event foundation:

- **AI Generative Edit Planner**: Multimodal LLM prompt orchestration interpreting natural language creative briefs.
- **Deterministic Contract Validation Engine**: Server-side validator verifying proposed AI JSON patches against protected layer IDs before rendering.
- **Generative Repair & Overlap Resolution**: Automated bounding box collision prevention.
- **Diff Comparison & Human Approval**: Side-by-side proposal review allowing the designer to accept or reject AI patches.

---

## 🛠 Tech Stack

- **Core**: React 19, TypeScript (Strict Mode)
- **Routing**: TanStack Router (File-based routes: `/`, `/editor`, `/contract`, `/roadmap`)
- **Styling**: Tailwind CSS v4, OKLCH Color Space, Lucide React Icons
- **Typography**: Space Grotesk, Playfair Display, JetBrains Mono, Inter
- **State & Persistence**: Browser `localStorage`, in-memory history stack

---

## 💻 Getting Started Locally

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/abhradhibar07-jdk/brieflock.git

# Enter project directory
cd brieflock

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

Open **`http://localhost:8080/`** to explore the landing gate, or navigate directly to **`http://localhost:8080/editor`** for the studio workspace.

### Verification & Testing

```bash
# Typecheck
npx tsc --noEmit

# Lint check
npm run lint

# Run route test suite
npm run test

# Build production bundle (Client + SSR + Nitro)
npm run build
```

---

## 📄 License

MIT © 2026 BriefLock Studio Team. GeNarrative Clash 2026 Submission.
