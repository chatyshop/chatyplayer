/**
 * ChatyPlayer v1.0
 * Theater Mode Feature
 * ----------------------------------------
 * Keeps theatre as a layout mode rather than an immersive page lock.
 */

import type { Player } from '../core/Player'
import type { EventEmitter } from '../core/events'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'

export function initTheaterFeature(
  player: Player,
  lifecycle?: LifecycleManager,
  state?: StateManager,
  events?: EventEmitter
) {
  let active = false

  const enableTheatre = () => {
    if (active) return
    active = true

    state?.set('theater', true)
    events?.emit('theatre', true)
  }

  const disableTheatre = () => {
    if (!active) return
    active = false

    state?.set('theater', false)
    events?.emit('theatre', false)
  }

  player.getEvents().on('modechange', ({ next }) => {
    if (next === 'theatre') {
      enableTheatre()
    } else {
      disableTheatre()
    }
  })

  player.toggleTheatre = () => {
    player.setMode(player.getMode() === 'theatre' ? 'normal' : 'theatre')
  }

  lifecycle?.registerCleanup(() => {
    disableTheatre()
  })

  return {
    enableTheatre,
    disableTheatre
  }
}
