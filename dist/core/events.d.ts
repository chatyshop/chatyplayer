/**
 * ChatyPlayer v1.0
 * Secure Typed EventEmitter (Production Ready - FINAL)
 * ----------------------------------------
 * - Strict TypeScript safe (no invalid emits)
 * - Payload-safe event system
 * - Memory leak safe
 * - Destroy safe
 * - Clean unsubscribe
 * - Fully compatible with Player.ts (Mode System Ready)
 */
export type PlayerMode = 'normal' | 'mini' | 'theatre' | 'fullscreen';
export type PlayerEventMap = {
    ready: void;
    play: void;
    pause: void;
    ended: void;
    timeupdate: number;
    loadedmetadata: number;
    error: MediaError | null;
    fullscreenchange: boolean;
    pipchange: boolean;
    destroy: void;
    subtitlechange: string | null;
    qualitychange: string;
    theatre: boolean;
    fullscreen: boolean;
    modechange: {
        prev: PlayerMode;
        next: PlayerMode;
    };
};
type EventKey = keyof PlayerEventMap;
type EventHandler<K extends EventKey> = PlayerEventMap[K] extends void ? () => void : (payload: PlayerEventMap[K]) => void;
export declare class EventEmitter {
    private listeners;
    private destroyed;
    on<K extends EventKey>(event: K, handler: EventHandler<K>): () => void;
    off<K extends EventKey>(event: K, handler: EventHandler<K>): void;
    emit<K extends EventKey>(event: K, ...args: PlayerEventMap[K] extends void ? [] : [PlayerEventMap[K]]): void;
    removeAll(): void;
    destroy(): void;
}
export {};
