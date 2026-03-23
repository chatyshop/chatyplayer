/**
 * ChatyPlayer v1.0
 * Internal State Management (Production Ready - Final Stable)
 * ----------------------------------------
 * - Fully strict TypeScript safe
 * - Immutable external access
 * - No unsafe casts
 * - No memory leaks
 * - Defensive updates
 * - Prototype pollution safe
 */
export interface PlayerState {
    ready: boolean;
    playing: boolean;
    muted: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    fullscreen: boolean;
    pip: boolean;
    theater: boolean;
    mini: boolean;
    destroyed: boolean;
    subtitle: string | null;
}
type StateListener = (state: Readonly<PlayerState>) => void;
export declare class StateManager {
    private state;
    private listeners;
    constructor();
    getState(): Readonly<PlayerState>;
    get<K extends keyof PlayerState>(key: K): PlayerState[K];
    subscribe(listener: StateListener): () => void;
    set<K extends keyof PlayerState>(key: K, value: PlayerState[K]): void;
    update(partial: Partial<PlayerState>): void;
    markDestroyed(): void;
    private notify;
}
export {};
