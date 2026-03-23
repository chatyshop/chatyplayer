/**
 * ChatyPlayer v1.0
 * Safe Storage Utility
 * ----------------------------------------
 * - Safe localStorage wrapper
 * - JSON safe parsing
 * - Namespaced keys
 * - Graceful failure
 */
/**
 * Set value safely (JSON encoded)
 */
export declare function setItem<T>(key: string, value: T): boolean;
/**
 * Get value safely (JSON decoded)
 */
export declare function getItem<T>(key: string): T | null;
/**
 * Remove item safely
 */
export declare function removeItem(key: string): boolean;
/**
 * Clear only ChatyPlayer keys (not entire localStorage)
 */
export declare function clearNamespace(): void;
