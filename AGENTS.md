# BriefLock Studio — Workspace Rules for Antigravity

You are building the PRE-EVENT FOUNDATION of BriefLock Studio for GeNarrative Clash 2026. This repo is a React + TypeScript + Vite + Tailwind single-page SVG poster editor. Work incrementally. Prefer a polished and functional small app over a broad unfinished app.

## Non-negotiable scope

- Implement UI, vector document model, selection, manual edits, manual layer locks, local persistence, accessibility and responsive behavior only.
- Do **not** implement LLM API integration, inference, automatic AI patch generation, AI prompt orchestration, generative repair, contract-based AI edit validator, or AI proposal approval/rejection before the November 21 live sprint.
- Do not simulate an AI response and pretend it is real. Any placeholder must be clearly labeled as upcoming.
- Do not add backend, auth, PostgreSQL, Supabase, or complex import features without an explicit new user instruction.

## Coding principles

- TypeScript strict mode and small readable components.
- SVG scene elements are represented by serializable JSON with stable unique IDs; treat the original poster as data.
- A selected locked element must reject direct manual modification.
- Never use unsanitized HTML insertion or inject raw user-provided SVG content.
- User-visible actions must work. Preserve localStorage state with versioned keys and defensive JSON parsing.
- Desktop canvas + layers sidebar; mobile canvas + compact toolbar and bottom sheet for properties.
- Touch targets should be comfortable; keyboard selection/editing for accessible controls.
- No secret keys in frontend code or Git history.
- Keep commits distinct by milestone so pre-event code is auditable.
