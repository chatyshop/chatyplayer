/**
 * ChatyPlayer v1.0
 * Layout Builder
 * layout.ts
 * ----------------------------------------
 * - Creates DOM structure safely
 * - No innerHTML injection
 * - No dynamic HTML string rendering
 * - Accessible & modular
 */

import type { Player } from '../core/Player';

export interface PlayerLayout {
  root: HTMLElement;
  videoWrapper: HTMLElement;
  controlsLayer: HTMLElement;
  timelineLayer: HTMLElement;
  settingsLayer: HTMLElement;
  overlayLayer: HTMLElement;
}

/**
 * Create full player layout
 */
export function createLayout(player: Player): PlayerLayout {
  const container = player.getContainer();
  const video = player.getVideo();

  // Root wrapper
  const root = document.createElement('div');
  root.className = 'chatyplayer-root';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'ChatyPlayer Video Player');

  // Video wrapper
  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'chatyplayer-video-wrapper';

  videoWrapper.appendChild(video);

  // Controls layer
  const controlsLayer = document.createElement('div');
  controlsLayer.className = 'chatyplayer-controls-layer';

  // Timeline layer
  const timelineLayer = document.createElement('div');
  timelineLayer.className = 'chatyplayer-timeline-layer';

  // Settings layer
  const settingsLayer = document.createElement('div');
  settingsLayer.className = 'chatyplayer-settings-layer';
  settingsLayer.setAttribute('aria-hidden', 'true');

  // Overlay layer (tooltip, mini-player indicators, etc.)
  const overlayLayer = document.createElement('div');
  overlayLayer.className = 'chatyplayer-overlay-layer';

  // Append layers
  root.appendChild(videoWrapper);
  root.appendChild(timelineLayer);
  root.appendChild(controlsLayer);
  root.appendChild(settingsLayer);
  root.appendChild(overlayLayer);

  // Replace container content safely
  container.innerHTML = '';
  container.appendChild(root);

  return {
    root,
    videoWrapper,
    controlsLayer,
    timelineLayer,
    settingsLayer,
    overlayLayer
  };
}