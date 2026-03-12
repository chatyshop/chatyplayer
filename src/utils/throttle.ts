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

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): ThrottledFunction<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }

  const delay = Math.max(0, Number(wait) || 0);
  const leading = options?.leading !== false;
  const trailing = options?.trailing !== false;

  let timer: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: any = null;
  let lastCallTime = 0;

  const invoke = () => {
    if (!lastArgs) return;

    fn.apply(lastContext, lastArgs);

    lastArgs = null;
    lastContext = null;
    lastCallTime = Date.now();
  };

  const startTimer = () => {
    timer = window.setTimeout(() => {
      timer = null;

      if (trailing && lastArgs) {
        invoke();
      }
    }, delay);
  };

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }

    const remaining = delay - (now - lastCallTime);

    lastArgs = args;
    lastContext = this;

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      invoke();
    } else if (!timer && trailing) {
      startTimer();
    }
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    lastArgs = null;
    lastContext = null;
    lastCallTime = 0;
  };

  return throttled;
}