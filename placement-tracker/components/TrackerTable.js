'use client';

/**
 * components/TrackerTable.js
 *
 * Spreadsheet-style tabular data table component for Placement & Internship Tracker (V1).
 * Satisfies BACKLOG.md TASK-03 and SPEC.md Sections 4 & 6.
 *
 * Features:
 * - Tabular layout with sticky headers, subtle borders, and zebra striping
 * - Dynamic columns based on active tab:
 *   - Internships: renders "Stipend" and "PPO Info" columns, omits "CTC"
 *   - Placements: renders "CTC" column, omits "Stipend" and "PPO Info"
 * - Color-coded badges for Chance, MSc Physics Eligibility, Drive Mode, and Pipeline Status
 * - Safe external link rendering for Careers URLs (noopener, noreferrer)
 * - Clean empty state placeholder when 0 records are present
 * - Row action triggers for Edit and Delete
 */

/**
 * Safely format an external URL, preventing javascript:/data: protocol injection
 * and ensuring standard https:// or http:// protocol with noopener/noreferrer.
 *
 * @param {string} rawUrl
 * @returns {string|null}
 */
export function sanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return null;

  // Disallow potentially dangerous protocols
  if (/^(javascript:|data:|vbscript:|file:)/i.test(trimmed)) {
    return null;
  }

  // Prepend https:// if protocol is missing
  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the CSS class for a given Recruitment Chance value.
 * @param {string} chance
 * @returns {string}
 */
export function getChanceBadgeClass(chance) {
  switch (chance) {
    case 'Green':
      return 'badge-chance-green';
    case 'Yellow':
      return 'badge-chance-yellow';
    case 'Red':
      return 'badge-chance-red';
    default:
      return 'badge-chance-yellow';
  }
}

/**
 * Formats the Chance label with dot and probability tier.
 * @param {string} chance
 * @returns {string}
 */
export function getChanceBadgeLabel(chance) {
  switch (chance) {
    case 'Green':
      return '● Green (High)';
    case 'Yellow':
      return '● Yellow (Moderate)';
    case 'Red':
      return '● Red (Reach)';
    default:
      return chance || '—';
  }
}

/**
 * Returns the CSS class for MSc Physics Eligibility.
 * @param {string} eligibility
 * @returns {string}
 */
export function getEligibilityBadgeClass(eligibility) {
  switch (eligibility) {
    case 'Eligible':
      return 'badge-eligible';
    case 'Ineligible':
      return 'badge-ineligible';
    case 'Check Needed':
    default:
      return 'badge-check';
  }
}

/**
 * Returns the CSS class for Drive Mode.
 * @param {string} mode
 * @returns {string}
 */
export function getModePillClass(mode) {
  switch (mode) {
    case 'On-Campus':
      return 'pill-mode pill-on-campus';
    case 'Off-Campus':
      return 'pill-mode pill-off-campus';
    default:
      return 'pill-mode pill-on-campus';
  }
}

/**
 * Returns the CSS class for Pipeline Status.
 * @param {string} status
 * @returns {string}
 */
export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Not Applied':
      return 'badge-status-not-applied';
    case 'Applied':
      return 'badge-status-applied';
    case 'OA / Test':
      return 'badge-status-oa';
    case 'Interview':
      return 'badge-status-interview';
    case 'Offered':
      return 'badge-status-offered';
    case 'Rejected':
      return 'badge-status-rejected';
    default:
      return 'badge-status-not-applied';
  }
}

