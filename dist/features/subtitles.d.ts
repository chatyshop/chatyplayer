/**
 * ChatyPlayer v2.0
 * Subtitles Feature (Production Ready - Final Stable)
 * subtitles.ts
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
import type { EventEmitter } from '../core/events';
export interface SubtitleTrackConfig {
    src: string;
    label: string;
    srclang: string;
    default?: boolean;
}
export declare function initSubtitlesFeature(player: Player, _tracks?: SubtitleTrackConfig[], lifecycle?: LifecycleManager, state?: StateManager, events?: EventEmitter): {
    enableSubtitle: (srclang: string) => Promise<void>;
    disableSubtitles: () => void;
    getAvailableSubtitles: () => string[];
};
