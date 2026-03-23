/**
 * ChatyPlayer v1.0
 * Public API Wrapper (Production Ready - Subtitles Integrated)
 * publicAPI.ts
 */
import type { Player } from '../core/Player';
import type { EventEmitter, PlayerEventMap } from '../core/events';
type EventKey = keyof PlayerEventMap;
export interface ChatyPlayerAPI {
    play(): Promise<void>;
    pause(): void;
    seek(time: number): void;
    setVolume(volume: number): void;
    mute(): void;
    unmute(): void;
    toggleFullscreen(): void;
    toggleTheatre(): void;
    toggleMini(): void;
    togglePiP(): void;
    setSpeed(rate: number): void;
    setQuality(label: string): void;
    enableSubtitle(lang: string): void;
    disableSubtitles(): void;
    getAvailableSubtitles(): string[];
    getCurrentSubtitle?: () => string | null;
    captureScreenshot(): string | null;
    downloadScreenshot(): void;
    getTimestampLink(): string | null;
    on<K extends EventKey>(event: K, handler: PlayerEventMap[K] extends void ? () => void : (payload: PlayerEventMap[K]) => void): void;
    off<K extends EventKey>(event: K, handler: PlayerEventMap[K] extends void ? () => void : (payload: PlayerEventMap[K]) => void): void;
}
export declare function createPublicAPI(player: Player, events?: EventEmitter): ChatyPlayerAPI;
export {};
