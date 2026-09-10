# Placement & Internship Tracker (V1)

A lightweight, personal, spreadsheet-style dashboard web application designed to track and organize placement (full-time) and internship opportunities, tailored specifically for students navigating campus recruitment drives and off-campus applications.

---

## 📌 Project Overview

The **Placement & Internship Tracker** provides a centralized, distraction-free interface for managing recruitment pipelines. Built with a spreadsheet-first user experience, it features sticky table headers, color-coded status badges, real-time search and multi-criteria filtering, dynamic pipeline metrics, and zero-setup client-side persistence.

The application strictly separates **Internship** listings from **Full-Time Placement** drives to accommodate differing compensation models and recruitment requirements.

---

## 🎯 Why the Project Was Built

Job hunting and campus placements present specific challenges for specialized degrees such as an **MSc in Physics**:
- **Degree Eligibility Ambiguity**: Many job listings default to standard engineering/CS degrees, requiring students to explicitly verify and track whether an MSc in Physics is accepted (`Eligible`, `Ineligible`, or `Check Needed`).
- **Mixed Compensation Models**: Internships require tracking monthly stipends and PPO (Pre-Placement Offer) conversion terms, whereas full-time placements focus on annual CTC packages. Mixing them in a single generic spreadsheet creates clutter.
- **Odds & Effort Prioritization**: Students need an instant visual indicator of their personal admission likelihood (`Green` / High, `Yellow` / Moderate, `Red` / Reach) to budget preparation time effectively.
- **Scattered Deadlines**: Crucial application windows and Online Assessment (OA) dates often get lost across emails, WhatsApp groups, and unstructured notes.

This tracker solves these pain points by offering a single, focused, privacy-respecting dashboard built specifically around these workflows.

---

## ✨ Main V1 Features

### 1. Two-Tab Architecture
- **🎓 Internships View**: Dedicated tracking for internship opportunities. Displays **Stipend** and **PPO Information** columns; automatically omits full-time CTC.
- **💼 Placements View**: Dedicated tracking for full-time job drives. Displays **CTC (Annual Package)**; automatically omits internship-specific stipend/PPO fields.

### 2. MSc Physics Eligibility Tracking
- Explicit eligibility tagging for every entry:
  - `Eligible` (Emerald badge)
  - `Ineligible` (Muted red badge)
  - `Check Needed` (Amber badge)

### 3. Recruitment Probability (Chance Scoring)
- Manual odds assessment to guide application strategy:
  - `● Green (High)`: Strong probability / high confidence
  - `● Yellow (Moderate)`: 50-50 / moderate confidence
  - `● Red (Reach)`: High competition / reach target

### 4. Application Pipeline Stages
- Complete recruitment lifecycle tracking:
  - `Not Applied` → `Applied` → `OA / Test` → `Interview` → `Offered` → `Rejected`

### 5. Full CRUD Operations
- **Add Opportunity**: Modal dialog with dynamic tab-specific fields, client-side validation, and auto-focused inputs.
- **Edit Opportunity**: Pre-populated modal preserving record `id` and `createdAt` while updating `updatedAt`.
- **Delete Opportunity**: Deletion with a company-specific confirmation dialog to safeguard against accidental data loss.

### 6. Real-Time Search & Multi-Criteria Filtering
- **Keyword Search**: Instant case-insensitive filtering on company name and job roles.
- **Quick Filters**: Dedicated dropdown filters for Eligibility, Mode (`On-Campus` / `Off-Campus`), Status, and Chance.
- **Combined Logic**: Applies active search and selected dropdowns with logical `AND`.
- **Active Filter Counter & Reset**: Displays matched record counts and provides a single-click "Reset Filters" action.

### 7. Dynamic Pipeline Metrics Summary Bar
- Live metric cards at the top of each tab view, automatically recalculated from active tab data:
  1. **Total Tracked Companies**: Total entries in the current view.
  2. **MSc Physics Eligible**: Count of records marked `Eligible`.
  3. **High Chance (Green)**: Count of high-probability opportunities.
  4. **Active Applications**: Sum of opportunities currently in `Applied`, `OA / Test`, or `Interview` stages.
  5. **Offers Received**: Count of records reaching `Offered` status.

