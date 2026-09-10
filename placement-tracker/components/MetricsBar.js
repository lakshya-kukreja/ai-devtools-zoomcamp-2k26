'use client';

import { useMemo } from 'react';

/**
 * components/MetricsBar.js
 *
 * Dynamic Metrics Summary Bar for Placement & Internship Tracker (V1).
 * Satisfies BACKLOG.md TASK-08 and SPEC.md Section 5.3.
 *
 * Displays 5 key recruitment pipeline metric cards:
 * 1. Total Tracked Companies: Total records in active tab.
 * 2. MSc Physics Eligible: Records where mscPhysicsEligibility === 'Eligible'.
 * 3. High Chance (Green): Records where chance === 'Green'.
 * 4. Active Applications: Records where status is 'Applied', 'OA / Test', or 'Interview'.
 * 5. Offers Received: Records where status === 'Offered'.
 *
 * Auto-computed dynamically in real time from the active tab's dataset.
 * Updates reactively upon tab switch or any CRUD operation.
 */

export default function MetricsBar({ items = [], tab = 'internships' }) {
  // Derived calculations auto-computed from active tab data
  const metrics = useMemo(() => {
    const records = Array.isArray(items) ? items : [];

    let totalTracked = records.length;
    let mscEligible = 0;
    let highChance = 0;
    let activeApplications = 0;
    let offersReceived = 0;

    for (const record of records) {
      if (record?.mscPhysicsEligibility === 'Eligible') {
        mscEligible += 1;
      }
      if (record?.chance === 'Green') {
        highChance += 1;
      }
      const status = record?.status;
      if (status === 'Applied' || status === 'OA / Test' || status === 'Interview') {
        activeApplications += 1;
      }
      if (status === 'Offered') {
        offersReceived += 1;
      }
    }

    return {
      totalTracked,
      mscEligible,
      highChance,
      activeApplications,
      offersReceived,
    };
  }, [items]);

  const tabLabel = tab === 'internships' ? 'Internships' : 'Placements';

  return (
    <section
      className="metrics-bar-section"
      aria-label={`${tabLabel} Pipeline Metrics Summary`}
      id="metrics-summary-bar"
    >
      <div className="metrics-bar-header">
        <div className="metrics-bar-titles">
          <h2 className="metrics-bar-title">
            <span className="metrics-title-icon" aria-hidden="true">📊</span>
            Pipeline Metrics Summary
          </h2>
          <span className="metrics-view-indicator">
            {tabLabel} View
          </span>
        </div>
        <div className="metrics-bar-meta">
          Real-time statistics auto-computed from active {tabLabel.toLowerCase()} records
        </div>
      </div>

      <div className="metrics-grid">
        {/* Metric Card 1: Total Tracked Companies */}
        <div className="metric-card metric-card-total" id="metric-total-tracked">
          <div className="metric-card-top">
            <span className="metric-label">Total Tracked Companies</span>
            <span className="metric-icon" aria-hidden="true">🏢</span>
          </div>
          <div className="metric-value-wrapper">
            <span className="metric-value" id="metric-val-total-tracked">
              {metrics.totalTracked}
            </span>
          </div>
          <div className="metric-footer">
            <span className="metric-subtext">
              {metrics.totalTracked === 1 ? '1 opportunity' : `${metrics.totalTracked} opportunities`} listed
            </span>
          </div>
        </div>

        {/* Metric Card 2: MSc Physics Eligible */}
        <div className="metric-card metric-card-eligible" id="metric-msc-eligible">
          <div className="metric-card-top">
            <span className="metric-label">MSc Physics Eligible</span>
            <span className="metric-icon" aria-hidden="true">🎯</span>
          </div>
          <div className="metric-value-wrapper">
            <span className="metric-value" id="metric-val-msc-eligible">
              {metrics.mscEligible}
            </span>
          </div>
          <div className="metric-footer">
            <span className="metric-subtext">
              Degree verified for roles
            </span>
          </div>
        </div>

        {/* Metric Card 3: High Chance (Green) */}
        <div className="metric-card metric-card-chance" id="metric-high-chance">
          <div className="metric-card-top">
            <span className="metric-label">High Chance (Green)</span>
            <span className="metric-icon" aria-hidden="true">🟢</span>
          </div>
          <div className="metric-value-wrapper">
            <span className="metric-value" id="metric-val-high-chance">
              {metrics.highChance}
            </span>
          </div>
          <div className="metric-footer">
            <span className="metric-subtext">
              High personal probability
            </span>
          </div>
        </div>

        {/* Metric Card 4: Active Applications */}
        <div className="metric-card metric-card-active" id="metric-active-applications">
          <div className="metric-card-top">
            <span className="metric-label">Active Applications</span>
            <span className="metric-icon" aria-hidden="true">🚀</span>
          </div>
          <div className="metric-value-wrapper">
            <span className="metric-value" id="metric-val-active-applications">
              {metrics.activeApplications}
            </span>
          </div>
          <div className="metric-footer">
            <span className="metric-subtext">
              Applied • OA / Test • Interview
            </span>
          </div>
        </div>

        {/* Metric Card 5: Offers Received */}
        <div className="metric-card metric-card-offers" id="metric-offers-received">
          <div className="metric-card-top">
            <span className="metric-label">Offers Received</span>
            <span className="metric-icon" aria-hidden="true">🏆</span>
          </div>
          <div className="metric-value-wrapper">
            <span className="metric-value" id="metric-val-offers-received">
              {metrics.offersReceived}
            </span>
          </div>
          <div className="metric-footer">
            <span className="metric-subtext">
              Selection confirmed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
