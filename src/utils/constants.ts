/**
 * ChatyPlayer v1.0
 * Global Constants
 * ----------------------------------------
 * - Centralized shared constants
 * - Immutable
 * - No side effects
 */

/**
 * CSS Class Names
 */
export const CSS_CLASSES = Object.freeze({
  ROOT: 'chatyplayer-root',
  CONTROLS: 'chatyplayer-controls',
  TIMELINE: 'chatyplayer-timeline',
  SETTINGS_PANEL: 'chatyplayer-settings-panel',
  MINI_MODE: 'chatyplayer-mini',
  THEATER_MODE: 'chatyplayer-theater',
  CHAPTER_MARKER: 'chatyplayer-chapter-marker',
  TOOLTIP: 'chatyplayer-tooltip'
});

/**
 * Event Names
 */
export const EVENTS = Object.freeze({
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  SEEKED: 'seeked',
  TIME_UPDATE: 'timeupdate',
  FULLSCREEN_CHANGE: 'fullscreenchange',
  PIP_CHANGE: 'pipchange',
  THEATER_CHANGE: 'theaterchange',
  SPEED_CHANGE: 'speedchange',
  QUALITY_CHANGE: 'qualitychange',
  SUBTITLE_CHANGE: 'subtitlechange'
});

/**
 * Timing Constants
 */
export const TIMING = Object.freeze({
  DOUBLE_TAP_DELAY: 300,
  SEEK_STEP: 5,
  GESTURE_SEEK_STEP: 10,
  VOLUME_STEP: 0.05,
  SAVE_INTERVAL: 5000
});

/**
 * Resume Feature Limits
 */
export const RESUME_LIMITS = Object.freeze({
  MIN_DURATION: 30,
  END_THRESHOLD: 5
});

/**
 * Playback Speed Limits
 */
export const SPEED_LIMITS = Object.freeze({
  MIN: 0.25,
  MAX: 4,
  DEFAULT: 1
});

/**
 * Volume Limits
 */
export const VOLUME_LIMITS = Object.freeze({
  MIN: 0,
  MAX: 1,
  DEFAULT: 1
});

/**
 * Supported Video Formats
 */
export const VIDEO_FORMATS = Object.freeze([
  'mp4',
  'webm',
  'ogg'
] as const);

/**
 * Allowed Protocols for Sources
 */
export const ALLOWED_PROTOCOLS = Object.freeze([
  'http:',
  'https:',
  'blob:',
  ''
]);

/**
 * Storage Namespace
 */
export const STORAGE = Object.freeze({
  PREFIX: 'chatyplayer:'
});