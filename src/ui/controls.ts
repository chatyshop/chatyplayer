/**
 * ChatyPlayer v1.0
 * Controls Module (Production Ready - Final Stable)
 */

import type { Player } from '../core/Player'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'
import { createSettings } from './settings'
import { Icons } from './icons'

export function createControls(
  player: Player,
  mountPoint: HTMLElement,
  lifecycle?: LifecycleManager,
  state?: StateManager
): void {

  const video = player.getVideo()
  const container = player.getContainer()

  if (!container) return

  // Prevent duplicate mount
  if (container.querySelector('.chatyplayer-controls')) return

  /* =====================================================
  ROOT BAR
  ===================================================== */

  const controlsBar = document.createElement('div')
  controlsBar.className = 'chatyplayer-controls'

  const leftGroup = document.createElement('div')
  leftGroup.className = 'chatyplayer-controls-left'

  const rightGroup = document.createElement('div')
  rightGroup.className = 'chatyplayer-controls-right'

  /* =====================================================
  PLAY / PAUSE
  ===================================================== */

  const playBtn = document.createElement('button')
  playBtn.className = 'chatyplayer-btn chatyplayer-play'
  playBtn.type = 'button'
  playBtn.setAttribute('aria-label', 'Play')

  playBtn.appendChild(Icons.play())

  const togglePlay = (): void => {
    video.paused ? player.play().catch(() => {}) : player.pause()
  }

  const onPlay = (): void => {
    playBtn.replaceChildren(Icons.pause())
    playBtn.setAttribute('aria-label', 'Pause')
    state?.set?.('playing', true)
  }

  const onPause = (): void => {
    playBtn.replaceChildren(Icons.play())
    playBtn.setAttribute('aria-label', 'Play')
    state?.set?.('playing', false)
  }

  playBtn.addEventListener('click', togglePlay)
  video.addEventListener('play', onPlay)
  video.addEventListener('pause', onPause)

  /* =====================================================
  TIME DISPLAY
  ===================================================== */

  const timeDisplay = document.createElement('span')
  timeDisplay.className = 'chatyplayer-time-inline'

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const updateTime = (): void => {
    timeDisplay.textContent =
      `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`
  }

  video.addEventListener('timeupdate', updateTime)
  video.addEventListener('loadedmetadata', updateTime)

  /* =====================================================
  VOLUME
  ===================================================== */

  const volumeWrapper = document.createElement('div')
  volumeWrapper.className = 'chatyplayer-volume'

  const muteBtn = document.createElement('button')
  muteBtn.className = 'chatyplayer-btn chatyplayer-mute'
  muteBtn.type = 'button'

  const volumeSlider = document.createElement('input')
  volumeSlider.type = 'range'
  volumeSlider.min = '0'
  volumeSlider.max = '1'
  volumeSlider.step = '0.01'
  volumeSlider.value = String(video.volume)
  volumeSlider.className = 'chatyplayer-volume-slider'

  const updateMuteIcon = (): void => {
    muteBtn.replaceChildren(
      video.muted || video.volume === 0
        ? Icons.mute()
        : Icons.volume()
    )
  }

  const syncVolumeUI = (): void => {
    volumeSlider.value = String(video.muted ? 0 : video.volume)
    updateMuteIcon()
  }

  const toggleMute = (): void => {
    video.muted = !video.muted
    state?.set?.('muted', video.muted)
    syncVolumeUI()
  }

  const changeVolume = (): void => {
    const value = parseFloat(volumeSlider.value)
    if (!Number.isFinite(value)) return

    player.setVolume(value)
    video.muted = value === 0

    state?.set?.('volume', video.volume)
    state?.set?.('muted', video.muted)

    syncVolumeUI()
  }

  muteBtn.addEventListener('click', toggleMute)
  volumeSlider.addEventListener('input', changeVolume)

  // Prevent gesture conflicts
  volumeSlider.addEventListener('touchstart', e => e.stopPropagation(), { passive: true })
  volumeSlider.addEventListener('touchmove', e => e.stopPropagation(), { passive: true })

  video.addEventListener('volumechange', syncVolumeUI)

  volumeWrapper.appendChild(muteBtn)
  volumeWrapper.appendChild(volumeSlider)

  /* =====================================================
  SUBTITLES
  ===================================================== */

  const subtitleBtn = document.createElement('button')
  subtitleBtn.className = 'chatyplayer-btn chatyplayer-subtitles'
  subtitleBtn.type = 'button'
  subtitleBtn.textContent = 'CC'

  const subtitleMenu = document.createElement('div')
  subtitleMenu.className = 'chatyplayer-subtitle-menu'
  subtitleMenu.style.display = 'none'
  subtitleMenu.style.maxHeight = '200px'
  subtitleMenu.style.overflowY = 'auto'

  const buildSubtitleMenu = (): void => {
    subtitleMenu.innerHTML = ''

    const tracks = video.textTracks
    if (!tracks || tracks.length === 0) return

    const offBtn = document.createElement('button')
    offBtn.textContent = 'Off'

    offBtn.addEventListener('click', () => {
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i]
        if (t) t.mode = 'disabled'
      }
      subtitleMenu.style.display = 'none'
    })

    subtitleMenu.appendChild(offBtn)

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]
      if (!track) continue

      const btn = document.createElement('button')
      btn.textContent =
        track.label || track.language || `Track ${i + 1}`

      btn.addEventListener('click', () => {
        for (let j = 0; j < tracks.length; j++) {
          const t = tracks[j]
          if (t) t.mode = 'disabled'
        }

        track.mode = 'showing'
        subtitleMenu.style.display = 'none'
      })

      subtitleMenu.appendChild(btn)
    }
  }

  const toggleSubtitleMenu = (): void => {
    const isOpen = subtitleMenu.style.display === 'block'

    if (isOpen) {
      subtitleMenu.style.display = 'none'
      return
    }

    buildSubtitleMenu()
    subtitleMenu.style.display = 'block'
  }

  const onOutsideClick = (e: Event): void => {
    const target = e.target as Node | null
    if (!target) return

    if (
      !subtitleMenu.contains(target) &&
      !subtitleBtn.contains(target)
    ) {
      subtitleMenu.style.display = 'none'
    }
  }

  subtitleBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleSubtitleMenu()
  })

  document.addEventListener('pointerdown', onOutsideClick)

  /* =====================================================
  SETTINGS
  ===================================================== */

  createSettings(player, rightGroup, lifecycle, state)

  /* =====================================================
  FULLSCREEN
  ===================================================== */

  const fullscreenBtn = document.createElement('button')
  fullscreenBtn.className = 'chatyplayer-btn chatyplayer-fullscreen'

  fullscreenBtn.appendChild(Icons.fullscreen())

  const toggleFullscreen = (): void => {
    subtitleMenu.style.display = 'none'

    const doc: any = document
    const el: any = container

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)
    } else {
      (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc)
    }
  }

  const onFullscreenChange = (): void => {
    const doc: any = document
    state?.set?.(
      'fullscreen',
      !!(doc.fullscreenElement || doc.webkitFullscreenElement)
    )
  }

  fullscreenBtn.addEventListener('click', toggleFullscreen)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)

  /* =====================================================
  BUILD
  ===================================================== */

  leftGroup.appendChild(playBtn)
  leftGroup.appendChild(timeDisplay)

  rightGroup.appendChild(subtitleBtn)
  rightGroup.appendChild(subtitleMenu)
  rightGroup.appendChild(volumeWrapper)
  rightGroup.appendChild(fullscreenBtn)

  controlsBar.appendChild(leftGroup)
  controlsBar.appendChild(rightGroup)

  mountPoint.appendChild(controlsBar)

  /* =====================================================
  INIT
  ===================================================== */

  if (!video.paused) onPlay()
  else onPause()

  syncVolumeUI()
  updateTime()

  /* =====================================================
  CLEANUP
  ===================================================== */

  lifecycle?.registerCleanup(() => {

    playBtn.removeEventListener('click', togglePlay)

    video.removeEventListener('play', onPlay)
    video.removeEventListener('pause', onPause)
    video.removeEventListener('timeupdate', updateTime)
    video.removeEventListener('loadedmetadata', updateTime)
    video.removeEventListener('volumechange', syncVolumeUI)

    muteBtn.removeEventListener('click', toggleMute)
    volumeSlider.removeEventListener('input', changeVolume)

    subtitleBtn.removeEventListener('click', toggleSubtitleMenu)
    document.removeEventListener('pointerdown', onOutsideClick)

    fullscreenBtn.removeEventListener('click', toggleFullscreen)
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  })
}