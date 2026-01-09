/**
 * Saved Opportunities Persistence
 * Manages saved opportunities in localStorage with user-specific keys
 */

const STORAGE_KEY_PREFIX = 'wasilah_saved_opportunities';

/**
 * Get storage key for specific user
 */
function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}_${userId}`;
}

/**
 * Load saved opportunity IDs from localStorage
 */
export function loadSavedOpportunities(userId: string): string[] {
  try {
    const key = getStorageKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading saved opportunities:', error);
    return [];
  }
}

/**
 * Save opportunity IDs to localStorage
 */
export function saveSavedOpportunities(userId: string, opportunityIds: string[]): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(opportunityIds));
  } catch (error) {
    console.error('Error saving opportunities:', error);
    throw new Error('Failed to save opportunities to storage');
  }
}

/**
 * Add an opportunity to saved list
 */
export function addSavedOpportunity(userId: string, opportunityId: string): string[] {
  const saved = loadSavedOpportunities(userId);
  
  if (!saved.includes(opportunityId)) {
    saved.push(opportunityId);
    saveSavedOpportunities(userId, saved);
  }
  
  return saved;
}

/**
 * Remove an opportunity from saved list
 */
export function removeSavedOpportunity(userId: string, opportunityId: string): string[] {
  const saved = loadSavedOpportunities(userId);
  const filtered = saved.filter(id => id !== opportunityId);
  
  saveSavedOpportunities(userId, filtered);
  
  return filtered;
}

/**
 * Check if an opportunity is saved
 */
export function isOpportunitySaved(userId: string, opportunityId: string): boolean {
  const saved = loadSavedOpportunities(userId);
  return saved.includes(opportunityId);
}

/**
 * Clear all saved opportunities for a user
 */
export function clearSavedOpportunities(userId: string): void {
  const key = getStorageKey(userId);
  localStorage.removeItem(key);
}

/**
 * Get count of saved opportunities
 */
export function getSavedCount(userId: string): number {
  return loadSavedOpportunities(userId).length;
}

/**
 * Migrate saved opportunities from old storage format (if exists)
 */
export function migrateSavedOpportunities(userId: string): void {
  try {
    // Check for old format without user ID
    const oldKey = 'wasilah_saved_opportunities';
    const oldData = localStorage.getItem(oldKey);
    
    if (oldData) {
      const parsed = JSON.parse(oldData);
      const newKey = getStorageKey(userId);
      
      // Only migrate if new key doesn't exist
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldData);
      }
      
      // Remove old key
      localStorage.removeItem(oldKey);
    }
  } catch (error) {
    console.error('Error migrating saved opportunities:', error);
  }
}
