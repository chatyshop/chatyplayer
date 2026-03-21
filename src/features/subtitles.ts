/**
 * ChatyPlayer v1.0
 * Subtitles (WebVTT) Feature (Production Ready - Final Stable)
 */

import type { Player } from '../core/Player'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'
import type { EventEmitter } from '../core/events'

export interface SubtitleTrackConfig {
  src: string
  label: string
  srclang: string
  default?: boolean
}

/* =========================================
   Safe URL Sanitizer
========================================= */

function sanitizeURL(url: string): string | null {

  try {

    const base =
      typeof window !== 'undefined'
        ? window.location.href
        : 'http://localhost'

    const parsed = new URL(url, base)

    // 🔒 Removed 'data:' for security
    const allowedProtocols = ['http:', 'https:', 'blob:']

    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn('[ChatyPlayer] Blocked unsafe subtitle URL:', parsed.protocol)
      return null
    }

    return parsed.href

  } catch {
    return null
  }
}

/* =========================================
   Init Subtitles Feature
========================================= */

export function initSubtitlesFeature(
  player: Player,
  tracks: SubtitleTrackConfig[],
  lifecycle?: LifecycleManager,
  state?: StateManager,
  events?: EventEmitter
) {

  const video = player.getVideo()
  const container = player.getContainer()

  const trackElements: HTMLTrackElement[] = []

  /* =========================================
     Prevent Duplicate Tracks
  ========================================= */

  if (video.querySelector('track')) {
    console.warn('[ChatyPlayer] Subtitle tracks already exist, skipping re-init')
    return {
      enableSubtitle: () => {},
      disableSubtitles: () => {},
      getAvailableSubtitles: () => []
    }
  }

  /* =========================================
     Create Track Elements
  ========================================= */

  const createTracks = (): void => {

    if (!Array.isArray(tracks)) return

    tracks.forEach((trackConfig) => {

      const safeSrc = sanitizeURL(trackConfig.src)
      if (!safeSrc) return

      const track = document.createElement('track')

      track.kind = 'subtitles'
      track.label = trackConfig.label
      track.srclang = trackConfig.srclang
      track.src = safeSrc

      if (trackConfig.default) {
        track.default = true
      }

      video.appendChild(track)
      trackElements.push(track)

    })
  }

  /* =========================================
     Enable Subtitle
  ========================================= */

  const enableSubtitle = (srclang: string): void => {

    const textTracks = video.textTracks

    for (let i = 0; i < textTracks.length; i++) {

      const track = textTracks[i]
      if (!track) continue

      track.mode =
        track.language === srclang
          ? 'showing'
          : 'disabled'
    }

    state?.set?.('subtitle', srclang)
    events?.emit('subtitlechange', srclang)
  }

  /* =========================================
     Disable Subtitles
  ========================================= */

  const disableSubtitles = (): void => {

    const textTracks = video.textTracks

    for (let i = 0; i < textTracks.length; i++) {

      const track = textTracks[i]
      if (!track) continue

      track.mode = 'disabled'
    }

    state?.set?.('subtitle', null)
    events?.emit('subtitlechange', null)
  }

  /* =========================================
     Available Languages
  ========================================= */

  const getAvailableSubtitles = (): string[] => {
    return tracks.map((t) => t.srclang).filter(Boolean)
  }

  /* =========================================
     Calculate Safe Subtitle Line
  ========================================= */

  const calculateSafeLine = (): number => {

    const controls =
      container.querySelector('.chatyplayer-controls-layer') as HTMLElement | null

    if (!controls) return -1

    const controlsHeight = controls.offsetHeight || 50
    const estimatedLines = Math.ceil(controlsHeight / 24)

    return -(estimatedLines + 1)
  }

  /* =========================================
     Subtitle Position Controller (Optimized)
  ========================================= */

  let lastUpdate = 0

  const updateSubtitlePosition = (): void => {

    const now = Date.now()
    if (now - lastUpdate < 200) return
    lastUpdate = now

    const controlsVisible =
      !container.classList.contains('hide-ui')

    const textTracks = video.textTracks

    const safeLine = controlsVisible
      ? calculateSafeLine()
      : -1

    for (let i = 0; i < textTracks.length; i++) {

      const track = textTracks[i]
      if (!track || track.mode !== 'showing') continue

      const cues = track.cues
      if (!cues) continue

      for (let j = 0; j < cues.length; j++) {

        const cue = cues[j]

        // ✅ Safe check instead of unsafe cast
        if (!(cue instanceof VTTCue)) continue

        cue.snapToLines = true
        cue.line = safeLine
      }
    }
  }

  /* =========================================
     Initialize
  ========================================= */

  createTracks()

  const defaultTrack = tracks.find((t) => t.default)
  if (defaultTrack) {
    enableSubtitle(defaultTrack.srclang)
  }

  /* update subtitle position */

  container.addEventListener('mousemove', updateSubtitlePosition)
  container.addEventListener('mouseleave', updateSubtitlePosition)

  video.addEventListener('play', updateSubtitlePosition)
  video.addEventListener('pause', updateSubtitlePosition)
  video.addEventListener('timeupdate', updateSubtitlePosition)
  video.addEventListener('loadedmetadata', updateSubtitlePosition)

  /* =========================================
     Cleanup
  ========================================= */

  lifecycle?.registerCleanup(() => {

    container.removeEventListener('mousemove', updateSubtitlePosition)
    container.removeEventListener('mouseleave', updateSubtitlePosition)

    video.removeEventListener('play', updateSubtitlePosition)
    video.removeEventListener('pause', updateSubtitlePosition)
    video.removeEventListener('timeupdate', updateSubtitlePosition)
    video.removeEventListener('loadedmetadata', updateSubtitlePosition)

    trackElements.forEach((track) => {
      if (track.parentNode === video) {
        video.removeChild(track)
      }
    })
  })

  return {
    enableSubtitle,
    disableSubtitles,
    getAvailableSubtitles
  }
}