export default function TrackerTable({
  tab = 'internships',
  items = [],
  onEdit,
  onDelete,
  isLoaded = true,
  isFiltered = false,
  onResetFilters,
}) {
  const isInternships = tab === 'internships';
  // Total columns:
  // Common: # (1) + Company (1) + Deadline (1) + Mode (1) + Eligibility (1) + Roles (1) + Scale (1) + Careers (1) + Chance (1) + Status (1) + Actions (1) = 11
  // Conditional: Internships adds 2 (Stipend, PPO Info) = 13; Placements adds 1 (CTC) = 12
  const totalColumns = isInternships ? 13 : 12;

  return (
    <div className="table-container" role="region" aria-label={`${isInternships ? 'Internships' : 'Placements'} Table`}>
      <table className="spreadsheet-table">
        <thead>
          <tr>
            <th className="th-index" style={{ width: '45px', textAlign: 'center' }}>#</th>
            <th className="th-company">Company Name</th>
            <th className="th-deadline">Deadline</th>
            <th className="th-mode">Mode</th>
            <th className="th-eligibility">MSc Physics Eligibility</th>
            <th className="th-roles">Roles</th>
            {isInternships ? (
              <>
                <th className="th-stipend col-conditional-internship">Stipend</th>
                <th className="th-ppo col-conditional-internship">PPO Info</th>
              </>
            ) : (
              <th className="th-ctc col-conditional-placement">CTC</th>
            )}
            <th className="th-scale">Company Scale</th>
            <th className="th-careers">Careers URL</th>
            <th className="th-chance">Chance</th>
            <th className="th-status">Status</th>
            <th className="th-actions" style={{ textAlign: 'center', width: '130px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!items || items.length === 0 ? (
            <tr>
              <td colSpan={totalColumns}>
                <div className="empty-state">
                  <div className="empty-state-icon" aria-hidden="true">
                    {isFiltered ? '🔍' : isInternships ? '🎓' : '💼'}
                  </div>
                  <h3 className="empty-state-title">
                    {isFiltered
                      ? 'No opportunities match your current filters'
                      : `No ${isInternships ? 'internship' : 'placement'} opportunities tracked yet`}
                  </h3>
                  <p className="empty-state-subtitle">
                    {!isLoaded
                      ? 'Loading tracked opportunities...'
                      : isFiltered
                      ? 'Try adjusting your keyword search or filter criteria, or click "Reset Filters" to view all records.'
                      : `Use the "Add Opportunity" action to track your first ${isInternships ? 'internship' : 'placement'} opportunity.`}
                  </p>
                  {isFiltered && onResetFilters && (
                    <button
                      type="button"
                      id="btn-empty-reset-filters"
                      className="btn btn-secondary"
                      style={{ marginTop: '0.85rem' }}
                      onClick={onResetFilters}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const safeUrl = sanitizeUrl(item.careersUrl);
              return (
                <tr key={item.id || `row-${index}`}>
                  {/* Row Index */}
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {index + 1}
                  </td>

                  {/* Company Name */}
                  <td className="company-cell cell-truncate" title={item.companyName || ''}>
                    {item.companyName || <span className="text-muted">—</span>}
                  </td>

                  {/* Deadline */}
                  <td className="deadline-cell cell-truncate" title={item.deadline || ''}>
                    {item.deadline || <span className="text-muted">—</span>}
                  </td>

                  {/* Drive Mode */}
                  <td className="mode-cell">
                    <span className={getModePillClass(item.mode)} title={`Mode: ${item.mode || 'On-Campus'}`}>
                      {item.mode || 'On-Campus'}
                    </span>
                  </td>

                  {/* MSc Physics Eligibility */}
                  <td className="eligibility-cell">
                    <span
                      className={`badge ${getEligibilityBadgeClass(item.mscPhysicsEligibility)}`}
                      title={`MSc Physics Eligibility: ${item.mscPhysicsEligibility || 'Check Needed'}`}
                    >
                      {item.mscPhysicsEligibility || 'Check Needed'}
                    </span>
                  </td>

                  {/* Roles */}
                  <td className="roles-cell cell-truncate" title={item.roles || ''}>
                    {item.roles || <span className="text-muted">—</span>}
                  </td>

                  {/* Conditional Columns: Internships (Stipend & PPO) vs Placements (CTC) */}
                  {isInternships ? (
                    <>
                      <td className="stipend-cell cell-truncate" title={item.stipend || ''}>
                        {item.stipend || <span className="text-muted">—</span>}
                      </td>
                      <td className="ppo-cell cell-truncate" title={item.ppoInfo || ''}>
                        {item.ppoInfo || <span className="text-muted">—</span>}
                      </td>
                    </>
                  ) : (
                    <td className="ctc-cell cell-truncate" title={item.ctc || ''}>
                      {item.ctc || <span className="text-muted">—</span>}
                    </td>
                  )}

                  {/* Company Scale */}
                  <td className="scale-cell cell-truncate" title={item.companyScale || ''}>
                    {item.companyScale || <span className="text-muted">—</span>}
                  </td>

                  {/* Careers URL */}
                  <td className="careers-cell cell-truncate">
                    {safeUrl ? (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="table-link"
                        title={safeUrl}
                        aria-label={`Open careers link for ${item.companyName || 'opportunity'}`}
                      >
                        Apply / Portal ↗
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Chance */}
                  <td className="chance-cell">
                    <span
                      className={`badge ${getChanceBadgeClass(item.chance)}`}
                      title={`Recruitment Chance: ${item.chance || 'Yellow'}`}
                    >
                      {getChanceBadgeLabel(item.chance)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="status-cell">
                    <span
                      className={`badge ${getStatusBadgeClass(item.status)}`}
                      title={`Application Status: ${item.status || 'Not Applied'}`}
                    >
                      {item.status || 'Not Applied'}
                    </span>
                  </td>

                  {/* Row Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="action-btn action-btn-edit"
                        onClick={() => onEdit?.(item)}
                        title={`Edit ${item.companyName || 'Opportunity'}`}
                        aria-label={`Edit ${item.companyName || 'Opportunity'}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn-delete"
                        onClick={() => onDelete?.(item)}
                        title={`Delete ${item.companyName || 'Opportunity'}`}
                        aria-label={`Delete ${item.companyName || 'Opportunity'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
