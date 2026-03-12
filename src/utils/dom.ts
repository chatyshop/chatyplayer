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
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    attributes?: Attributes;
    text?: string;
  }
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (options?.className) {
    el.className = options.className;
  }

  if (options?.attributes) {
    setAttributes(el, options.attributes);
  }

  if (typeof options?.text === 'string') {
    el.textContent = options.text;
  }

  return el;
}

/**
 * Set attributes safely
 */
export function setAttributes(
  element: HTMLElement,
  attributes: Attributes
): void {
  Object.keys(attributes).forEach((key) => {
    const value = attributes[key];

    if (value === undefined || value === null) return;

    // Prevent unsafe attribute injection
    if (key.toLowerCase().startsWith('on')) return;

    element.setAttribute(key, String(value));
  });
}

/**
 * Add class safely
 */
export function addClass(
  element: HTMLElement,
  className: string
): void {
  if (!className) return;
  element.classList.add(className);
}

/**
 * Remove class safely
 */
export function removeClass(
  element: HTMLElement,
  className: string
): void {
  if (!className) return;
  element.classList.remove(className);
}

/**
 * Toggle class safely
 */
export function toggleClass(
  element: HTMLElement,
  className: string,
  force?: boolean
): void {
  if (!className) return;
  element.classList.toggle(className, force);
}

/**
 * Safe query selector within container
 */
export function query(
  container: HTMLElement,
  selector: string
): HTMLElement | null {
  try {
    return container.querySelector(selector);
  } catch {
    return null;
  }
}

/**
 * Remove all children safely
 */
export function clearChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Clamp numeric value
 */
export function clamp(
  value: number,
  min: number,
  max: number
): number {
  if (!isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Safe focus helper
 */
export function focusElement(element: HTMLElement | null): void {
  if (!element) return;
  if (typeof element.focus === 'function') {
    try {
      element.focus();
    } catch {
      // ignore
    }
  }
}