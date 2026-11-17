# BriefLock Studio — 50% Foundation

> **Track:** Visual Art & Design Assist | **Event:** GeNarrative Clash 2026  
> **Tagline:** _Change what you want. Protect what matters._

BriefLock Studio is a constraint-aware vector poster editor. Designers and creators can protect brand elements (logos, dates, brand colors, essential vector marks) with immutable contract locks, while keeping flexible elements open for manual modification now and AI-assisted generative edits in the live sprint.

---

## 🎨 Design Philosophy & Theme

- **Warm Creamy Paper & Rich Ink Black**: The entire site (navigation, hero section, story workflow, design contract, and footer) embraces warm parchment cream (`#FAF7F2` / `oklch(0.966 0.012 84)`) and rich ink-black typography (`#1A1918` / `oklch(0.19 0.015 55)`).
- **Fluent Burnt Orange Glow**: Burnt orange (`#EA580C` / `oklch(0.59 0.16 43)`) is purposefully applied as an accent glow effect—radiating from the hand-drawn headline underline flourishes, layered 3D card accents, glowing pill badges, and active state rings—without overwhelming text content.
- **Sleek Dark Creator Working Space**: Only the working studio editor window (`#workspace`) features a professional, high-contrast dark charcoal / blackish interface (`oklch(0.16 0.012 55)`), providing a focused canvas environment with real-time vector rendering and inspector controls.

---

## 🚀 Pre-Event Functional MVP (50% Scope)

This submission demonstrates the functional, non-AI foundation of BriefLock Studio:

1. **Responsive Artboard & Document Model**: Fixed 600×800 SVG poster canvas representing the _NOVA Creative Summit 2026_ with 7 independently addressable layers (Brand Mark, Event Category, Main Headline, Subtitle, Date & Location, Geometric Sun, Teal Orbit Arc).
2. **Synchronized Selection**: Click-to-select directly on the SVG poster canvas or in the left Layers sidebar, featuring burnt-orange corner bounding handles.
3. **Manual Property Editing**: Real-time inspector controls for unlocked elements—text content input, font size range slider (14px–80px), X/Y positioning, and four curated brand color swatches.
4. **Contract-Aware Locking**: Prominent lock/unlock toggle per layer. When locked, direct manual modification is strictly blocked with a clear "Protected by Design Contract" indicator.
5. **Local Persistence**: Automatic synchronization to `localStorage` (`brieflock_studio_poster_v2`) restoring document and lock states safely across page refreshes, plus a one-click "Reset Demo" button.
6. **Live Sprint Boundaries**: Clearly labeled, disabled placeholders for upcoming AI operations (`AI Edits — Live Sprint Nov 21`) with zero fake AI claims.

---

## 🔒 Reserved for November 21 Live Sprint (DO NOT IMPLEMENT PRE-EVENT)

Under GeNarrative Clash 2026 50/50 hackathon rules, the following capabilities are reserved for the live sprint:

- Server-side Gemini API invocation with prompt orchestration
- Structured JSON operational patch generation (`set_text`, `set_font_size`, `move`, `set_fill`)
- Constraint-aware validation engine rejecting modifications to locked layer IDs
- Generative repair and automated bounds/overlap checking
- Temporary diff comparison and human-in-the-loop accept/reject loop

---

## 🛠 Tech Stack

- **Framework**: React 19, TypeScript, TanStack Start & TanStack Router
- **Styling**: Tailwind CSS v4, custom OKLCH design tokens, Lucide React icons
- **Fonts**: Space Grotesk (display), Newsreader (editorial serif italic), DM Sans (body), DM Mono (code/labels)
- **Storage**: Browser `localStorage`

---

## 💻 Local Development

```sh
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```
