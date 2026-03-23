/**
 * ChatyPlayer v1.0
 * Timeline Tooltip Module (Production Ready)
 * ----------------------------------------
 * - Hover timestamp preview
 * - Optional chapter title (only if thumbnails enabled)
 * - Safe DOM creation
 * - No HTML injection
 * - Strict TypeScript safe
 * - SSR safe
 * - Lifecycle-safe cleanup
 */
import type { Player } from '../core/Player';
import type { LifecycleManager } from '../core/lifecycle';
export type TooltipUpdater = (time: number | null, position?: number) => void;
export declare function createTooltip(player: Player, timelineElement: HTMLElement, lifecycle?: LifecycleManager): TooltipUpdater;
