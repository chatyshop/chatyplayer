/**
 * ChatyPlayer v1.0
 * Environment Detection Utility
 * environment.ts
 * ----------------------------------------
 * - Safe SSR detection
 * - Feature detection (not UA sniffing)
 * - No unsafe global assumptions
 * - No side effects
 */
export interface EnvironmentInfo {
    isBrowser: boolean;
    isServer: boolean;
    isMobile: boolean;
    supportsTouch: boolean;
    supportsFullscreen: boolean;
    supportsPiP: boolean;
}
/**
 * Export frozen environment object
 */
export declare const Environment: EnvironmentInfo;
