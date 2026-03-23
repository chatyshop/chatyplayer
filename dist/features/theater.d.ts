/**
 * ChatyPlayer v1.0
 * Theater Mode Feature (Production Ready - Mode Safe)
 * ----------------------------------------
 * - Safe style backup (WeakMap)
 * - Idempotent enable/disable
 * - No layout leaks
 * - Mode system compatible
 * - Works with fullscreen transitions
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
export declare function initTheaterFeature(player: Player, lifecycle?: LifecycleManager, state?: StateManager): {
    enableTheatre: () => void;
    disableTheatre: () => void;
};
