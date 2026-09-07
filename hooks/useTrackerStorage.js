'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getItems,
  saveItems,
  normalizeRecord,
  validateRecord,
  getStorageKey,
} from '../lib/storage';

/**
 * Custom React hook for SSR-safe client-side persistence of opportunities.
 * Adheres strictly to SPEC.md Section 4 and BACKLOG.md TASK-02.
 *
 * @param {'internships' | 'placements'} tab - The active tab view
 * @returns {object} Storage state and CRUD utility functions
 */
export function useTrackerStorage(tab = 'internships') {
  const [items, setItemsState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load items from localStorage
  const loadItems = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const data = getItems(tab);
      setItemsState(data);
    } catch (err) {
      console.error(`useTrackerStorage: Error loading items for tab "${tab}":`, err);
      setItemsState([]);
    } finally {
      setIsLoaded(true);
    }
  }, [tab]);

  // Read items on initial mount and when tab changes
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Listen for storage events (cross-tab and within-tab CustomEvent)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targetKey = getStorageKey(tab);

    const handleStorageChange = (e) => {
      // Native StorageEvent from other windows/tabs
      if (typeof StorageEvent !== 'undefined' && e instanceof StorageEvent) {
        if (e.key === targetKey) {
          loadItems();
        }
        return;
      }

      // CustomEvent dispatched from saveItems in the same window
      if (e.detail && e.detail.key === targetKey) {
        loadItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tracker_storage_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tracker_storage_update', handleStorageChange);
    };
  }, [tab, loadItems]);

  // Replace entire items array
  const setItems = useCallback(
    (newItems) => {
      const arrayToSave = typeof newItems === 'function' ? newItems(items) : newItems;
      const normalized = arrayToSave.map((item) => normalizeRecord(item, tab));
      saveItems(tab, normalized);
      setItemsState(normalized);
    },
    [tab, items]
  );

  // Add a new opportunity
  const addItem = useCallback(
    (itemData) => {
      const validation = validateRecord(itemData, tab);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      const newRecord = normalizeRecord(itemData, tab);
      const updated = [newRecord, ...items];
      saveItems(tab, updated);
      setItemsState(updated);
      return newRecord;
    },
    [tab, items]
  );

  // Update an existing opportunity by ID
  const updateItem = useCallback(
    (id, updatedFields) => {
      const existing = items.find((item) => item.id === id);
      if (!existing) {
        throw new Error(`Item with id "${id}" not found.`);
      }

      const merged = { ...existing, ...updatedFields };
      const validation = validateRecord(merged, tab);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      let nowIso = new Date().toISOString();
      if (nowIso === existing.createdAt) {
        nowIso = new Date(Date.now() + 1).toISOString();
      }

      let updatedRecord = null;
      const updated = items.map((item) => {
        if (item.id === id) {
          updatedRecord = normalizeRecord(
            {
              ...item,
              ...updatedFields,
              id: item.id,
              createdAt: item.createdAt,
              updatedAt: nowIso,
            },
            tab
          );
          return updatedRecord;
        }
        return item;
      });

      saveItems(tab, updated);
      setItemsState(updated);
      return updatedRecord;
    },
    [tab, items]
  );

  // Delete an opportunity by ID
  const deleteItem = useCallback(
    (id) => {
      if (!id) return;
      const updated = items.filter((item) => item.id !== id);
      saveItems(tab, updated);
      setItemsState(updated);
    },
    [tab, items]
  );

  return {
    items,
    isLoaded,
    addItem,
    updateItem,
    deleteItem,
    setItems,
    refresh: loadItems,
  };
}
