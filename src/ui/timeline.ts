/**
 * ChatyPlayer v1.0
 * Timeline Module (Production Ready)
 * ----------------------------------------
 * - Seek bar
 * - Buffered progress
 * - Hover tooltip
 * - Optional thumbnail preview
 * - Preserves playback while seeking
 * - Prevents gesture conflicts
 * - Safe DOM creation
 * - Lifecycle-safe cleanup
 */

import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';

import { createTooltip } from './tooltip';
import { createThumbnail } from './thumbnail';

export function createTimeline(
  player: Player,
  mountPoint: HTMLElement,
  lifecycle?: LifecycleManager,
  state?: StateManager
): void {

  const video = player.getVideo();

  /* =========================================
     DOM CREATION
  ========================================= */

  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'chatyplayer-timeline';

  const progressWrapper = document.createElement('div');
  progressWrapper.className = 'chatyplayer-progress-wrapper';

  const bufferBar = document.createElement('div');
  bufferBar.className = 'chatyplayer-buffer';

  const progressBar = document.createElement('div');
  progressBar.className = 'chatyplayer-progress';

  const seekInput = document.createElement('input');
  seekInput.type = 'range';
  seekInput.min = '0';
  seekInput.max = '100';
  seekInput.step = '0.1';
  seekInput.value = '0';
  seekInput.className = 'chatyplayer-seek';
  seekInput.setAttribute('aria-label', 'Seek');

  progressWrapper.appendChild(bufferBar);
  progressWrapper.appendChild(progressBar);
  progressWrapper.appendChild(seekInput);

  timelineContainer.appendChild(progressWrapper);
  mountPoint.appendChild(timelineContainer);

  /* =========================================
     TOOLTIP + THUMBNAIL
  ========================================= */

  const updateTooltip = createTooltip(player, progressWrapper, lifecycle);
  const updateThumbnail = createThumbnail(player, progressWrapper);

  /* =========================================
     INTERNAL STATE
  ========================================= */

  let isDragging = false;

  /* =========================================
     PROGRESS UPDATE
  ========================================= */

  const updateProgress = (): void => {

    const duration = video.duration;

    if (!Number.isFinite(duration) || duration <= 0) return;

    const current = video.currentTime;
    const percent = (current / duration) * 100;

    progressBar.style.width = `${percent}%`;

    if (!isDragging) {
      seekInput.value = String(percent);
    }

    state?.set?.('currentTime', current);
    state?.set?.('duration', duration);
  };

  const updateBuffer = (): void => {

    const duration = video.duration;

    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      video.buffered.length === 0
    ) return;

    try {

      const bufferedEnd =
        video.buffered.end(video.buffered.length - 1);

      const percent = (bufferedEnd / duration) * 100;

      bufferBar.style.width = `${percent}%`;

    } catch {
      // ignore buffered range errors
    }
  };

  /* =========================================
     SEEK HANDLING
  ========================================= */

  const onSeekInput = (): void => {

    const duration = video.duration;

    if (!Number.isFinite(duration) || duration <= 0) return;

    const percent = parseFloat(seekInput.value);

    if (!Number.isFinite(percent)) return;

    const wasPlaying = !video.paused;

    const newTime = (percent / 100) * duration;

    player.seek(newTime);

    if (wasPlaying) {
      player.play().catch(() => {});
    }
  };

  const onDragStart = (): void => {
    isDragging = true;
  };

  const onDragEnd = (): void => {
    isDragging = false;
  };

  /* =========================================
     HOVER PREVIEW (Tooltip + Thumbnail)
  ========================================= */

  const onMouseMove = (event: MouseEvent): void => {

    const rect = progressWrapper.getBoundingClientRect();

    if (!rect.width) return;

    const offsetX = event.clientX - rect.left;

    const percent = Math.min(
      Math.max(offsetX / rect.width, 0),
      1
    );

    const duration = video.duration || 0;

    if (duration <= 0) return;

    const previewTime = percent * duration;

    updateTooltip(previewTime, offsetX);

    if (updateThumbnail) {
      updateThumbnail(previewTime, offsetX);
    }
  };

  const onMouseLeave = (): void => {
    updateTooltip(null);
  };

  progressWrapper.addEventListener('mousemove', onMouseMove);
  progressWrapper.addEventListener('mouseleave', onMouseLeave);

  /* =========================================
     EVENT BINDING
  ========================================= */

  seekInput.addEventListener('input', onSeekInput);

  seekInput.addEventListener('mousedown', onDragStart);
  seekInput.addEventListener('touchstart', onDragStart);

  seekInput.addEventListener('mouseup', onDragEnd);
  seekInput.addEventListener('touchend', onDragEnd);

  // prevent gesture conflicts
  seekInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  /* =========================================
     VIDEO EVENTS
  ========================================= */

  const onLoadedMetadata = (): void => {
    updateProgress();
    updateBuffer();
  };

  const onTimeUpdate = (): void => {
    updateProgress();
  };

  const onProgress = (): void => {
    updateBuffer();
  };

  video.addEventListener('loadedmetadata', onLoadedMetadata);
  video.addEventListener('timeupdate', onTimeUpdate);
  video.addEventListener('progress', onProgress);

  /* =========================================
     CLEANUP
  ========================================= */

  lifecycle?.registerCleanup(() => {

    seekInput.removeEventListener('input', onSeekInput);

    seekInput.removeEventListener('mousedown', onDragStart);
    seekInput.removeEventListener('touchstart', onDragStart);

    seekInput.removeEventListener('mouseup', onDragEnd);
    seekInput.removeEventListener('touchend', onDragEnd);

    progressWrapper.removeEventListener('mousemove', onMouseMove);
    progressWrapper.removeEventListener('mouseleave', onMouseLeave);

    video.removeEventListener('loadedmetadata', onLoadedMetadata);
    video.removeEventListener('timeupdate', onTimeUpdate);
    video.removeEventListener('progress', onProgress);
  });
}