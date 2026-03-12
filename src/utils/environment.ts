/**
 * ChatyPlayer v1.0
 * Environment Detection Utility
 * environment.ts
 * ----------------------------------------
 * - Safe SSR detection
 * - Feature detection (not UA sniffing)
 * - No unsafe global assumptions
 * - No side effects
 */

export interface EnvironmentInfo {
  isBrowser: boolean;
  isServer: boolean;
  isMobile: boolean;
  supportsTouch: boolean;
  supportsFullscreen: boolean;
  supportsPiP: boolean;
}

/**
 * Safe global references
 */
const hasWindow = typeof window !== 'undefined';
const hasDocument = typeof document !== 'undefined';

const nav = hasWindow ? window.navigator : null;

/**
 * Detect touch support safely
 */
function detectTouch(): boolean {
  if (!hasWindow) return false;

  const maxTouchPoints =
    nav && typeof nav.maxTouchPoints === 'number'
      ? nav.maxTouchPoints
      : 0;

  return (
    'ontouchstart' in window ||
    maxTouchPoints > 0
  );
}

/**
 * Detect mobile using feature hints (NOT strict UA sniffing)
 */
function detectMobile(): boolean {
  if (!nav) return false;

  const ua = nav.userAgent || '';

  // Lightweight hint only — not security critical
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}

/**
 * Detect Fullscreen API support
 */
function detectFullscreen(): boolean {
  if (!hasDocument) return false;

  const doc: any = document;
  const el: any = hasDocument ? document.createElement('div') : null;

  return !!(
    doc.fullscreenEnabled ||
    doc.webkitFullscreenEnabled ||
    doc.msFullscreenEnabled ||
    (el &&
      (el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen))
  );
}

/**
 * Detect Picture-in-Picture support
 */
function detectPiP(): boolean {
  if (!hasDocument) return false;

  const doc: any = document;
  const video =
    hasDocument ? document.createElement('video') : null;

  return !!(
    doc.pictureInPictureEnabled &&
    video &&
    typeof video.requestPictureInPicture === 'function'
  );
}

/**
 * Export frozen environment object
 */
export const Environment: EnvironmentInfo = Object.freeze({
  isBrowser: hasWindow && hasDocument,
  isServer: !hasWindow || !hasDocument,
  isMobile: detectMobile(),
  supportsTouch: detectTouch(),
  supportsFullscreen: detectFullscreen(),
  supportsPiP: detectPiP()
});