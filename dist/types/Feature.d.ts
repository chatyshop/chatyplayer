/**
 * ChatyPlayer v1.0
 * Feature Plugin Interface
 * ----------------------------------------
 * Defines contract for all player features
 */
import type { Player } from '../core/Player';
export interface PlayerFeature {
    name: string;
    /**
     * Called when player initializes
     */
    init(player: Player): void;
    /**
     * Optional cleanup hook
     */
    destroy?(player: Player): void;
}
