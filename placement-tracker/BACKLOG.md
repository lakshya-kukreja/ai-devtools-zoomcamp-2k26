# Implementation Backlog: Placement & Internship Tracker (V1)

**Specification Reference**: [SPEC.md](file:///home/asus/ai-devtools-zoomcamp/placement-tracker/SPEC.md)  
**Architecture & Tech Stack**: 
- **Framework**: Next.js (App Router)
- **Language**: JavaScript (JSX, no TypeScript)
- **Styling**: Plain CSS (`globals.css`, no Tailwind)
- **Persistence**: Browser `localStorage` (client-side only, isolated keys)
- **Strict Constraints**: 
  - NO backend/API routes
  - NO database
  - NO authentication
  - NO Redux or external state management libraries (plain React `useState` / custom hooks)
  - NO Tailwind CSS
  - NO unnecessary third-party dependencies

---

## Backlog Overview & Implementation Order

| Task ID | Task Title | Primary Focus |
|---|---|---|
| [TASK-01](#task-01-project-setup--base-nextjs-layout-shell) | Project Setup & Base Next.js Layout Shell | Next.js App Router setup, JavaScript, plain CSS design tokens, layout shell |
| [TASK-02](#task-02-client-storage-layer--localstorage-hook) | Client Storage Layer & LocalStorage Hook | Client-side `localStorage` manager, isolated keys, schema, empty initial state |
| [TASK-03](#task-03-tab-navigation--spreadsheet-table-component) | Tab Navigation & Spreadsheet Table Component | Tab switcher, tabular layout, conditional columns (`Stipend`/`PPO` vs `CTC`), badges |
| [TASK-04](#task-04-add-opportunity-modal--validation) | Add Opportunity Modal & Validation | Modal UI, dynamic tab fields, form validation, record creation |
| [TASK-05](#task-05-edit-opportunity-modal) | Edit Opportunity Modal | Row edit trigger, pre-populated form, update logic |
| [TASK-06](#task-06-delete-opportunity-with-confirmation) | Delete Opportunity with Confirmation | Row delete trigger, confirmation prompt, record removal |
| [TASK-07](#task-07-search--quick-filters) | Search & Quick Filters | Real-time text search, multi-criteria dropdown filters |
| [TASK-08](#task-08-dynamic-metrics-summary-bar) | Dynamic Metrics Summary Bar | 5 summary metric cards, real-time reactive calculation |
| [TASK-09](#task-09-ui-polish-spreadsheet-ergonomics--edge-cases) | UI Polish, Spreadsheet Ergonomics & Edge Cases | Sticky headers, link safety, keyboard shortcuts, empty states |

---

## Detailed Task Breakdown

### TASK-01: Project Setup & Base Next.js Layout Shell

- **Task ID**: `TASK-01`
- **Goal**: Scaffold the Next.js project using App Router and JavaScript, establish the root layout, configure plain CSS styling, and create the basic page shell.
- **What needs to be implemented**:
  - Initialize Next.js project in workspace using App Router and JavaScript (no TypeScript, no Tailwind).
  - Directory structure:
    - `app/layout.js`: Root layout with document metadata (title: "Placement & Internship Tracker", meta tags).
    - `app/page.js`: Client component entry (`'use client'`) rendering header, tab switcher, and layout containers.
    - `app/globals.css`: Plain CSS design system and resets:
      - Clean modern sans-serif typography stack (Inter / system modern font).
      - CSS custom properties (variables) for color hierarchy defined in SPEC:
        - Chance: Green (`#10b981`), Yellow (`#f59e0b`), Red (`#ef4444`).
        - Eligibility badges: Eligible (emerald/green), Ineligible (muted red), Check Needed (amber).
        - Mode pills: On-Campus (indigo), Off-Campus (slate).
        - Spreadsheet table styling: compact rows, subtle borders, alternating zebra striping.
  - Ensure zero backend routes or API folders are generated.
- **Acceptance Criteria**:
  - [x] `npm run dev` starts the development server cleanly without build errors or hydration warnings.
  - [x] Opening the browser displays the application header, tab navigation switcher, and styled placeholder sections.
  - [x] Plain CSS defines all required tokens matching SPEC.md Section 6.
  - [x] Project contains only JavaScript (`.js`, `.jsx`), plain CSS, and no Tailwind or external component libraries.

---

### TASK-02: Client Storage Layer & LocalStorage Hook

- **Task ID**: `TASK-02`
- **Goal**: Implement a client-side `localStorage` utility and React hook with isolated keys, strict schema adherence, and an empty initial state.
- **What needs to be implemented**:
  - Client-side storage manager/hook (e.g. `lib/storage.js` or `hooks/useTrackerStorage.js`):
    - Target keys: `tracker_internships_v1` and `tracker_placements_v1`.
    - SSR-safe checks (`typeof window !== 'undefined'`) to prevent Next.js hydration mismatches.
    - **Empty initial state**: If no data exists in `localStorage`, initialize with an empty array `[]` (no seed/mock data).
    - Functions: `getItems(tab)`, `saveItems(tab, items)`, `generateId()`.
    - ID generation using `crypto.randomUUID()` (with timestamp fallback).
  - Data schema validation matching SPEC.md Section 4:
    - Common fields: `id`, `companyName`, `deadline`, `mode`, `mscPhysicsEligibility`, `roles`, `companyScale`, `careersUrl`, `chance`, `status`, `createdAt`, `updatedAt`.
    - Internships specific: `stipend`, `ppoInfo`.
    - Placements specific: `ctc`.
- **Acceptance Criteria**:
  - [x] Initial launch in a clean browser starts with empty lists `[]` for both tabs.
  - [x] `getItems('internships')` and `getItems('placements')` read from their respective isolated keys without data bleed.
  - [x] Record structure conforms strictly to SPEC.md Section 4 fields.
  - [x] Storage operations do not cause SSR hydration mismatch errors.

---

### TASK-03: Tab Navigation & Spreadsheet Table Component

- **Task ID**: `TASK-03`
- **Goal**: Render the spreadsheet-style data table with active tab switching and conditional columns (Stipend & PPO for Internships, CTC for Placements).
- **What needs to be implemented**:
  - React state for active tab (`'internships'` vs. `'placements'`).
  - Tab navigation bar allowing user to switch views.
  - Spreadsheet table component (`components/TrackerTable.js`) with plain CSS:
    - Sticky table header.
    - Dense tabular rows with subtle borders, cell padding, and alternating row contrast.
    - Common columns: Company Name, Deadline, Mode (styled pill), MSc Physics Eligibility (color-coded badge), Roles, Company Scale, Careers URL (clickable link), Chance (color-coded badge), Status (stage badge), Actions (Edit, Delete).
    - **Conditional columns**:
      - If active tab is `internships`: render `Stipend` and `PPO Info` columns; omit `CTC`.
      - If active tab is `placements`: render `CTC` column; omit `Stipend` and `PPO Info`.
    - Badges styled via plain CSS classes matching SPEC.md Section 6.
    - Clean empty state placeholder when the active tab has 0 records.
- **Acceptance Criteria**:
  - [ ] Toggling between "Internships" and "Placements" switches the active view without page reload.
  - [ ] `Stipend` and `PPO Info` columns render ONLY on the Internships tab.
  - [ ] `CTC` column renders ONLY on the Placements tab.
  - [ ] Badges for Chance (`Green`, `Yellow`, `Red`), Eligibility, and Mode render with correct plain CSS classes and colors.
  - [ ] Empty state message displays cleanly when no opportunities are present.

---

### TASK-04: Add Opportunity Modal & Validation

- **Task ID**: `TASK-04`
- **Goal**: Implement an "Add Opportunity" modal form using React state and plain CSS to validate and append new records to `localStorage`.
- **What needs to be implemented**:
  - "Add Opportunity" trigger button positioned above the table.
  - Modal dialog component (`components/OpportunityModal.js`) with plain CSS backdrop and window.
  - Form state (using plain React `useState`):
    - Common fields: Company Name (text, required), Deadline (date/text), Mode (`On-Campus`, `Off-Campus`), MSc Physics Eligibility (`Eligible`, `Ineligible`, `Check Needed`), Roles (text), Company Scale (`MNC`, `Startup`, `Small Company`), Careers URL (url), Chance (`Green`, `Yellow`, `Red`), Status (`Not Applied`, `Applied`, `OA / Test`, `Interview`, `Offered`, `Rejected`).
    - Tab-conditional inputs:
      - Internships: `stipend`, `ppoInfo`.
      - Placements: `ctc`.
  - Client-side validation ensuring Company Name is not empty.
  - Submission handler:
    - Generate unique `id`, `createdAt`, `updatedAt` timestamps.
    - Append record to current tab's `localStorage` data and update React state.
    - Close modal and reset form.
  - Modal dismiss: close on Cancel button, backdrop click, or Escape key.
- **Acceptance Criteria**:
  - [x] Clicking "Add Opportunity" opens the modal with fields dynamically matching the current tab.
  - [x] Submitting valid data appends the record to `localStorage` and updates table view immediately.
  - [x] Submitting without a Company Name highlights the field with an error message and stops submission.
  - [x] Created records contain valid `id`, `createdAt`, and `updatedAt` timestamps.

---

### TASK-05: Edit Opportunity Modal

- **Task ID**: `TASK-05`
- **Goal**: Enable editing existing opportunities through the modal dialog, pre-populating current values and saving updates.
- **What needs to be implemented**:
  - "Edit" action button in each table row.
  - Pass the selected opportunity record into modal state for editing.
  - Pre-populate all form inputs with existing values.
  - Modal header indicates edit mode (e.g. "Edit Opportunity - [Company Name]").
  - Submission handler:
    - Update modified fields while preserving original `id` and `createdAt`.
    - Update `updatedAt` timestamp to current ISO string.
    - Save updated array to `localStorage` and update React state.
    - Close modal.
- **Acceptance Criteria**:
  - [x] Clicking "Edit" opens the modal pre-filled with the selected opportunity's exact data.
  - [x] Modifying values (e.g. advancing Status from `Applied` to `OA / Test` or changing Chance) updates `localStorage` and UI immediately.
  - [x] `id` and `createdAt` remain intact; `updatedAt` is updated.
  - [x] Closing the modal without saving discards changes.

---

### TASK-06: Delete Opportunity with Confirmation

- **Task ID**: `TASK-06`
- **Goal**: Allow deleting an opportunity from the active tab with a confirmation step to prevent accidental data loss.
- **What needs to be implemented**:
  - "Delete" action button on each table row.
  - Confirmation prompt displaying the company name (e.g., "Delete [Company Name]? This action cannot be undone.").
  - Deletion handler:
    - Remove record by `id` from active tab dataset.
    - Save updated list to `localStorage` and update React state.
  - Cancellation handler:
    - If user cancels, leave data unchanged.
- **Acceptance Criteria**:
  - [x] Clicking "Delete" triggers a confirmation prompt referencing the specific company name.
  - [x] Confirming deletion removes the entry from `localStorage` and the UI table.
  - [x] Canceling deletion keeps the record intact in storage and UI.

---

### TASK-07: Search & Quick Filters

- **Task ID**: `TASK-07`
- **Goal**: Implement instant keyword search and multi-criteria quick filters to browse opportunities efficiently.
- **What needs to be implemented**:
  - Filter bar component (`components/FilterBar.js`) with plain CSS:
    - Keyword search input: case-insensitive match on `companyName` and `roles`.
    - Quick filter dropdowns:
      - MSc Physics Eligibility: `All`, `Eligible`, `Ineligible`, `Check Needed`.
      - Mode: `All`, `On-Campus`, `Off-Campus`.
      - Status: `All`, `Not Applied`, `Applied`, `OA / Test`, `Interview`, `Offered`, `Rejected`.
      - Chance: `All`, `Green`, `Yellow`, `Red`.
    - "Reset Filters" button to reset all controls to default `All` / empty search.
  - Filter logic in React:
    - Combine active search query and dropdown selections with logical AND.
    - Filtered results passed directly to table component.
    - Display "No opportunities match your current filters" when 0 rows match.
- **Acceptance Criteria**:
  - [x] Typing in search bar instantly filters rows matching Company Name or Roles.
  - [x] Selecting an Eligibility option filters exclusively for matching rows.
  - [x] Combining multiple filters applies all conditions simultaneously.
  - [x] "Reset Filters" restores table to show all records for the active tab.

---

### TASK-08: Dynamic Metrics Summary Bar

- **Task ID**: `TASK-08`
- **Goal**: Implement dynamic metric cards at the top of each view summarizing key recruitment pipeline statistics.
- **What needs to be implemented**:
  - Metric bar component (`components/MetricsBar.js`) with plain CSS:
    1. **Total Tracked Companies**: count of total records in active tab.
    2. **MSc Physics Eligible**: count of records where `mscPhysicsEligibility === 'Eligible'`.
    3. **High Chance (Green)**: count of records where `chance === 'Green'`.
    4. **Active Applications**: count of records where `status` is one of `Applied`, `OA / Test`, or `Interview`.
    5. **Offers Received**: count of records where `status === 'Offered'`.
  - Derived calculations in React: auto-computed from active tab data.
  - Real-time updates on tab switch, add, edit, or delete.
- **Acceptance Criteria**:
  - [ ] All 5 metric cards display accurate counts corresponding to the active tab's data.
  - [ ] Switching tabs immediately recalculates and updates the cards for the new tab.
  - [ ] Any CRUD action immediately updates the metrics bar.

---

### TASK-09: UI Polish, Spreadsheet Ergonomics & Edge Cases

- **Task ID**: `TASK-09`
- **Goal**: Refine table ergonomics, sticky headers, badge contrast, mobile/horizontal scroll handling, and keyboard accessibility.
- **What needs to be implemented**:
  - Plain CSS sticky table headers (`position: sticky; top: 0; z-index: ...`) with opaque background.
  - Horizontal scrolling container (`overflow-x: auto`) for dense columns without breaking page layout.
  - Safe external link handling: ensure all `careersUrl` links include valid protocol (`http://` or `https://`) and `rel="noopener noreferrer" target="_blank"`.
  - Long text handling: ellipsis or truncation with full text visible on hover via `title` attribute.
  - Keyboard ergonomics:
    - `Esc` key closes open modal.
    - `Enter` inside form submits.
- **Acceptance Criteria**:
  - [x] Table headers remain locked at top during vertical scrolling.
  - [x] Table handles dense content with smooth horizontal scroll and clear cell borders.
  - [x] External links open safely in a new tab (`rel="noopener noreferrer"`).
  - [x] Modal dialog closes on `Esc` key press and supports keyboard navigation.
  - [x] Entire interface delivers a polished spreadsheet feel matching SPEC.md Section 6.
