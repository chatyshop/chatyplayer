/**
 * ChatyPlayer v1.0
 * Chapters Feature (Production Ready)
 * ----------------------------------------
 * - Chapter segments (range based)
 * - Auto highlight current chapter
 * - Click to seek
 * - Keyboard accessible
 * - Timestamp validation
 * - Sorted chapters
 * - Lifecycle safe cleanup
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
export interface Chapter {
    time: number;
    title: string;
}
export declare function initChaptersFeature(player: Player, chapters: Chapter[], timelineElement: HTMLElement, lifecycle?: LifecycleManager, state?: StateManager): {
    refresh: () => void;
};
