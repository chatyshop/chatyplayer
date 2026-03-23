/**
 * ChatyPlayer v1.0
 * Core Player Engine (Production Ready - Clean Mode System)
 * Player.ts
 * ----------------------------------------
 * - Single source of truth for mode
 * - No fullscreen API inside Player
 * - Feature-driven architecture
 * - Safe DOM handling
 * - Lifecycle safe
 */
import { PlayerConfig } from './config';
import { EventEmitter } from './events';
type PlayerMode = 'normal' | 'mini' | 'theatre' | 'fullscreen';
export declare class Player {
    private container;
    private video;
    private wrapper;
    private timelineLayer;
    private config;
    private events;
    private state;
    private lifecycle;
    private destroyed;
    private activeFeatures;
    private hideTimeout?;
    private mode;
    getMode(): PlayerMode;
    private handleUIShow;
    private handlePause;
    private handlePlay;
    readonly api: import("../api/publicAPI").ChatyPlayerAPI;
    constructor(container: HTMLElement, config: PlayerConfig);
    private createVideoElement;
    private resolveInitialSource;
    private mount;
    setMode(next: PlayerMode): void;
    toggleMini(): void;
    toggleTheatre(): void;
    toggleFullscreen(): void;
    private initMiniPlayer;
    private initAutoHide;
    private initCoreEvents;
    private initFeatures;
    play(): Promise<void>;
    pause(): void;
    toggle(): void;
    seek(t: number): void;
    setVolume(v: number): void;
    setSpeed(r: number): void;
    getVideo(): HTMLVideoElement;
    getContainer(): HTMLElement;
    getTimeline(): HTMLElement;
    getConfig(): PlayerConfig;
    getEvents(): EventEmitter;
    destroy(): void;
}
export {};
