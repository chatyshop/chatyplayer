/**
 * fullscreen.ts
 * ChatyPlayer v1.0
 * Fullscreen Feature
 * ----------------------------------------
 * - Safe Fullscreen API handling
 * - Cross-browser support
 * - State sync
 * - Event emission
 * - Lifecycle safe cleanup
 */

import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
import type { EventEmitter } from '../core/events';

export function initFullscreenFeature(
  player: Player,
  lifecycle?: LifecycleManager,
  state?: StateManager,
  events?: EventEmitter
) {
  const container = player.getContainer();

  const doc: any = document;

  /**
   * Request fullscreen safely
   */
  const requestFullscreen = (): Promise<void> | void => {
    const el: any = container;

    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
  };

  /**
   * Exit fullscreen safely
   */
  const exitFullscreen = (): Promise<void> | void => {
    if (doc.exitFullscreen) return doc.exitFullscreen();
    if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
    if (doc.msExitFullscreen) return doc.msExitFullscreen();
  };

  /**
   * Check fullscreen state
   */
  const isFullscreen = (): boolean => {
    return (
      document.fullscreenElement === container ||
      doc.webkitFullscreenElement === container ||
      doc.msFullscreenElement === container
    );
  };

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = async (): Promise<void> => {
    try {
      if (!isFullscreen()) {
        await requestFullscreen();
      } else {
        await exitFullscreen();
      }
    } catch {
      // Fail silently (user gesture policy, etc.)
    }
  };

  /**
   * Sync state on fullscreen change
   */
  const onFullscreenChange = (): void => {
    const active = isFullscreen();

    state?.set('fullscreen', active);
    events?.emit('fullscreenchange' as any, active);
  };

  // Register listeners
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('msfullscreenchange', onFullscreenChange);

  lifecycle?.registerCleanup(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    document.removeEventListener('msfullscreenchange', onFullscreenChange);
  });

  return {
    toggleFullscreen,
    isFullscreen
  };
}