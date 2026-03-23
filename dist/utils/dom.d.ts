/**
 * ChatyPlayer v1.0
 * DOM Utilities
 * dom.ts
 * ----------------------------------------
 * - Safe element creation
 * - Safe attribute handling
 * - Safe class manipulation
 * - No innerHTML usage
 * - No unsafe injection
 */
type Attributes = Record<string, string | number | boolean | undefined>;
/**
 * Create element safely (no HTML parsing)
 */
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, options?: {
    className?: string;
    attributes?: Attributes;
    text?: string;
}): HTMLElementTagNameMap[K];
/**
 * Set attributes safely
 */
export declare function setAttributes(element: HTMLElement, attributes: Attributes): void;
/**
 * Add class safely
 */
export declare function addClass(element: HTMLElement, className: string): void;
/**
 * Remove class safely
 */
export declare function removeClass(element: HTMLElement, className: string): void;
/**
 * Toggle class safely
 */
export declare function toggleClass(element: HTMLElement, className: string, force?: boolean): void;
/**
 * Safe query selector within container
 */
export declare function query(container: HTMLElement, selector: string): HTMLElement | null;
/**
 * Remove all children safely
 */
export declare function clearChildren(element: HTMLElement): void;
/**
 * Clamp numeric value
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Safe focus helper
 */
export declare function focusElement(element: HTMLElement | null): void;
export {};