### 8. Spreadsheet Ergonomics & Edge-Case Handling
- **Sticky Table Headers**: Keeps column headers locked in view during vertical table scrolling.
- **Horizontal Scroll Protection**: Dense tabular layout scrollable on smaller viewports without breaking page layout.
- **Safe External Links**: Validates and sanitizes `careersUrl` links (`rel="noopener noreferrer"`, `target="_blank"`), blocking hazardous protocols (`javascript:`, `data:`).
- **Keyboard Navigation**: `Escape` key to dismiss modals, `Enter` to submit forms, and accessible focus trapping.

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Modern React 19 server/client architecture and Turbopack bundling |
| **Library** | [React 19](https://react.dev/) | Client-side reactive UI state (`useState`, `useMemo`, `useCallback`, `useEffect`) |
| **Language** | JavaScript (ES Modules, JSX) | Clean, standard JavaScript without TypeScript overhead |
| **Styling** | Plain CSS (`globals.css`) | Custom CSS design tokens, modern Inter/system font stack, zero Tailwind, zero external UI libraries |
| **Persistence** | Browser `localStorage` | Zero-setup, client-side persistence with isolated keys |

---

## 🚀 How to Install and Run Locally

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm**: v9+ (comes bundled with Node.js)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lakshya-kukreja/ai-devtools-zoomcamp-2k26.git
   cd ai-devtools-zoomcamp-2k26/placement-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

5. **Production Build & Start (Optional)**:
   To test the optimized production build:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Project Structure

```text
placement-tracker/
├── README.md                       # Project documentation
├── SPEC.md                         # V1 Product Specification (Single Source of Truth)
├── BACKLOG.md                      # Technical implementation backlog (TASK-01 to TASK-09)
├── AGENTS.md                       # AI Agent Operating Guidelines & architectural constraints
├── package.json                    # Project dependencies and npm scripts
├── next.config.mjs                 # Next.js configuration
├── app/
│   ├── layout.js                   # Root HTML layout and page metadata
│   ├── page.js                     # Main dashboard page (Tabs, Filter & CRUD orchestration)
│   └── globals.css                 # Plain CSS design tokens, badges, table & modal styles
├── components/
│   ├── TrackerTable.js             # Spreadsheet table with dynamic columns, badges, & actions
│   ├── OpportunityModal.js         # Add & Edit modal dialog with validation & focus trapping
│   ├── FilterBar.js                # Keyword search input and quick filter dropdowns
│   └── MetricsBar.js               # Dynamic KPI summary cards for pipeline metrics
├── hooks/
│   └── useTrackerStorage.js        # Custom React hook for reactive localStorage synchronization
└── lib/
    └── storage.js                  # Persistence layer, schema validation, and normalization
```

---

## 💾 Data Persistence & localStorage Behavior

The application runs entirely in the user's browser without requiring a remote database or account registration:

- **Isolated Storage Keys**:
  - `tracker_internships_v1` stores all internship records.
  - `tracker_placements_v1` stores all full-time placement records.
- **Zero Cross-Pollution**: Internships and Placements datasets are completely segregated. Adding, modifying, or deleting an entry in one tab never impacts the other.
- **Empty Initial State**: Fresh browser sessions start with empty arrays (`[]`). No dummy or mock records are injected.
- **Strict Schema Enforcement**: Records are validated and normalized on read/write. Tab-specific fields (`stipend`/`ppoInfo` vs. `ctc`) are strictly partitioned.
- **SSR & Hydration Safety**: All storage access guards against server-side rendering (`typeof window !== 'undefined'`) to prevent React hydration mismatches.
- **Multi-Tab Synchronization**: Subscribes to native window `storage` events and custom update events, keeping data synchronized across multiple browser tabs in real time.

> **Note**: Because data is stored in the browser's `localStorage`, data is tied to your specific browser profile. Clearing your browser cache/storage will erase tracked data.

---

## 🤖 AI-Native Development Workflow

This project was developed end-to-end using an **AI-native, specification-driven engineering methodology**:

1. **Specification as Single Source of Truth (`SPEC.md`)**:
   Before writing application code, a comprehensive product specification was drafted defining user personas, two-tab data schemas, allowed values, UI color palettes, and explicit out-of-scope boundaries.
2. **Sequential Technical Backlog (`BACKLOG.md`)**:
   The specification was decomposed into 9 sequential, self-contained implementation tasks (`TASK-01` through `TASK-09`), each equipped with explicit acceptance criteria.
3. **Strict Agent Operating Rules (`AGENTS.md`)**:
   AI coding agents were constrained by documented guardrails: no backend routes, no databases, no external CSS/UI component frameworks, zero TypeScript, hydration safety, and absolute scope discipline (never implementing ahead of the assigned task).
4. **Iterative Task Execution**:
   Each backlog milestone was implemented in sequence, verified against its acceptance criteria, and checked off upon confirmation.
5. **Rigorous V1 QA Audit**:
   Following `TASK-09`, an end-to-end QA verification verified all functional requirements, schema rules, edge cases, and production build cleanliness before releasing V1.

---

## ⚠️ V1 Limitations & Out-of-Scope Items

In adherence to the [SPEC.md](SPEC.md) scope boundaries, the following items are intentionally excluded from V1:
- **No JSON / CSV Export or Import**: Backup file export and import capabilities are deferred to future roadmap releases.
- **No Spreadsheet Cell Formulas**: Does not support mathematical cell formulas (e.g. `=SUM()`) or drag-to-fill cell behavior.
- **No File Uploads**: Resume, transcript, or offer letter PDF attachments are not supported.
- **No Automated Notifications**: No automated deadline reminders, email alerts, or calendar sync.
- **No Cloud Sync / Multi-User Auth**: Intentionally designed as a private, single-user client tool with zero cloud backend.
- **Device-Local Storage**: Data does not sync across different browsers or devices.
