<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.

<!-- LOVABLE:END -->

- Keep the BriefLock opening and its homepage in one scrollable route so Start reveals the real site without a route change.

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
