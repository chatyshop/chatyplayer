/**
 * ChatyPlayer v1.0
 * Fullscreen Feature (Production Ready - Clean Mode Sync)
 * ----------------------------------------
 * - Fully compatible with Player mode system
 * - No forced mode overrides
 * - Prevents infinite loops
 * - Safe cross-browser support
 * - Works with existing Player fullscreen logic
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
export declare function initFullscreenFeature(player: Player, lifecycle?: LifecycleManager, state?: StateManager): {
    isFullscreen: () => boolean;
};
