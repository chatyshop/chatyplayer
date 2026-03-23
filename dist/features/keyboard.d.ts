/**
 * ChatyPlayer v1.0
 * Keyboard Shortcuts Feature (Production Ready - Mode Safe)
 * ----------------------------------------
 * - Safe key handling
 * - Context-aware activation
 * - Prevents interfering with forms
 * - Stable focus handling
 * - Repeat-key protection
 * - Mode system compatible
 * - No unsafe casts
 * - Lifecycle safe cleanup
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
import type { StateManager } from '../core/state';
export declare function initKeyboardFeature(player: Player, lifecycle?: LifecycleManager, state?: StateManager): void;
