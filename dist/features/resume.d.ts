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
export declare function initResumeFeature(player: Player, lifecycle?: LifecycleManager, state?: StateManager): {
    restorePosition: () => void;
};
