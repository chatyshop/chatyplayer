/**
 * ChatyPlayer v1.0
 * Secure Config Parser (Production Ready)
 * ----------------------------------------
 * - Strict TypeScript safe
 * - SSR safe
 * - Sanitized inputs
 * - XSS safe URL handling
 * - Defaults applied
 * - Optional plugin support
 * - Thumbnail sprite support
 * - Multi-quality source support
 * - Chapter support
 */
import type { PlayerFeature } from '../types/Feature';
export interface VideoSource {
    src: string;
    label: string;
    type?: string;
}
export interface ThumbnailConfig {
    src: string;
    width: number;
    height: number;
    columns: number;
    rows: number;
    interval: number;
}
export interface Chapter {
    time: number;
    title: string;
}
export interface SubtitleTrack {
    src: string;
    label: string;
    srclang: string;
    default?: boolean;
}
export interface PlayerConfig {
    src?: string;
    mp4?: string;
    webm?: string;
    ogg?: string;
    sources?: VideoSource[];
    subtitles?: SubtitleTrack[];
    poster?: string;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    preload: 'none' | 'metadata' | 'auto';
    accentColor?: string;
    thumbnails?: ThumbnailConfig;
    features?: PlayerFeature[];
    chapters?: Chapter[];
}
export declare function parseConfig(container: HTMLElement): PlayerConfig;
