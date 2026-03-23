/**
 * ChatyPlayer v1.0
 * Throttle Utility
 * throttle.ts
 * ----------------------------------------
 * - Prevents high-frequency execution
 * - Supports leading & trailing
 * - Cancel support
 * - No memory leaks
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
}
export declare function throttle<T extends (...args: any[]) => any>(fn: T, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): ThrottledFunction<T>;
