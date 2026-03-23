/**
 * ChatyPlayer v1.0
 * Layout Builder
 * layout.ts
 * ----------------------------------------
 * - Creates DOM structure safely
 * - No innerHTML injection
 * - No dynamic HTML string rendering
 * - Accessible & modular
 */
import type { Player } from '../core/Player';
export interface PlayerLayout {
    root: HTMLElement;
    videoWrapper: HTMLElement;
    controlsLayer: HTMLElement;
    timelineLayer: HTMLElement;
    settingsLayer: HTMLElement;
    overlayLayer: HTMLElement;
}
/**
 * Create full player layout
 */
export declare function createLayout(player: Player): PlayerLayout;
