'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MODES,
  ELIGIBILITY_OPTIONS,
  COMPANY_SCALES,
  STATUS_OPTIONS,
} from '../lib/storage';

  const INITIAL_FORM_STATE = {
    companyName: '',
    deadline: '',
    mode: 'On-Campus',
    mscPhysicsEligibility: 'Check Needed',
    roles: '',
    companyScale: 'Startup',
    careersUrl: '',
    chance: 'Yellow',
    status: 'Not Applied',
    stipend: '',
    ppoInfo: '',
    ctc: '',
  };

/**
 * components/OpportunityModal.js
 * Modal dialog component for adding and editing placement or internship opportunities.
 * Satisfies BACKLOG.md TASK-04 & TASK-05 and SPEC.md Sections 4 & 5.1.
 */
export default function OpportunityModal({
  isOpen,
  tab = 'internships',
  onClose,
  onAdd,
  onUpdate,
  initialData = null,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const companyInputRef = useRef(null);
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const isInternships = tab === 'internships';
  const isEditing = Boolean(initialData);

  // Reset form when modal opens or tab/initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          companyName: initialData.companyName || '',
          deadline: initialData.deadline || '',
          mode: initialData.mode || 'On-Campus',
          mscPhysicsEligibility: initialData.mscPhysicsEligibility || 'Check Needed',
          roles: initialData.roles || '',
          companyScale: initialData.companyScale || 'Startup',
          careersUrl: initialData.careersUrl || '',
          chance: initialData.chance || 'Yellow',
          status: initialData.status || 'Not Applied',
          stipend: initialData.stipend || '',
          ppoInfo: initialData.ppoInfo || '',
          ctc: initialData.ctc || '',
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setErrors({});
      // Ergonomic auto-focus on primary company name input
      const timer = setTimeout(() => {
        if (companyInputRef.current) {
          companyInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData, tab]);

  // Handle ESC key press, TAB focus trapping, and restore focus on close (TASK-09)
  useEffect(() => {
    if (!isOpen) {
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
      return;
    }

    if (typeof document !== 'undefined') {
      previousActiveElementRef.current = document.activeElement;
    }

    const handleKeyDown = (e) => {
      // Escape closes open modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab key focus trapping for keyboard ergonomics
      if (e.key === 'Tab') {
        const modalEl = modalRef.current;
        if (!modalEl) return;

        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(modalEl.querySelectorAll(focusableSelectors)).filter(
          (el) => !el.disabled && el.offsetParent !== null
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing in Company Name
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation: Company Name is required
    if (!formData.companyName.trim()) {
      setErrors({ companyName: 'Company Name is required.' });
      if (companyInputRef.current) {
        companyInputRef.current.focus();
      }
      return;
    }

    // Prepare payload adhering strictly to schema rules in SPEC.md
    const payload = {
      companyName: formData.companyName.trim(),
      deadline: formData.deadline.trim(),
      mode: formData.mode,
      mscPhysicsEligibility: formData.mscPhysicsEligibility,
      roles: formData.roles.trim(),
      companyScale: formData.companyScale,
      careersUrl: formData.careersUrl.trim(),
      chance: formData.chance,
      status: formData.status,
    };

    if (isInternships) {
      payload.stipend = formData.stipend.trim();
      payload.ppoInfo = formData.ppoInfo.trim();
    } else {
      payload.ctc = formData.ctc.trim();
    }

    try {
      if (isEditing) {
        onUpdate?.(initialData.id, payload);
      } else {
        onAdd?.(payload);
      }
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save opportunity. Please check all inputs.',
      }));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header-titles">
            <h2 id="modal-title" className="modal-title">
              {isEditing
                ? `✏️ Edit Opportunity - ${initialData.companyName || 'Opportunity'}`
                : `➕ Add ${isInternships ? 'Internship' : 'Placement'} Opportunity`}
            </h2>
            <span className="modal-tab-badge">
              {isEditing
                ? `Editing Opportunity • ${isInternships ? 'Internships (Stipend & PPO)' : 'Placements (CTC)'}`
                : `Target View: ${isInternships ? 'Internships (Stipend & PPO)' : 'Placements (CTC)'}`}
            </span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="modal-body">
            {errors.form && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  fontSize: '0.825rem',
                  marginBottom: '1rem',
                }}
                role="alert"
              >
                ⚠️ {errors.form}
              </div>
            )}

            {/* Company Name (Required) */}
            <div className="form-group">
              <label htmlFor="modal-companyName" className="form-label">
                Company Name <span className="field-required">*</span>
              </label>
              <input
                ref={companyInputRef}
                id="modal-companyName"
                name="companyName"
                type="text"
                className={`form-input ${errors.companyName ? 'has-error' : ''}`}
                placeholder="e.g. Goldman Sachs, DRDO, Quadeye"
                value={formData.companyName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? 'modal-companyName-error' : undefined}
                required
              />
              {errors.companyName && (
                <span id="modal-companyName-error" className="form-error-msg" role="alert">
                  {errors.companyName}
                </span>
              )}
            </div>

            {/* Two-column row: Deadline & Mode */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-deadline" className="form-label">
                  Deadline
                </label>
                <input
                  id="modal-deadline"
                  name="deadline"
                  type="text"
                  className="form-input"
                  placeholder="YYYY-MM-DD or Rolling"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-mode" className="form-label">
                  Drive Mode
                </label>
                <select
                  id="modal-mode"
                  name="mode"
                  className="form-select"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  {MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Two-column row: MSc Physics Eligibility & Company Scale */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-mscPhysicsEligibility" className="form-label">
                  MSc Physics Eligibility
                </label>
                <select
                  id="modal-mscPhysicsEligibility"
                  name="mscPhysicsEligibility"
                  className="form-select"
                  value={formData.mscPhysicsEligibility}
                  onChange={handleChange}
                >
                  {ELIGIBILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modal-companyScale" className="form-label">
                  Company Scale
                </label>
                <select
                  id="modal-companyScale"
                  name="companyScale"
                  className="form-select"
                  value={formData.companyScale}
                  onChange={handleChange}
                >
                  {COMPANY_SCALES.map((scale) => (
                    <option key={scale} value={scale}>
                      {scale}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roles */}
            <div className="form-group">
              <label htmlFor="modal-roles" className="form-label">
                Roles Offered
              </label>
              <input
                id="modal-roles"
                name="roles"
                type="text"
                className="form-input"
                placeholder="e.g. Data Scientist, Quant Researcher, Modeling Analyst"
                value={formData.roles}
                onChange={handleChange}
              />
            </div>

            {/* Tab-conditional fields */}
            {isInternships ? (
              <div className="form-row form-row-conditional">
                <div className="form-group">
                  <label htmlFor="modal-stipend" className="form-label">
                    Stipend <span className="conditional-tag">Internships only</span>
                  </label>
                  <input
                    id="modal-stipend"
                    name="stipend"
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹50,000/month"
                    value={formData.stipend}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-ppoInfo" className="form-label">
                    PPO Information <span className="conditional-tag">Internships only</span>
                  </label>
                  <input
                    id="modal-ppoInfo"
                    name="ppoInfo"
                    type="text"
                    className="form-input"
                    placeholder="e.g. PPO on performance / 18 LPA"
                    value={formData.ppoInfo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="form-group form-group-conditional">
                <label htmlFor="modal-ctc" className="form-label">
                  Annual CTC <span className="conditional-tag">Placements only</span>
                </label>
                <input
                  id="modal-ctc"
                  name="ctc"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 15 LPA / ₹18,00,000"
                  value={formData.ctc}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Careers URL */}
            <div className="form-group">
              <label htmlFor="modal-careersUrl" className="form-label">
                Careers / Application Portal URL
              </label>
              <input
                id="modal-careersUrl"
                name="careersUrl"
                type="url"
                className="form-input"
                placeholder="https://careers.example.com/apply"
                value={formData.careersUrl}
                onChange={handleChange}
              />
            </div>

            {/* Two-column row: Chance & Status */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="modal-chance" className="form-label">
                  Recruitment Chance
                </label>
                <select
                  id="modal-chance"
                  name="chance"
                  className="form-select"
                  value={formData.chance}
                  onChange={handleChange}
                >
                  <option value="Green">● Green (High chance)</option>
                  <option value="Yellow">● Yellow (Moderate chance)</option>
                  <option value="Red">● Red (Reach odds)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modal-status" className="form-label">
                  Application Status
                </label>
                <select
                  id="modal-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="modal-submit-btn"
            >
              {isEditing ? 'Save Changes' : 'Save Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
