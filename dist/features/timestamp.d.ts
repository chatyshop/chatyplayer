/**
 * ChatyPlayer v1.0
 * Timestamp Share Feature
 * ----------------------------------------
 * - Parse ?t= or #t=
 * - Supports 120, 1m30s formats
 * - Safe input validation
 * - No DOM injection
 * - Lifecycle safe
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
export declare function initTimestampFeature(player: Player, lifecycle?: LifecycleManager): {
    getTimestampLink: () => string | null;
};
