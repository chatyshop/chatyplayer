/**
 * ChatyPlayer v1.0
 * Video Format Detection Utility
 * ----------------------------------------
 * - Safe source validation
 * - Detects supported formats
 * - Prevents unsafe URL injection
 * - Uses native canPlayType
 */
export type VideoFormat = 'mp4' | 'webm' | 'ogg';
export interface VideoSources {
    mp4?: string;
    webm?: string;
    ogg?: string;
}
/**
 * Check if browser supports format
 */
export declare function isFormatSupported(format: VideoFormat): boolean;
/**
 * Return available & supported formats
 */
export declare function getSupportedFormats(sources: VideoSources): VideoFormat[];
/**
 * Select best playable source
 * Priority: mp4 → webm → ogg
 */
export declare function selectBestSource(sources: VideoSources): {
    format: VideoFormat;
    src: string;
} | null;
/**
 * Validate and sanitize sources object
 */
export declare function sanitizeSources(sources: unknown): VideoSources;
