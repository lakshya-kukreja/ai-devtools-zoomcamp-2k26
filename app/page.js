'use client';

import { useState } from 'react';
import { useTrackerStorage } from '../hooks/useTrackerStorage';
import TrackerTable from '../components/TrackerTable';
import OpportunityModal from '../components/OpportunityModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('internships');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { items, isLoaded, addItem, updateItem } = useTrackerStorage(activeTab);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Placeholder delete handler (to be implemented in future tasks)
  const handleDelete = (item) => {
    console.log('Delete action triggered for', item);
  };

  return (
    <div className="app-shell">
      {/* Top Application Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-section">
            <div className="brand-icon" aria-hidden="true">
              🎯
            </div>
            <div className="brand-titles">
              <h1>
                Placement & Internship Tracker
                <span className="version-pill">V1</span>
              </h1>
              <p className="brand-subtitle">
                Spreadsheet Dashboard for MSc Physics Drives • Full-time & Internship Opportunities
              </p>
            </div>
          </div>

          <div className="header-badges">
            <span className="spec-badge">
              <span className="spec-badge-dot" />
              App Router • Plain CSS
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Tab Navigation Switcher */}
        <section className="nav-tab-container" aria-label="Opportunity Views">
          <div className="tab-switcher" role="tablist">
            <button
              id="tab-internships"
              role="tab"
              aria-selected={activeTab === 'internships'}
              aria-controls="panel-internships"
              className={`tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
              onClick={() => handleTabChange('internships')}
            >
              🎓 Internships
              <span className="tab-tag">Stipend & PPO</span>
            </button>
            <button
              id="tab-placements"
              role="tab"
              aria-selected={activeTab === 'placements'}
              aria-controls="panel-placements"
              className={`tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
              onClick={() => handleTabChange('placements')}
            >
              💼 Placements
              <span className="tab-tag">Full-time CTC</span>
            </button>
          </div>

          <div className="tab-meta-info">
            Active View:{' '}
            <strong className="tab-meta-highlight">
              {activeTab === 'internships' ? 'Internships (Stipend & PPO terms)' : 'Placements (Annual CTC package)'}
            </strong>
          </div>
        </section>

        {/* Dynamic Metrics Summary Bar Placeholder (TASK-08) */}
        <section className="placeholder-section" aria-labelledby="metrics-summary-title">
          <div className="placeholder-header">
            <h2 id="metrics-summary-title" className="placeholder-title">
              📊 Dynamic Metrics Summary Bar
            </h2>
            <span className="placeholder-tag">TASK-08 Shell</span>
          </div>
          <p className="placeholder-desc">
            Displays real-time pipeline metrics dynamically computed for the active{' '}
            <strong>{activeTab === 'internships' ? 'Internships' : 'Placements'}</strong> view.
          </p>
          <div className="metrics-placeholder-grid">
            <div className="metric-placeholder-card">
              <span className="metric-placeholder-label">Total Tracked</span>
              <span className="metric-placeholder-val">0</span>
            </div>
            <div className="metric-placeholder-card">
              <span className="metric-placeholder-label">MSc Physics Eligible</span>
              <span className="metric-placeholder-val">0</span>
            </div>
            <div className="metric-placeholder-card">
              <span className="metric-placeholder-label">High Chance (Green)</span>
              <span className="metric-placeholder-val">0</span>
            </div>
            <div className="metric-placeholder-card">
              <span className="metric-placeholder-label">Active Applications</span>
              <span className="metric-placeholder-val">0</span>
            </div>
            <div className="metric-placeholder-card">
              <span className="metric-placeholder-label">Offers Received</span>
              <span className="metric-placeholder-val">0</span>
            </div>
          </div>
        </section>

        {/* Search & Quick Filters Bar Placeholder (TASK-07) */}
        <section className="placeholder-section" aria-labelledby="filter-section-title">
          <div className="placeholder-header">
            <h2 id="filter-section-title" className="placeholder-title">
              🔍 Search & Quick Filters
            </h2>
            <span className="placeholder-tag">TASK-07 Shell</span>
          </div>
          <p className="placeholder-desc">
            Filter opportunities by keyword search and multi-criteria selectors.
          </p>
          <div className="filters-placeholder-bar">
            <div className="fake-input">Search company name or role...</div>
            <div className="fake-select">Eligibility: All</div>
            <div className="fake-select">Mode: All</div>
            <div className="fake-select">Status: All</div>
            <div className="fake-select">Chance: All</div>
          </div>
        </section>

        {/* Spreadsheet Table Component (TASK-03 & TASK-04) */}
        <section className="card-section" aria-labelledby="spreadsheet-section-title">
          <div className="table-header-bar">
            <div className="table-header-titles">
              <h2 id="spreadsheet-section-title" className="section-title">
                📋 {activeTab === 'internships' ? 'Internship Opportunities' : 'Placement Opportunities'}
              </h2>
              <p className="section-subtitle">
                {activeTab === 'internships'
                  ? 'Tracking Stipend, PPO conversion terms, and MSc Physics eligibility'
                  : 'Tracking CTC packages and MSc Physics eligibility'}
              </p>
            </div>
            <button
              type="button"
              id="btn-add-opportunity"
              className="btn btn-primary btn-add-opportunity"
              onClick={handleOpenAddModal}
            >
              <span aria-hidden="true">➕</span> Add Opportunity
            </button>
          </div>
          <TrackerTable
            tab={activeTab}
            items={items}
            isLoaded={isLoaded}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        {/* Design System Tokens Showcase (SPEC.md Section 6 Compliance) */}
        <section className="tokens-preview-card" aria-labelledby="design-system-title">
          <h3 id="design-system-title">🎨 Design System Tokens (SPEC.md Section 6)</h3>
          <div className="tokens-grid">
            <div>
              <h4 className="token-group-title">Recruitment Chance Badges</h4>
              <div className="token-items">
                <span className="badge badge-chance-green">● Green (High)</span>
                <span className="badge badge-chance-yellow">● Yellow (Moderate)</span>
                <span className="badge badge-chance-red">● Red (Reach)</span>
              </div>
            </div>

            <div>
              <h4 className="token-group-title">MSc Physics Eligibility Badges</h4>
              <div className="token-items">
                <span className="badge badge-eligible">Eligible</span>
                <span className="badge badge-ineligible">Ineligible</span>
                <span className="badge badge-check">Check Needed</span>
              </div>
            </div>

            <div>
              <h4 className="token-group-title">Mode Pills</h4>
              <div className="token-items">
                <span className="pill-mode pill-on-campus">On-Campus</span>
                <span className="pill-mode pill-off-campus">Off-Campus</span>
              </div>
            </div>

            <div>
              <h4 className="token-group-title">Application Status Stages</h4>
              <div className="token-items">
                <span className="badge badge-status-not-applied">Not Applied</span>
                <span className="badge badge-status-applied">Applied</span>
                <span className="badge badge-status-oa">OA / Test</span>
                <span className="badge badge-status-interview">Interview</span>
                <span className="badge badge-status-offered">Offered</span>
                <span className="badge badge-status-rejected">Rejected</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        Placement & Internship Tracker • MSc Physics Preparation • App Router • Plain CSS • LocalStorage Client Tool
      </footer>

      {/* Add / Edit Opportunity Modal Dialog (TASK-04 & TASK-05) */}
      <OpportunityModal
        isOpen={isModalOpen}
        tab={activeTab}
        initialData={editingItem}
        onClose={handleCloseModal}
        onAdd={(newRecord) => {
          addItem(newRecord);
        }}
        onUpdate={(id, updatedFields) => {
          updateItem(id, updatedFields);
        }}
      />
    </div>
  );
}
