/**
 * ChatyPlayer v1.0
 * Time Utilities (Strict Safe)
 * ----------------------------------------
 * - Fully strict TypeScript safe
 * - No undefined destructuring
 * - No unsafe casts
 * - No side effects
 */

/* =========================================
   Normalize Seconds
========================================= */

function normalizeSeconds(value: unknown): number {
  const num = Number(value);

  if (!Number.isFinite(num) || num < 0) return 0;

  return Math.floor(num);
}

/* =========================================
   Format Short Time (mm:ss)
========================================= */

export function formatShortTime(seconds: unknown): string {
  const total = normalizeSeconds(seconds);

  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* =========================================
   Format Time (hh:mm:ss)
========================================= */

export function formatTime(seconds: unknown): string {
  const total = normalizeSeconds(seconds);

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      secs < 10 ? '0' : ''
    }${secs}`;
  }

  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

/* =========================================
   Parse Time String → Seconds
========================================= */

export function parseTimeToSeconds(value: string): number | null {
  if (typeof value !== 'string') return null;

  const parts = value.split(':');

  if (parts.length < 2 || parts.length > 3) return null;

  const nums = parts.map((p) => Number(p));

  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;

  // mm:ss
  if (nums.length === 2) {
    const minutes = nums[0] ?? 0;
    const seconds = nums[1] ?? 0;

    return Math.floor(minutes * 60 + seconds);
  }

  // hh:mm:ss
  const hours = nums[0] ?? 0;
  const minutes = nums[1] ?? 0;
  const seconds = nums[2] ?? 0;

  return Math.floor(hours * 3600 + minutes * 60 + seconds);
}