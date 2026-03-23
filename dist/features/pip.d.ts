/**
 * ChatyPlayer v1.0
 * Picture-in-Picture Feature (Production Ready)
 * ----------------------------------------
 * - Safe PiP handling
 * - Browser capability checks
 * - Auto PiP on tab switch
 * - User interaction tracking
 * - State sync
 * - Event emission
 * - Lifecycle safe cleanup
 * - SSR safe
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
import type { EventEmitter } from '../core/events';
export declare function initPiPFeature(player: Player, lifecycle?: LifecycleManager, state?: StateManager, events?: EventEmitter): {
    isSupported: () => boolean;
    isActive: () => boolean;
    togglePiP: () => Promise<void>;
    enterPiP: () => Promise<void>;
    exitPiP: () => Promise<void>;
} | undefined;
