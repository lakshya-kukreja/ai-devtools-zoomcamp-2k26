/**
 * lib/storage.js
 * Client-side localStorage persistence layer and schema validation for Placement & Internship Tracker (V1).
 *
 * Conforms strictly to SPEC.md Section 4 and BACKLOG.md TASK-02.
 */

export const STORAGE_KEYS = {
  internships: 'tracker_internships_v1',
  placements: 'tracker_placements_v1',
};

export const MODES = ['On-Campus', 'Off-Campus'];

export const ELIGIBILITY_OPTIONS = ['Eligible', 'Ineligible', 'Check Needed'];

export const COMPANY_SCALES = ['MNC', 'Startup', 'Small Company'];

export const CHANCE_OPTIONS = ['Green', 'Yellow', 'Red'];

export const STATUS_OPTIONS = [
  'Not Applied',
  'Applied',
  'OA / Test',
  'Interview',
  'Offered',
  'Rejected',
];

/**
 * Returns the isolated localStorage key for a given tab.
 * @param {'internships' | 'placements'} tab
 * @returns {string}
 */
export function getStorageKey(tab) {
  if (tab === 'internships' || tab === 'placements') {
    return STORAGE_KEYS[tab];
  }
  throw new Error(`Invalid tab: "${tab}". Must be "internships" or "placements".`);
}

/**
 * Generates a unique record identifier using crypto.randomUUID() with timestamp fallback.
 * @returns {string}
 */
export function generateId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback in case randomUUID fails in certain environments
    }
  }

  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `id-${timestamp}-${randomPart}`;
}

/**
 * Validates a single opportunity record according to SPEC.md Section 4.
 * @param {object} record
 * @param {'internships' | 'placements'} tab
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateRecord(record, tab) {
  const errors = [];

  if (!record || typeof record !== 'object') {
    return { isValid: false, errors: ['Record must be a valid object.'] };
  }

  if (tab !== 'internships' && tab !== 'placements') {
    errors.push(`Invalid tab: "${tab}". Tab must be "internships" or "placements".`);
  }

  if (!record.companyName || typeof record.companyName !== 'string' || !record.companyName.trim()) {
    errors.push('Company Name is required.');
  }

  if (record.mode && !MODES.includes(record.mode)) {
    errors.push(`Invalid mode "${record.mode}". Allowed values: ${MODES.join(', ')}.`);
  }

  if (record.mscPhysicsEligibility && !ELIGIBILITY_OPTIONS.includes(record.mscPhysicsEligibility)) {
    errors.push(
      `Invalid eligibility "${record.mscPhysicsEligibility}". Allowed values: ${ELIGIBILITY_OPTIONS.join(', ')}.`
    );
  }

  if (record.companyScale && !COMPANY_SCALES.includes(record.companyScale)) {
    errors.push(`Invalid company scale "${record.companyScale}". Allowed values: ${COMPANY_SCALES.join(', ')}.`);
  }

  if (record.chance && !CHANCE_OPTIONS.includes(record.chance)) {
    errors.push(`Invalid chance "${record.chance}". Allowed values: ${CHANCE_OPTIONS.join(', ')}.`);
  }

  if (record.status && !STATUS_OPTIONS.includes(record.status)) {
    errors.push(`Invalid status "${record.status}". Allowed values: ${STATUS_OPTIONS.join(', ')}.`);
  }

  // Schema segregation checks (Section 3.1 & 4)
  if (tab === 'internships') {
    if ('ctc' in record && record.ctc !== undefined && record.ctc !== '') {
      errors.push('The "ctc" field is not allowed in Internships records.');
    }
  } else if (tab === 'placements') {
    if ('stipend' in record && record.stipend !== undefined && record.stipend !== '') {
      errors.push('The "stipend" field is not allowed in Placements records.');
    }
    if ('ppoInfo' in record && record.ppoInfo !== undefined && record.ppoInfo !== '') {
      errors.push('The "ppoInfo" field is not allowed in Placements records.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Normalizes an opportunity record to match SPEC.md Section 4 fields.
 * Ensures strict segregation between Internships and Placements fields.
 * @param {object} record
 * @param {'internships' | 'placements'} tab
 * @returns {object}
 */
