/**
 * ChatyPlayer v1.0
 * thumbnail.ts
 * Timeline Thumbnail Renderer (Production Ready)
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

  const thumb = document.createElement('div');

  thumb.className = 'chatyplayer-thumbnail';

  thumb.style.backgroundImage = `url("${src}")`;
  thumb.style.backgroundRepeat = 'no-repeat';
  thumb.style.width = `${width}px`;
  thumb.style.height = `${height}px`;
  thumb.style.display = 'none';

  container.appendChild(thumb);

  const maxFrames = columns * rows;

  const update: ThumbnailUpdater = (time, position) => {

    if (!Number.isFinite(time)) return;

    const frameIndex = Math.floor(time / interval);
    const safeIndex = Math.min(frameIndex, maxFrames - 1);

    const col = safeIndex % columns;
    const row = Math.floor(safeIndex / columns);

    const x = -(col * width);
    const y = -(row * height);

    thumb.style.backgroundPosition = `${x}px ${y}px`;

    // move thumbnail horizontally
    thumb.style.left = `${position}px`;

    thumb.style.display = 'block';
  };

  const hide = () => {
    thumb.style.display = 'none';
  };

  container.addEventListener('mouseleave', hide);

  return update;
}