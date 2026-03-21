/**
 * ChatyPlayer v1.0
 * thumbnail.ts
 * Timeline Thumbnail Renderer (Production Ready - Final Stable)
 */

import type { Player } from '../core/Player';
import type { ThumbnailConfig } from '../core/config';

export type ThumbnailUpdater = (
  time: number,
  position: number
) => void;

export function createThumbnail(
  player: Player,
  container: HTMLElement
): ThumbnailUpdater | null {

  const config = player.getConfig();

  if (!config.thumbnails) return null;

  const thumbs: ThumbnailConfig = config.thumbnails;

  const {
    src,
    width,
    height,
    columns,
    rows,
    interval
  } = thumbs;

  if (!src || !width || !height || !columns || !rows || !interval) {
    console.warn('[ChatyPlayer] Invalid thumbnail configuration.');
    return null;
  }

  /* ---------------------------
     Safe URL + preload
  --------------------------- */

  const safeSrc = encodeURI(src);

  const preload = new Image();
  preload.src = safeSrc;

  /* ---------------------------
     Thumbnail Element
  --------------------------- */

  const thumb = document.createElement('div');

  thumb.className = 'chatyplayer-thumbnail';

  thumb.style.position = 'absolute';
  thumb.style.pointerEvents = 'none';
  thumb.style.backgroundImage = `url("${safeSrc}")`;
  thumb.style.backgroundRepeat = 'no-repeat';
  thumb.style.width = `${width}px`;
  thumb.style.height = `${height}px`;
  thumb.style.display = 'none';
  thumb.style.willChange = 'transform';

  container.appendChild(thumb);

  const maxFrames = columns * rows;

  /* ---------------------------
     Update Logic
  --------------------------- */

  const update: ThumbnailUpdater = (time, position) => {

    if (!Number.isFinite(time)) return;

    const frameIndex = Math.floor(time / interval);
    const safeIndex = Math.min(frameIndex, maxFrames - 1);

    const col = safeIndex % columns;
    const row = Math.floor(safeIndex / columns);

    const x = -(col * width);
    const y = -(row * height);

    thumb.style.backgroundPosition = `${x}px ${y}px`;

    /* ---------- Clamp position ---------- */

    const containerWidth = container.offsetWidth;

    const safeLeft = Math.max(
      0,
      Math.min(position - width / 2, containerWidth - width)
    );

    /* ---------- GPU transform ---------- */

    thumb.style.transform = `translateX(${safeLeft}px)`;

    thumb.style.display = 'block';
  };

  /* ---------------------------
     Hide Logic (Desktop + Mobile)
  --------------------------- */

  const hide = () => {
    thumb.style.display = 'none';
  };

  container.addEventListener('mouseleave', hide);
  container.addEventListener('touchend', hide);
  container.addEventListener('touchcancel', hide);

  /* ---------------------------
     Return updater
  --------------------------- */

  return update;
}