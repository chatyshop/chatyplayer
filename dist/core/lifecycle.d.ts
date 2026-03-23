/**
 * ChatyPlayer v1.0
 * Lifecycle Manager (Production Ready - Mobile Optimized)
 * ----------------------------------------
 * - Handles mount & destroy flow
 * - Prevents double initialization
 * - Prevents memory leaks
 * - Coordinates cleanup across modules
 * - Mobile optimized (iOS Safari safe)
 * - Battery efficient (visibility + page lifecycle)
 */
import type { Player } from './Player';
import type { StateManager } from './state';
import type { EventEmitter } from './events';
export declare class LifecycleManager {
    private mounted;
    private destroyed;
    private cleanupTasks;
    /**
     * Mark player as mounted
     */
    markMounted(): void;
    /**
     * Register cleanup callback
     * Used by features/modules to auto-clean on destroy
     */
    registerCleanup(task: () => void): void;
    /**
     * Attach mobile lifecycle optimizations
     */
    attachMobileLifecycle(player: Player): void;
    /**
     * Execute full destruction lifecycle
     */
    destroy(player: Player, state?: StateManager, events?: EventEmitter): void;
    /**
     * Lifecycle state checks
     */
    isMounted(): boolean;
    isDestroyed(): boolean;
}
