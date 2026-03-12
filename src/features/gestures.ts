/**
 * ChatyPlayer v1.0
 * Gesture Controls Feature (Production Ready)
 */

import type { Player } from '../core/Player'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'

const DOUBLE_TAP_DELAY = 300
const SEEK_STEP = 10
const SWIPE_SENSITIVITY = 300
const SWIPE_THRESHOLD = 10

export function initGesturesFeature(
  player: Player,
  lifecycle?: LifecycleManager,
  state?: StateManager
): void {

  const container = player.getContainer()
  const video = player.getVideo()

  let lastTapTime = 0
  let clickTimer: number | null = null

  let touchStartY = 0
  let touchStartVolume = 0
  let isSwiping = false

  /* =========================================
     Utility: detect UI interaction safely
  ========================================= */

  const isInteractiveEvent = (e: Event): boolean => {

    const path = (e.composedPath?.() ?? []) as EventTarget[]

    for (const el of path) {

      if (!(el instanceof HTMLElement)) continue

      if (
        el.classList.contains('chatyplayer-controls-layer') ||
        el.classList.contains('chatyplayer-timeline-layer') ||
        el.classList.contains('chatyplayer-settings-panel') ||
        el.classList.contains('chatyplayer-subtitle-menu')
      ) {
        return true
      }

      if (
        el.tagName === 'BUTTON' ||
        el.tagName === 'INPUT' ||
        el.tagName === 'SELECT' ||
        el.tagName === 'TEXTAREA'
      ) {
        return true
      }

    }

    return false
  }

  /* =========================================
     Toggle Play/Pause
  ========================================= */

  const togglePlayback = () => {
    if (video.paused) {
      player.play().catch(() => {})
    } else {
      player.pause()
    }
  }

  /* =========================================
     Mouse Click
  ========================================= */

  const onClick = (e: MouseEvent): void => {

    if (isInteractiveEvent(e)) return

    const rect = container.getBoundingClientRect()
    const isLeft = e.clientX < rect.left + rect.width / 2

    if (clickTimer !== null) {

      window.clearTimeout(clickTimer)
      clickTimer = null

      if (isLeft) {
        player.seek(Math.max(0, video.currentTime - SEEK_STEP))
      } else {
        player.seek(video.currentTime + SEEK_STEP)
      }

      return
    }

    clickTimer = window.setTimeout(() => {
      togglePlayback()
      clickTimer = null
    }, DOUBLE_TAP_DELAY)
  }

  /* =========================================
     Touch Start
  ========================================= */

  const onTouchStart = (e: TouchEvent): void => {

    if (isInteractiveEvent(e)) return

    if (e.touches.length !== 1) return

    const touch = e.touches[0]
    if (!touch) return

    touchStartY = touch.clientY
    touchStartVolume = video.volume
    isSwiping = false
  }

  /* =========================================
     Touch Move (Volume Swipe)
  ========================================= */

  const onTouchMove = (e: TouchEvent): void => {

    if (e.touches.length !== 1) return

    const touch = e.touches[0]
    if (!touch) return

    const deltaY = touchStartY - touch.clientY

    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      isSwiping = true
    }

    if (!isSwiping) return

    const volumeChange = deltaY / SWIPE_SENSITIVITY

    const newVolume = Math.min(
      1,
      Math.max(0, touchStartVolume + volumeChange)
    )

    video.volume = newVolume
    state?.set('volume', newVolume)
  }

  /* =========================================
     Touch End
  ========================================= */

  const onTouchEnd = (e: TouchEvent): void => {

    if (isInteractiveEvent(e)) return
    if (isSwiping) return

    const now = Date.now()
    const delta = now - lastTapTime

    const touch = e.changedTouches[0]
    if (!touch) return

    const rect = container.getBoundingClientRect()
    const isLeft = touch.clientX < rect.left + rect.width / 2

    if (delta < DOUBLE_TAP_DELAY) {

      if (isLeft) {
        player.seek(Math.max(0, video.currentTime - SEEK_STEP))
      } else {
        player.seek(video.currentTime + SEEK_STEP)
      }

    } else {

      togglePlayback()

    }

    lastTapTime = now
  }

  /* =========================================
     Event Binding
  ========================================= */

  container.style.userSelect = 'none'

  container.addEventListener('click', onClick)
  container.addEventListener('touchstart', onTouchStart, { passive: true })
  container.addEventListener('touchmove', onTouchMove, { passive: true })
  container.addEventListener('touchend', onTouchEnd)

  /* =========================================
     Cleanup
  ========================================= */

  lifecycle?.registerCleanup(() => {

    if (clickTimer !== null) {
      window.clearTimeout(clickTimer)
      clickTimer = null
    }

    container.removeEventListener('click', onClick)
    container.removeEventListener('touchstart', onTouchStart)
    container.removeEventListener('touchmove', onTouchMove)
    container.removeEventListener('touchend', onTouchEnd)

  })
}