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
export declare const CSS_CLASSES: Readonly<{
    ROOT: "chatyplayer-root";
    CONTROLS: "chatyplayer-controls";
    TIMELINE: "chatyplayer-timeline";
    SETTINGS_PANEL: "chatyplayer-settings-panel";
    MINI_MODE: "chatyplayer-mini";
    THEATER_MODE: "chatyplayer-theater";
    CHAPTER_MARKER: "chatyplayer-chapter-marker";
    TOOLTIP: "chatyplayer-tooltip";
}>;
/**
 * Event Names
 */
export declare const EVENTS: Readonly<{
    PLAY: "play";
    PAUSE: "pause";
    ENDED: "ended";
    SEEKED: "seeked";
    TIME_UPDATE: "timeupdate";
    FULLSCREEN_CHANGE: "fullscreenchange";
    PIP_CHANGE: "pipchange";
    THEATER_CHANGE: "theaterchange";
    SPEED_CHANGE: "speedchange";
    QUALITY_CHANGE: "qualitychange";
    SUBTITLE_CHANGE: "subtitlechange";
}>;
/**
 * Timing Constants
 */
export declare const TIMING: Readonly<{
    DOUBLE_TAP_DELAY: 300;
    SEEK_STEP: 5;
    GESTURE_SEEK_STEP: 10;
    VOLUME_STEP: 0.05;
    SAVE_INTERVAL: 5000;
}>;
/**
 * Resume Feature Limits
 */
export declare const RESUME_LIMITS: Readonly<{
    MIN_DURATION: 30;
    END_THRESHOLD: 5;
}>;
/**
 * Playback Speed Limits
 */
export declare const SPEED_LIMITS: Readonly<{
    MIN: 0.25;
    MAX: 4;
    DEFAULT: 1;
}>;
/**
 * Volume Limits
 */
export declare const VOLUME_LIMITS: Readonly<{
    MIN: 0;
    MAX: 1;
    DEFAULT: 1;
}>;
/**
 * Supported Video Formats
 */
export declare const VIDEO_FORMATS: readonly ["mp4", "webm", "ogg"];
/**
 * Allowed Protocols for Sources
 */
export declare const ALLOWED_PROTOCOLS: readonly string[];
/**
 * Storage Namespace
 */
export declare const STORAGE: Readonly<{
    PREFIX: "chatyplayer:";
}>;
