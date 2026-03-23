/**
 * ChatyPlayer v1.0
 * Controls Module (Production Ready - Final Stable)
 * controls.ts
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
import type { EventEmitter } from '../core/events';
export declare function createControls(player: Player, mountPoint: HTMLElement, lifecycle?: LifecycleManager, state?: StateManager, events?: EventEmitter): void;
