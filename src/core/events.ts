/**
 * ChatyPlayer v1.0
 * Secure Typed EventEmitter (Production Ready)
 * ----------------------------------------
 * - Strict TypeScript safe
 * - Fully aligned with Player + Subtitles
 * - No unsafe mapped-type variance
 * - Memory leak safe
 * - Destroy safe
 * - Clean unsubscribe
 */

export type PlayerEventMap = {
  ready: void;
  play: void;
  pause: void;
  ended: void;
  timeupdate: number;
  loadedmetadata: number;
  error: void;
  fullscreenchange: boolean;
  pipchange: boolean;
  destroy: void;
  subtitlechange: string | null; // ✅ REQUIRED
};

type EventKey = keyof PlayerEventMap;

type EventHandler<K extends EventKey> =
  PlayerEventMap[K] extends void
    ? () => void
    : (payload: PlayerEventMap[K]) => void;

export class EventEmitter {
  private listeners = new Map<EventKey, Set<unknown>>();
  private destroyed = false;

  /* =========================================
     Subscribe
  ========================================= */

  public on<K extends EventKey>(
    event: K,
    handler: EventHandler<K>
  ): () => void {
    if (this.destroyed) {
      console.warn('[ChatyPlayer] Cannot subscribe. Player destroyed.');
      return () => {};
    }

    if (typeof handler !== 'function') {
      throw new Error('[ChatyPlayer] Event handler must be a function.');
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const handlers = this.listeners.get(event)!;
    handlers.add(handler);

    return () => this.off(event, handler);
  }

  /* =========================================
     Unsubscribe
  ========================================= */

  public off<K extends EventKey>(
    event: K,
    handler: EventHandler<K>
  ): void {
    if (this.destroyed) return;

    const handlers = this.listeners.get(event);
    if (!handlers) return;

    handlers.delete(handler);

    if (handlers.size === 0) {
      this.listeners.delete(event);
    }
  }

  /* =========================================
     Emit
  ========================================= */

  public emit<K extends EventKey>(
    event: K,
    payload?: PlayerEventMap[K]
  ): void {
    if (this.destroyed) return;

    const handlers = this.listeners.get(event);
    if (!handlers) return;

    handlers.forEach((rawHandler) => {
      try {
        const handler = rawHandler as EventHandler<K>;

        if (payload !== undefined) {
          (handler as (arg: PlayerEventMap[K]) => void)(payload);
        } else {
          (handler as () => void)();
        }
      } catch (error) {
        console.error(
          `[ChatyPlayer] Error in "${String(event)}" handler:`,
          error
        );
      }
    });
  }

  /* =========================================
     Remove All
  ========================================= */

  public removeAll(): void {
    this.listeners.clear();
  }

  /* =========================================
     Destroy
  ========================================= */

  public destroy(): void {
    if (this.destroyed) return;

    this.removeAll();
    this.destroyed = true;
  }
}