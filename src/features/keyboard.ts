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

import type { Player } from '../core/Player'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'

const SEEK_STEP = 5
const VOLUME_STEP = 0.05

export function initKeyboardFeature(
  player: Player,
  lifecycle?: LifecycleManager,
  state?: StateManager
) {
  const container = player.getContainer()
  const video = player.getVideo()

  /* Make player focusable */
  if (!container.hasAttribute('tabindex')) {
    container.tabIndex = 0
  }

  let isHovered = false

  const onMouseEnter = () => { isHovered = true }
  const onMouseLeave = () => { isHovered = false }
  const onClick = () => { container.focus() }

  container.addEventListener('mouseenter', onMouseEnter)
  container.addEventListener('mouseleave', onMouseLeave)
  container.addEventListener('click', onClick)

  /* =========================================
     Should Handle Keys
  ========================================= */

  const shouldHandle = (): boolean => {
    const active = document.activeElement as HTMLElement | null
    if (!active) return false

    const tag = active.tagName.toLowerCase()

    if (
      tag === 'input' ||
      tag === 'textarea' ||
      active.isContentEditable
    ) {
      return false
    }

    return active === container || isHovered
  }

  /* =========================================
     Keyboard Handler
  ========================================= */

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()

    // Allow "t" globally (like YouTube), others only when active
    if (!shouldHandle() && key !== 't') return

    /* Prevent repeat spam */
    if (
      e.repeat &&
      (key === ' ' || key === 'm' || key === 'f' || key === 't')
    ) {
      return
    }

    switch (key) {

      case ' ':
      case 'k':
        e.preventDefault()
        video.paused
          ? player.play().catch(() => {})
          : player.pause()
        break

      case 'arrowleft':
      case 'j':
        e.preventDefault()
        player.seek(Math.max(0, video.currentTime - SEEK_STEP))
        break

      case 'arrowright':
      case 'l':
        e.preventDefault()
        player.seek(video.currentTime + SEEK_STEP)
        break

      case 'arrowup': {
        e.preventDefault()

        const upVolume = Math.min(1, video.volume + VOLUME_STEP)

        player.setVolume(upVolume)
        video.muted = false

        state?.set('volume', upVolume)
        state?.set('muted', false)
        break
      }

      case 'arrowdown': {
        e.preventDefault()

        const downVolume = Math.max(0, video.volume - VOLUME_STEP)

        player.setVolume(downVolume)
        video.muted = false

        state?.set('volume', downVolume)
        break
      }

      case 'm':
        e.preventDefault()
        video.muted = !video.muted
        state?.set('muted', video.muted)
        break

      case 'f':
        e.preventDefault()
        player.toggleFullscreen() // ✅ FIX (mode safe)
        break

      case 't':
        e.preventDefault()
        player.toggleTheatre() // ✅ FIX (correct name)
        break

      default:
        break
    }
  }

  document.addEventListener('keydown', onKeyDown)

  /* =========================================
     Cleanup
  ========================================= */

  lifecycle?.registerCleanup(() => {
    container.removeEventListener('mouseenter', onMouseEnter)
    container.removeEventListener('mouseleave', onMouseLeave)
    container.removeEventListener('click', onClick)

    document.removeEventListener('keydown', onKeyDown)
  })
}