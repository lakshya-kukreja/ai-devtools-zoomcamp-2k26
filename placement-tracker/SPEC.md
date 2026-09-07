# Placement & Internship Tracker - Product Specification (V1)

## 1. Overview
A lightweight, personal, spreadsheet-style web application designed to track and organize placement (full-time) and internship opportunities, with specific support for MSc Physics eligibility criteria, manual probability scoring, and recruitment pipeline stages.

---

## 2. Target User & Use Case
* **User Profile**: MSc Physics student actively preparing for campus drives and off-campus opportunities.
* **Core Problem**: Juggling multiple company deadlines, verifying whether MSc Physics degrees are eligible for technical/analytical roles, monitoring PPO conversions, and tracking odds of selection across disparate spreadsheets.
* **Key Value**: A single dashboard that separates Internships from Placements, highlights eligibility instantly, and tracks personal admission likelihood (Green/Yellow/Red).

---

## 3. Scope & Views

### 3.1 Two-Tab Architecture
The application features two independent views:
1. **Internships View**: Tracks internship opportunities. Includes separate dedicated fields for **Stipend** and **PPO Information** (omits full-time CTC).
2. **Placements View**: Tracks full-time placement/job drives. Includes **CTC** (omits internship-specific Stipend and PPO fields).

---

## 4. Data Specification & Fields

| Field Name | Type | Allowed Values / Format | Description | Visibility |
|---|---|---|---|---|
| `id` | String | Unique ID / Timestamp | System identifier for CRUD operations | Internal |
| `companyName` | String | Text | Name of the hiring organization | Both tabs |
| `deadline` | String / Date | YYYY-MM-DD or text (e.g. "Rolling") | Application or registration deadline | Both tabs |
| `mode` | String | `On-Campus` \| `Off-Campus` | Drive type | Both tabs |
| `mscPhysicsEligibility` | String | `Eligible` \| `Ineligible` \| `Check Needed` | Degree eligibility flag with distinct color-coding | Both tabs |
| `roles` | String | Text (e.g., "Data Analyst, Quant Dev") | Job/Intern roles offered | Both tabs |
| `stipend` | String | Text (e.g., "₹45,000/month") | Internship monthly stipend / remuneration | **Internships Only** |
| `ppoInfo` | String | Text (e.g., "PPO on performance / 16 LPA conversion") | Pre-placement offer terms & conversion criteria | **Internships Only** |
| `ctc` | String | Text (e.g., "14 LPA") | Full-time annual compensation package | **Placements Only** |
| `companyScale` | String | `MNC` \| `Startup` \| `Small Company` | Company tier/category | Both tabs |
| `careersUrl` | String | Valid URL | Link to official careers or application portal | Both tabs |
| `chance` | String | `Green` (High) \| `Yellow` (Moderate) \| `Red` (Reach) | Manual assessment of personal odds | Both tabs |
| `status` | String | `Not Applied` \| `Applied` \| `OA / Test` \| `Interview` \| `Offered` \| `Rejected` | Application pipeline stage | Both tabs |
| `createdAt` | ISO String | Timestamp | Date added | Internal |
| `updatedAt` | ISO String | Timestamp | Last modified date | Internal |

---

## 5. Functional Requirements

### 5.1 CRUD Operations
* **Add Entry**: Open an "Add Opportunity" modal. Submitting the form validates required fields and appends the entry to the current tab.
* **Edit Entry**: Clicking the Edit button on any row opens a pre-populated modal allowing the user to update fields (e.g., advancing status from `Applied` to `OA / Test`, or updating chance from `Yellow` to `Green`).
* **Delete Entry**: Click to delete a record with a quick confirmation prompt to prevent accidental data loss.

### 5.2 Filters & Search
* **Search Bar**: Instant keyword search matching Company Name and Roles.
* **Quick Filters**:
  * MSc Physics Eligibility filter (`All`, `Eligible`, `Ineligible`, `Check Needed`).
  * Mode filter (`All`, `On-Campus`, `Off-Campus`).
  * Status filter (`All`, `Not Applied`, `Applied`, `OA / Test`, `Interview`, `Offered`, `Rejected`).
  * Chance filter (`All`, `Green`, `Yellow`, `Red`).

### 5.3 Metrics Summary Bar
Dynamic metric cards at the top of each view summarizing:
* Total Tracked Companies
* MSc Physics Eligible count
* High Chance (Green) count
* Active Applications (Applied / OA / Interview)
* Offers Received

### 5.4 Data Persistence
* **Local Storage**: All data automatically saves to browser `localStorage` under isolated keys (`tracker_internships_v1`, `tracker_placements_v1`), ensuring zero-setup, immediate persistence across browser sessions.

---

## 6. UI & Design System

* **Spreadsheet Feel**:
  * Dense, readable tabular layout with sticky table headers.
  * Subtle borders, clean cell padding, and alternating row contrasts.
  * Direct action buttons (Edit, Delete, Visit Link) pinned to each row.
* **Color Hierarchy**:
  * **Chances**:
    * Green: `#10b981` (High probability)
    * Yellow: `#f59e0b` (Moderate / 50-50)
    * Red: `#ef4444` (Reach / Tough odds)
  * **Eligibility**:
    * Eligible: High-contrast green/emerald badge
    * Ineligible: Muted red badge
    * Check Needed: Warning amber badge
  * **Mode**:
    * On-Campus: Indigo pill
    * Off-Campus: Slate pill
* **Typography**: Clean sans-serif font (Inter / system modern stack) for maximum numerical and text legibility.

---

## 7. Out of Scope for V1 (Future Roadmap)
* JSON file export and import backup functionality (deferred beyond V1).
* Complex spreadsheet cell formulas (e.g. `=SUM()`, drag-to-fill formulas).
* Resume/PDF attachment uploads.
* Automated deadline email/calendar notifications.
* Multi-user cloud authentication (designed strictly for single-user personal privacy).
