/**
 * ChatyPlayer v1.0
 * Quality Switching Feature (Production Ready)
 * ----------------------------------------
 * - Resolution based quality switching
 * - Supports mixed formats (mp4/webm/ogg)
 * - Auto quality mode (buffer based)
 * - Preserves playback position
 * - Preserves play state
 * - Prevents rapid switching
 * - Safe lifecycle cleanup
 * - Emits qualitychange events
 */

import type { Player } from '../core/Player'
import type { PlayerConfig, VideoSource } from '../core/config'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'
import type { EventEmitter } from '../core/events'

export type QualityLabel = string | 'auto'

export function initQualityFeature(
  player: Player,
  config: PlayerConfig,
  lifecycle?: LifecycleManager,
  state?: StateManager,
  events?: EventEmitter
) {

  const video = player.getVideo()

  const sources: VideoSource[] =
    Array.isArray(config.sources) ? config.sources : []

  /* initial quality */

  let currentQuality: QualityLabel =
  sources[0]?.label ?? 'auto'

  let autoMode = true
  let switching = false

  /* =========================================
     Get Available Qualities
  ========================================= */

  const getAvailableQualities = (): QualityLabel[] => {

    if (!sources.length) return []

    return ['auto', ...sources.map(s => s.label)]

  }

  const getCurrentQuality = (): QualityLabel => currentQuality

  /* =========================================
     Switch Source
  ========================================= */

  const switchSource = (source: VideoSource): void => {

    if (!source) return
    if (switching) return

    /* prevent switching to same source */

    if (video.src.includes(source.src)) return

    switching = true

    const currentTime = Number.isFinite(video.currentTime)
      ? video.currentTime
      : 0

    const wasPlaying = !video.paused

    video.pause()

    video.src = source.src
    video.load()

    const restorePlayback = () => {

      try {
        video.currentTime = currentTime
      } catch {}

      if (wasPlaying) {
        video.play().catch(() => {})
      }

      state?.update?.({
        playing: wasPlaying
      })

      events?.emit('qualitychange' as any, source.label)

      video.removeEventListener('loadedmetadata', restorePlayback)

      /* release switching lock */

      setTimeout(() => {
        switching = false
      }, 2000)

    }

    video.addEventListener('loadedmetadata', restorePlayback)

  }

  /* =========================================
     Manual Quality
  ========================================= */

  const setQuality = (label: QualityLabel): void => {

    if (label === 'auto') {
      autoMode = true
      currentQuality = 'auto'
      return
    }

    const source = sources.find(s => s.label === label)

    if (!source) return

    autoMode = false
    currentQuality = label

    switchSource(source)

  }

  /* =========================================
     Auto Quality Logic
  ========================================= */

  const handleBuffering = (): void => {

    if (!autoMode) return
    if (switching) return
    if (sources.length < 2) return
    if (!video.buffered.length) return

    const buffer =
      video.buffered.end(video.buffered.length - 1) - video.currentTime

    if (buffer > 15) increaseQuality()

    if (buffer < 3) decreaseQuality()

  }

  const increaseQuality = (): void => {

    const index = sources.findIndex(s => s.label === currentQuality)

    if (index < 0) return

    const next = sources[index + 1]

    if (!next) return

    currentQuality = next.label

    switchSource(next)

  }

  const decreaseQuality = (): void => {

    const index = sources.findIndex(s => s.label === currentQuality)

    if (index <= 0) return

    const prev = sources[index - 1]

    if (!prev) return

    currentQuality = prev.label

    switchSource(prev)

  }

  video.addEventListener('timeupdate', handleBuffering)

  /* =========================================
     Cleanup
  ========================================= */

  lifecycle?.registerCleanup(() => {

    video.removeEventListener('timeupdate', handleBuffering)

  })

  return {
    getAvailableQualities,
    getCurrentQuality,
    setQuality
  }

}