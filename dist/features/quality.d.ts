/**
 * ChatyPlayer v1.0
 * Quality Switching Feature (Production Ready - Optimized)
 */
import type { Player } from '../core/Player';
import type { PlayerConfig } from '../core/config';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
import type { EventEmitter } from '../core/events';
export type QualityLabel = string | 'auto';
export declare function initQualityFeature(player: Player, config: PlayerConfig, lifecycle?: LifecycleManager, state?: StateManager, events?: EventEmitter): {
    getAvailableQualities: () => QualityLabel[];
    getCurrentQuality: () => QualityLabel;
    setQuality: (label: QualityLabel) => void;
};
