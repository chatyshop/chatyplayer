/**
 * ChatyPlayer v1.0
 * Lifecycle Manager
 * ----------------------------------------
 * - Handles mount & destroy flow
 * - Prevents double initialization
 * - Prevents memory leaks
 * - Coordinates cleanup across modules
 */

import type { Player } from './Player';
import type { StateManager } from './state';
import type { EventEmitter } from './events';

export class LifecycleManager {
  private mounted: boolean = false;
  private destroyed: boolean = false;
  private cleanupTasks: Set<() => void> = new Set();

  /**
   * Mark player as mounted
   */
  public markMounted(): void {
    if (this.destroyed) {
      console.warn('[ChatyPlayer] Cannot mount. Player already destroyed.');
      return;
    }

    if (this.mounted) {
      console.warn('[ChatyPlayer] Player already mounted.');
      return;
    }

    this.mounted = true;
  }

  /**
   * Register cleanup callback
   * Used by features/modules to auto-clean on destroy
   */
  public registerCleanup(task: () => void): void {
    if (typeof task !== 'function') return;

    if (this.destroyed) {
      try {
        task();
      } catch (error) {
        console.error('[ChatyPlayer] Cleanup task failed:', error);
      }
      return;
    }

    this.cleanupTasks.add(task);
  }

  /**
   * Execute full destruction lifecycle
   */
  public destroy(
    player: Player,
    state?: StateManager,
    events?: EventEmitter
  ): void {
    if (this.destroyed) return;

    try {
      // Pause playback safely
      try {
        player.pause();
      } catch {}

      // Execute registered cleanup tasks
      this.cleanupTasks.forEach((task) => {
        try {
          task();
        } catch (error) {
          console.error('[ChatyPlayer] Cleanup error:', error);
        }
      });

      this.cleanupTasks.clear();

      // Clear state listeners
      if (state) {
        state.markDestroyed();
      }

      // Clear event listeners
      if (events) {
        events.destroy();
      }

      // Clear video source safely
      const video = player.getVideo();
      if (video) {
        video.removeAttribute('src');
        video.load();
      }

      // Clear container safely
      const container = player.getContainer();
      if (container) {
        container.innerHTML = '';
        container.removeAttribute('data-chaty-initialized');
      }

    } catch (error) {
      console.error('[ChatyPlayer] Lifecycle destroy error:', error);
    }

    this.destroyed = true;
    this.mounted = false;
  }

  /**
   * Lifecycle state checks
   */
  public isMounted(): boolean {
    return this.mounted;
  }

  public isDestroyed(): boolean {
    return this.destroyed;
  }
}