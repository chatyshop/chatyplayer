/**
 * ChatyPlayer v1.0
 * Playback Speed Feature
 * ----------------------------------------
 * - Validates playback rate
 * - Syncs with video element
 * - Updates state safely
 * - Emits speedchange event
 * - Lifecycle-safe cleanup
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
import type { EventEmitter } from '../core/events';
export declare function initSpeedFeature(player: Player, lifecycle?: LifecycleManager, state?: StateManager, events?: EventEmitter): {
    setSpeed: (rate: number) => void;
    getSpeed: () => number;
    resetSpeed: () => void;
};
