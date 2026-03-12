/**
 * ChatyPlayer v1.0
 * Safe Storage Utility
 * ----------------------------------------
 * - Safe localStorage wrapper
 * - JSON safe parsing
 * - Namespaced keys
 * - Graceful failure
 */

const STORAGE_PREFIX = 'chatyplayer:';

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const testKey = '__chaty_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageEnabled =
  typeof window !== 'undefined' && isStorageAvailable();

/**
 * Build safe namespaced key
 */
function buildKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Set value safely (JSON encoded)
 */
export function setItem<T>(key: string, value: T): boolean {
  if (!storageEnabled) return false;

  try {
    const safeKey = buildKey(key);
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(safeKey, serialized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get value safely (JSON decoded)
 */
export function getItem<T>(key: string): T | null {
  if (!storageEnabled) return null;

  try {
    const safeKey = buildKey(key);
    const raw = window.localStorage.getItem(safeKey);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Prevent prototype pollution
    if (parsed && typeof parsed === 'object') {
      if ('__proto__' in parsed) return null;
      if ('constructor' in parsed) return null;
    }

    return parsed as T;
  } catch {
    return null;
  }
}

/**
 * Remove item safely
 */
export function removeItem(key: string): boolean {
  if (!storageEnabled) return false;

  try {
    const safeKey = buildKey(key);
    window.localStorage.removeItem(safeKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear only ChatyPlayer keys (not entire localStorage)
 */
export function clearNamespace(): void {
  if (!storageEnabled) return;

  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    // Fail silently
  }
}