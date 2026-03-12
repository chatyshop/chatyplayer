/**
 * ChatyPlayer v1.0
 * Entry Point
 * ----------------------------------------
 * - Auto initializes all .chaty-player elements
 * - Safe dataset parsing
 * - Prevents double initialization
 * - Supports manual initialization
 */

import { Player } from './core/Player';
import { parseConfig } from './core/config';

declare global {
  interface Window {
    ChatyPlayer?: any;
  }
}

const PLAYER_CLASS = 'chaty-player';
const INIT_ATTR = 'data-chaty-initialized';

/**
 * Securely initialize a single player instance
 */
function initPlayer(container: HTMLElement): Player | null {
  try {
    // Prevent duplicate initialization
    if (container.hasAttribute(INIT_ATTR)) {
      return null;
    }

    // Parse sanitized config
    const config = parseConfig(container);

    // Create player instance
    const player = new Player(container, config);

    // Mark as initialized
    container.setAttribute(INIT_ATTR, 'true');

    return player;
  } catch (error) {
    console.error('[ChatyPlayer] Initialization failed:', error);
    return null;
  }
}

/**
 * Auto-initialize all players on page
 */
function autoInit(): void {
  if (typeof document === 'undefined') return;

  const elements = document.querySelectorAll<HTMLElement>(`.${PLAYER_CLASS}`);

  elements.forEach((el) => {
    initPlayer(el);
  });
}

/**
 * Manual initialization API
 */
function create(container: HTMLElement): Player | null {
  if (!(container instanceof HTMLElement)) {
    console.error('[ChatyPlayer] Invalid container provided.');
    return null;
  }

  return initPlayer(container);
}

/**
 * Initialize when DOM is ready
 */
function onReady(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit, { once: true });
  } else {
    autoInit();
  }
}

/**
 * Expose global API
 */
function exposeGlobal(): void {
  if (typeof window === 'undefined') return;

  window.ChatyPlayer = {
    create,
    version: '1.0.0'
  };
}

/**
 * Bootstrap
 */
(function bootstrap() {
  try {
    onReady();
    exposeGlobal();
  } catch (error) {
    console.error('[ChatyPlayer] Bootstrap error:', error);
  }
})();