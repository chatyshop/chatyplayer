/**
 * ChatyPlayer v1.0
 * Resume Playback Feature
 * ----------------------------------------
 * - Saves position in localStorage
 * - Restores safely
 * - Throttled saving
 * - Prevents restoring near end
 * - Lifecycle safe
 */

import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';

const SAVE_INTERVAL = 5000; // 5 seconds
const MIN_DURATION = 30; // seconds
const END_THRESHOLD = 5; // seconds before end not to restore

export function initResumeFeature(
  player: Player,
  lifecycle?: LifecycleManager,
  state?: StateManager
) {
  const video = player.getVideo();

  let saveTimer: number | null = null;

  /**
   * Create safe storage key
   */
  const getStorageKey = (): string => {
    const src = video.currentSrc || video.src || 'unknown';
    return `chatyplayer_resume_${btoa(src).slice(0, 50)}`;
  };

  /**
   * Safe localStorage write
   */
  const savePosition = () => {
    if (!video.duration || video.duration < MIN_DURATION) return;

    try {
      const key = getStorageKey();
      localStorage.setItem(key, String(video.currentTime));
    } catch {
      // Fail silently (private mode, quota exceeded)
    }
  };

  /**
   * Restore saved position
   */
  const restorePosition = () => {
    if (!video.duration || video.duration < MIN_DURATION) return;

    try {
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      if (!stored) return;

      const time = parseFloat(stored);
      if (!isFinite(time)) return;

      if (time < video.duration - END_THRESHOLD) {
        video.currentTime = time;
        state?.set('currentTime', time);
      }
    } catch {
      // Fail silently
    }
  };

  /**
   * Start periodic saving
   */
  const startSaving = () => {
    if (saveTimer !== null) return;

    saveTimer = window.setInterval(() => {
      savePosition();
    }, SAVE_INTERVAL);
  };

  /**
   * Stop saving
   */
  const stopSaving = () => {
    if (saveTimer !== null) {
      clearInterval(saveTimer);
      saveTimer = null;
    }
  };

  /**
   * Event handlers
   */
  const onPlay = () => startSaving();
  const onPause = () => savePosition();
  const onEnded = () => {
    stopSaving();
    try {
      const key = getStorageKey();
      localStorage.removeItem(key);
    } catch {}
  };

  const onLoadedMetadata = () => restorePosition();

  video.addEventListener('play', onPlay);
  video.addEventListener('pause', onPause);
  video.addEventListener('ended', onEnded);
  video.addEventListener('loadedmetadata', onLoadedMetadata);

  lifecycle?.registerCleanup(() => {
    stopSaving();
    video.removeEventListener('play', onPlay);
    video.removeEventListener('pause', onPause);
    video.removeEventListener('ended', onEnded);
    video.removeEventListener('loadedmetadata', onLoadedMetadata);
  });

  return {
    restorePosition
  };
}