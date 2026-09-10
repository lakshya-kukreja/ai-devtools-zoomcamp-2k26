'use client';

/**
 * components/FilterBar.js
 *
 * Search & Quick Filters component for Placement & Internship Tracker (V1).
 * Satisfies BACKLOG.md TASK-07 and SPEC.md Section 5.2.
 *
 * Features:
 * - Keyword search input (case-insensitive match on companyName and roles)
 * - Quick filter dropdowns:
 *   - MSc Physics Eligibility: All, Eligible, Ineligible, Check Needed
 *   - Mode: All, On-Campus, Off-Campus
 *   - Status: All, Not Applied, Applied, OA / Test, Interview, Offered, Rejected
 *   - Chance: All, Green, Yellow, Red
 * - Reset Filters button to reset all controls to default All / empty search
 * - Visual filter status and result count
 */

export default function FilterBar({
  searchQuery = '',
  onSearchChange,
  eligibilityFilter = 'All',
  onEligibilityChange,
  modeFilter = 'All',
  onModeChange,
  statusFilter = 'All',
  onStatusChange,
  chanceFilter = 'All',
  onChanceChange,
  onReset,
  hasActiveFilters = false,
  filteredCount = 0,
  totalCount = 0,
}) {
  return (
    <section className="filter-bar-card" aria-label="Search and Quick Filters">
      <div className="filter-bar-header">
        
        <div className="filter-bar-title-group">
          <h2 className="filter-bar-title">
            <span className="filter-title-icon" aria-hidden="true">🔍</span>
            Search & Quick Filters
          </h2>
          {hasActiveFilters && (
            <span className="filter-active-pill">
              Filtered ({filteredCount} of {totalCount})
            </span>
          )}
        </div>

        <div className="filter-bar-actions">
          <button
            type="button"
            id="btn-reset-filters"
            className={`btn btn-reset-filters ${hasActiveFilters ? 'active' : ''}`}
            onClick={onReset}
            title="Reset all search and filter criteria to defaults"
            aria-label="Reset Filters"
          >
            <span aria-hidden="true">↺</span> Reset Filters
          </button>
        </div>
      </div>

      <div className="filter-controls-grid">
        {/* Keyword Search Input */}
        <div className="filter-group filter-group-search">
          <label htmlFor="filter-search" className="filter-label">
            Keyword Search
          </label>
          <div className="filter-search-wrapper">
            <span className="filter-search-icon" aria-hidden="true">🔎</span>
            <input
              id="filter-search"
              type="text"
              className="filter-search-input"
              placeholder="Search company name or roles..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              aria-label="Search company name or roles"
            />
            {searchQuery && (
              <button
                type="button"
                className="filter-search-clear"
                onClick={() => onSearchChange?.('')}
                title="Clear search query"
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MSc Physics Eligibility Filter */}
        <div className="filter-group">
          <label htmlFor="filter-eligibility" className="filter-label">
            MSc Physics Eligibility
          </label>
          <select
            id="filter-eligibility"
            className="filter-select"
            value={eligibilityFilter}
            onChange={(e) => onEligibilityChange?.(e.target.value)}
            aria-label="Filter by MSc Physics Eligibility"
          >
            <option value="All">All Eligibility</option>
            <option value="Eligible">Eligible</option>
            <option value="Ineligible">Ineligible</option>
            <option value="Check Needed">Check Needed</option>
          </select>
        </div>

        {/* Drive Mode Filter */}
        <div className="filter-group">
          <label htmlFor="filter-mode" className="filter-label">
            Drive Mode
          </label>
          <select
            id="filter-mode"
            className="filter-select"
            value={modeFilter}
            onChange={(e) => onModeChange?.(e.target.value)}
            aria-label="Filter by Mode"
          >
            <option value="All">All Modes</option>
            <option value="On-Campus">On-Campus</option>
            <option value="Off-Campus">Off-Campus</option>
          </select>
        </div>

        {/* Application Status Filter */}
        <div className="filter-group">
          <label htmlFor="filter-status" className="filter-label">
            Status
          </label>
          <select
            id="filter-status"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusChange?.(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Not Applied">Not Applied</option>
            <option value="Applied">Applied</option>
            <option value="OA / Test">OA / Test</option>
            <option value="Interview">Interview</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Recruitment Chance Filter */}
        <div className="filter-group">
          <label htmlFor="filter-chance" className="filter-label">
            Recruitment Chance
          </label>
          <select
            id="filter-chance"
            className="filter-select"
            value={chanceFilter}
            onChange={(e) => onChanceChange?.(e.target.value)}
            aria-label="Filter by Chance"
          >
            <option value="All">All Chances</option>
            <option value="Green">Green (High)</option>
            <option value="Yellow">Yellow (Moderate)</option>
            <option value="Red">Red (Reach)</option>
          </select>
        </div>
      </div>
    </section>
  );
}
