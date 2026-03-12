/**
 * ChatyPlayer v1.0
 * Public API Wrapper
 * ----------------------------------------
 * - Safe controlled interface
 * - Input validation
 * - No direct internal exposure
 * - Event subscription
 */

import type { Player } from '../core/Player';
import type { EventEmitter } from '../core/events';

export interface ChatyPlayerAPI {
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
  toggleFullscreen(): void;
  toggleTheater(): void;
  togglePiP(): void;
  setSpeed(rate: number): void;
  setQuality(type: 'mp4' | 'webm' | 'ogg'): void;
  enableSubtitle(lang: string): void;
  disableSubtitles(): void;
  captureScreenshot(): string | null;
  downloadScreenshot(): void;
  getTimestampLink(): string | null;
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
}

export function createPublicAPI(
  player: Player,
  events?: EventEmitter
): ChatyPlayerAPI {

  const video = player.getVideo();

  const safeNumber = (value: any, fallback = 0): number => {
    const num = Number(value);
    return isFinite(num) ? num : fallback;
  };

  return {
    async play() {
      try {
        await player.play();
      } catch {
        // Autoplay restriction, fail silently
      }
    },

    pause() {
      player.pause();
    },

    seek(time: number) {
      const duration = video.duration || 0;
      const safeTime = Math.min(
        Math.max(0, safeNumber(time)),
        duration
      );
      player.seek(safeTime);
    },

    setVolume(volume: number) {
      const safeVol = Math.min(
        Math.max(0, safeNumber(volume)),
        1
      );
      video.volume = safeVol;
    },

    mute() {
      video.muted = true;
    },

    unmute() {
      video.muted = false;
    },

    toggleFullscreen() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.toggleFullscreen === 'function') {
        anyPlayer.toggleFullscreen();
      }
    },

    toggleTheater() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.toggleTheater === 'function') {
        anyPlayer.toggleTheater();
      }
    },

    togglePiP() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.togglePiP === 'function') {
        anyPlayer.togglePiP();
      }
    },

    setSpeed(rate: number) {
      const anyPlayer = player as any;
      const safeRate = Math.min(
        Math.max(0.25, safeNumber(rate)),
        4
      );

      if (typeof anyPlayer.setSpeed === 'function') {
        anyPlayer.setSpeed(safeRate);
      }
    },

    setQuality(type: 'mp4' | 'webm' | 'ogg') {
      const anyPlayer = player as any;
      if (typeof anyPlayer.setQuality === 'function') {
        anyPlayer.setQuality(type);
      }
    },

    enableSubtitle(lang: string) {
      const anyPlayer = player as any;
      if (typeof anyPlayer.enableSubtitle === 'function') {
        anyPlayer.enableSubtitle(lang);
      }
    },

    disableSubtitles() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.disableSubtitles === 'function') {
        anyPlayer.disableSubtitles();
      }
    },

    captureScreenshot() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.captureScreenshot === 'function') {
        return anyPlayer.captureScreenshot();
      }
      return null;
    },

    downloadScreenshot() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.downloadScreenshot === 'function') {
        anyPlayer.downloadScreenshot();
      }
    },

    getTimestampLink() {
      const anyPlayer = player as any;
      if (typeof anyPlayer.getTimestampLink === 'function') {
        return anyPlayer.getTimestampLink();
      }
      return null;
    },

    on(event: string, handler: (...args: any[]) => void) {
      if (!events) return;
      if (typeof handler !== 'function') return;
      events.on(event as any, handler);
    },

    off(event: string, handler: (...args: any[]) => void) {
      if (!events) return;
      if (typeof handler !== 'function') return;
      events.off(event as any, handler);
    }
  };
}