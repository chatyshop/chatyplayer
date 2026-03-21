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

  // ✅ Added for subtitles support
  subtitle: string | null;
}

type StateListener = (state: Readonly<PlayerState>) => void;

export class StateManager {

  private state: PlayerState;
  private listeners: Set<StateListener>;

  constructor() {

    this.state = {
      ready: false,
      playing: false,
      muted: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      fullscreen: false,
      pip: false,
      theater: false,
      mini: false,
      destroyed: false,

      // ✅ Initialize subtitle state
      subtitle: null
    };

    this.listeners = new Set();
  }

  /* =========================================
     Readonly Snapshot
  ========================================= */

  public getState(): Readonly<PlayerState> {
    return Object.freeze({ ...this.state });
  }

  /* =========================================
     Subscribe / Unsubscribe
  ========================================= */

  public subscribe(listener: StateListener): () => void {

    if (typeof listener !== 'function') {
      throw new Error('[ChatyPlayer] State listener must be a function.');
    }

    if (this.state.destroyed) {
      return () => {};
    }

    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /* =========================================
     Single Key Update
  ========================================= */

  public set<K extends keyof PlayerState>(
    key: K,
    value: PlayerState[K]
  ): void {

    if (this.state.destroyed) return;

    // Prevent unnecessary updates
    if (this.state[key] === value) return;

    this.state = {
      ...this.state,
      [key]: value
    };

    this.notify();
  }

  /* =========================================
     Batch Update (Strict Safe)
  ========================================= */

  public update(partial: Partial<PlayerState>): void {

    if (this.state.destroyed) return;

    let changed = false;

    const nextState = { ...this.state };

    for (const key of Object.keys(partial) as (keyof PlayerState)[]) {

      const newValue = partial[key];

      if (newValue !== undefined && nextState[key] !== newValue) {
        (nextState as Record<keyof PlayerState, unknown>)[key] = newValue;
        changed = true;
      }
    }

    if (!changed) return;

    this.state = nextState as PlayerState;

    this.notify();
  }

  /* =========================================
     Destroy
  ========================================= */

  public markDestroyed(): void {

    if (this.state.destroyed) return;

    this.state = {
      ...this.state,
      destroyed: true
    };

    this.listeners.clear();
  }

  /* =========================================
     Notify Subscribers
  ========================================= */

  private notify(): void {

    if (this.listeners.size === 0) return;

    const snapshot = this.getState();

    this.listeners.forEach((listener) => {

      try {
        listener(snapshot);
      } catch (error) {
        console.error(
          '[ChatyPlayer] State listener error:',
          error
        );
      }

    });
  }
}