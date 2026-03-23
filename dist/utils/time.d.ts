/**
 * ChatyPlayer v1.0
 * Time Utilities (Strict Safe)
 * ----------------------------------------
 * - Fully strict TypeScript safe
 * - No undefined destructuring
 * - No unsafe casts
 * - No side effects
 */
export declare function formatShortTime(seconds: unknown): string;
export declare function formatTime(seconds: unknown): string;
export declare function parseTimeToSeconds(value: string): number | null;
