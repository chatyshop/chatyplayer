/**
 * ChatyPlayer v1.0
 * thumbnail.ts
 * Timeline Thumbnail Renderer (Production Ready - Final Stable)
 */
import type { Player } from '../core/Player';
export type ThumbnailUpdater = (time: number, position: number) => void;
export declare function createThumbnail(player: Player, container: HTMLElement): ThumbnailUpdater | null;
