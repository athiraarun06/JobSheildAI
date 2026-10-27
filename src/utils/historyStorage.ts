import { AnalysisResult } from '../types/jobshield.ts';
import { SAMPLE_JOB_POSTINGS } from '../data/sample_postings.ts';

const PREFIX = 'jobshield_history_';

function getStorageKey(userEmailOrId?: string | null): string {
  if (!userEmailOrId || userEmailOrId.trim() === '') {
    return `${PREFIX}guest`;
  }
  const clean = userEmailOrId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `${PREFIX}${clean}`;
}

export function getLocalHistory(userEmailOrId?: string | null): AnalysisResult[] {
  try {
    const key = getStorageKey(userEmailOrId);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load local history:', err);
  }
  return [];
}

export function saveLocalHistory(userEmailOrId: string | null | undefined, items: AnalysisResult[]): void {
  try {
    const key = getStorageKey(userEmailOrId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save local history:', err);
  }
}

export function addLocalHistoryItem(userEmailOrId: string | null | undefined, item: AnalysisResult): AnalysisResult[] {
  try {
    const current = getLocalHistory(userEmailOrId);
    // Deduplicate by ID
    const filtered = current.filter(existing => existing.id !== item.id);
    const updated = [item, ...filtered].slice(0, 100); // Keep latest 100
    saveLocalHistory(userEmailOrId, updated);
    return updated;
  } catch (err) {
    console.warn('Failed to add local history item:', err);
    return [item];
  }
}

export function deleteLocalHistoryItem(userEmailOrId: string | null | undefined, itemId: string): AnalysisResult[] {
  try {
    const current = getLocalHistory(userEmailOrId);
    const updated = current.filter(item => item.id !== itemId);
    saveLocalHistory(userEmailOrId, updated);
    return updated;
  } catch (err) {
    console.warn('Failed to delete local history item:', err);
    return [];
  }
}

export function clearLocalHistory(userEmailOrId: string | null | undefined): void {
  try {
    const key = getStorageKey(userEmailOrId);
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Failed to clear local history:', err);
  }
}

/**
 * Seed realistic sample scan records for the current user
 */
export function seedSampleHistory(userEmailOrId: string | null | undefined): AnalysisResult[] {
  const current = getLocalHistory(userEmailOrId);
  const sampleItems: AnalysisResult[] = SAMPLE_JOB_POSTINGS.slice(0, 3).map((sample, idx) => ({
    ...sample,
    id: `seed-demo-${Date.now()}-${idx}`,
    timestamp: new Date(Date.now() - idx * 86400000 * 1.5).toISOString(),
    userId: userEmailOrId || 'guest'
  }));

  // Merge sample items without duplicates
  const existingIds = new Set(current.map(c => c.submission?.title));
  const newSamples = sampleItems.filter(s => !existingIds.has(s.submission?.title));
  const updated = [...current, ...newSamples];
  saveLocalHistory(userEmailOrId, updated);
  return updated;
}
