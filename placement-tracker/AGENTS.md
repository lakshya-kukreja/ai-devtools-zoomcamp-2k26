# AGENTS.md - AI Agent Operating Guidelines

This repository contains the **Placement & Internship Tracker (V1)**. All AI coding agents operating on this repository must strictly adhere to the following operating principles, technical constraints, and workflow requirements.

---

## 1. Project Purpose

A lightweight, single-page, spreadsheet-style personal web application built to track and organize placement (full-time) and internship opportunities. Specifically tailored for an MSc Physics student, it features:
- Two independent views: **Internships** (tracking Stipend & PPO terms) and **Placements** (tracking CTC).
- Degree eligibility verification for MSc Physics (`Eligible`, `Ineligible`, `Check Needed`).
- Manual recruitment chance estimation (`Green` / High, `Yellow` / Moderate, `Red` / Reach).
- Application stage tracking from `Not Applied` through `Offered` / `Rejected`.
- Real-time pipeline metrics and instant search/filtering.

---

## 2. Required Technology Stack

- **Framework**: Next.js (App Router).
- **Language**: JavaScript (`.js`, `.jsx` only — **NO TypeScript**).
- **Styling**: Plain CSS (`globals.css` and standard CSS files — **NO Tailwind CSS**).
- **Persistence**: Browser `localStorage` (client-side only; keys: `tracker_internships_v1` and `tracker_placements_v1`).
- **State Management**: Built-in React state (`useState`, `useEffect`, custom hooks — **NO external state stores**).

---

## 3. Explicit Technical Constraints

- **No Backend**: Zero server-side routes, handlers, or endpoints (`app/api/` or `pages/api/` are strictly forbidden).
- **No Database**: No ORMs, SQLite, Prisma, or cloud databases.
- **No Authentication**: No login, sessions, JWTs, or multi-user access (strictly personal local tool).
- **No Tailwind CSS**: Use vanilla CSS with variables for design tokens.
- **No Redux / Heavy State Libraries**: Use native React state and custom hooks.
- **No Unnecessary Dependencies**: Do not install UI component libraries (e.g., shadcn, MUI, Chakra) or utility libraries unless explicitly approved.
- **Hydration Safety**: Ensure all `localStorage` reads and window interactions are SSR-safe (e.g., checking `typeof window !== 'undefined'`) to prevent Next.js hydration mismatches.

---

## 4. Role of SPEC.md & BACKLOG.md

- **[SPEC.md](file:///home/asus/ai-devtools-zoomcamp/placement-tracker/SPEC.md)** is the **single source of truth for product requirements**:
  - Defines data schemas, field types, and allowed values (Section 4).
  - Specifies UI rules, badge color codes, and table behaviors (Section 6).
  - Explicitly states what is out of scope for V1 (Section 7).
- **[BACKLOG.md](file:///home/asus/ai-devtools-zoomcamp/placement-tracker/BACKLOG.md)** defines the **planned implementation tasks**:
  - Breaks implementation into sequential, discrete tasks (`TASK-01` through `TASK-09`).
  - Sets exact deliverables and acceptance criteria for each milestone.
- **Conflict Resolution**: If a question on functionality arises, `SPEC.md` governs behavior and `BACKLOG.md` governs task sequencing. Never invent requirements not found in these documents.

---

## 5. Implementation Workflow

When assigned a task:
1. **Identify the Task**: Focus solely on the single assigned task ID from `BACKLOG.md`.
2. **Review Context**: Read the relevant sections of `SPEC.md` and the acceptance criteria in `BACKLOG.md`.
3. **Execute Incrementally**: Write clean, readable JavaScript and plain CSS necessary to satisfy only that task.
4. **Keep Code Simple**: Write straightforward, self-explanatory code without over-abstraction or premature optimization.
5. **Update Status**: Only mark task checkboxes complete once verified against all acceptance criteria.

---

## 6. Verification Expectations

Before completing any task:
- **Build & Run Check**: Verify that the development server starts cleanly (`npm run dev`) with no build errors, syntax errors, or runtime console warnings.
- **Hydration Validation**: Ensure no SSR/client hydration warnings appear in the browser console.
- **Acceptance Criteria**: Manually or programmatically confirm every acceptance criterion listed for the task in `BACKLOG.md`.
- **Storage Integrity**: Confirm `localStorage` reads/writes operate correctly without corrupting data or bleeding across tabs.

---

## 7. Scope Discipline

- **Implement ONLY the Assigned Task**: Do not implement features or code belonging to future tasks in `BACKLOG.md`.
- **Zero Unspecified Features**: Do not add features outside `SPEC.md` (e.g., export/import, drag-and-drop, email alerts, or cloud sync).
- **No Mock/Seed Data in Storage**: Initialize `localStorage` with an empty array `[]`. Do not pre-fill dummy records.
- **No Application Code When Prompted for Planning/Documentation**: When asked to plan, document, or create instructions, do not implement application code.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