export function normalizeRecord(record = {}, tab = 'internships') {
  if (tab !== 'internships' && tab !== 'placements') {
    throw new Error(`Invalid tab: "${tab}". Must be "internships" or "placements".`);
  }

  const now = new Date().toISOString();

  const common = {
    id: typeof record.id === 'string' && record.id ? record.id : generateId(),
    companyName: typeof record.companyName === 'string' ? record.companyName.trim() : '',
    deadline: typeof record.deadline === 'string' ? record.deadline.trim() : '',
    mode: MODES.includes(record.mode) ? record.mode : 'On-Campus',
    mscPhysicsEligibility: ELIGIBILITY_OPTIONS.includes(record.mscPhysicsEligibility)
      ? record.mscPhysicsEligibility
      : 'Check Needed',
    roles: typeof record.roles === 'string' ? record.roles.trim() : '',
    companyScale: COMPANY_SCALES.includes(record.companyScale) ? record.companyScale : 'Startup',
    careersUrl: typeof record.careersUrl === 'string' ? record.careersUrl.trim() : '',
    chance: CHANCE_OPTIONS.includes(record.chance) ? record.chance : 'Yellow',
    status: STATUS_OPTIONS.includes(record.status) ? record.status : 'Not Applied',
    createdAt: typeof record.createdAt === 'string' && record.createdAt ? record.createdAt : now,
    updatedAt: typeof record.updatedAt === 'string' && record.updatedAt ? record.updatedAt : now,
  };

  if (tab === 'internships') {
    return {
      ...common,
      stipend: typeof record.stipend === 'string' ? record.stipend.trim() : '',
      ppoInfo: typeof record.ppoInfo === 'string' ? record.ppoInfo.trim() : '',
    };
  }

  return {
    ...common,
    ctc: typeof record.ctc === 'string' ? record.ctc.trim() : '',
  };
}

/**
 * SSR-safe retrieval of items from localStorage for a given tab.
 * If key does not exist, initializes localStorage with an empty array [] and returns [].
 * @param {'internships' | 'placements'} tab
 * @returns {Array}
 */
export function getItems(tab) {
  if (typeof window === 'undefined') {
    return [];
  }

  const key = getStorageKey(tab);

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      window.localStorage.setItem(key, JSON.stringify([]));
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(`Data at key "${key}" was corrupted or not an array. Resetting to [].`);
      window.localStorage.setItem(key, JSON.stringify([]));
      return [];
    }

    return parsed;
  } catch (err) {
    console.error(`Failed to read from localStorage key "${key}":`, err);
    return [];
  }
}

/**
 * SSR-safe saving of items to localStorage for a given tab.
 * Dispatches a 'tracker_storage_update' CustomEvent for local window subscribers.
 * @param {'internships' | 'placements'} tab
 * @param {Array} items
 * @returns {boolean}
 */
export function saveItems(tab, items) {
  if (typeof window === 'undefined') {
    return false;
  }

  const key = getStorageKey(tab);

  if (!Array.isArray(items)) {
    throw new TypeError(`saveItems expects an Array of items, received: ${typeof items}`);
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(items));

    // Dispatch event to inform listeners in the same window
    window.dispatchEvent(
      new CustomEvent('tracker_storage_update', {
        detail: { tab, key, count: items.length },
      })
    );

    return true;
  } catch (err) {
    console.error(`Failed to save items to localStorage key "${key}":`, err);
    return false;
  }
}

/**
 * Resets the storage for a given tab to an empty array [].
 * @param {'internships' | 'placements'} tab
 * @returns {boolean}
 */
export function clearItems(tab) {
  return saveItems(tab, []);
}
