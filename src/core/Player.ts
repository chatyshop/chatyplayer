/**
 * ChatyPlayer v1.0
 * Core Player Engine (Production Ready)
 * Player.ts
 * ----------------------------------------
 * - Multi-source support
 * - Secure initialization
 * - Plugin system safe
 * - UI lifecycle safe
 * - Feature registry support
 */

import { PlayerConfig, VideoSource } from './config'
import { EventEmitter } from './events'
import { createPublicAPI } from '../api/publicAPI'
import { createControls } from '../ui/controls'
import { createTimeline } from '../ui/timeline'
import { createMiniPlayer } from '../ui/miniPlayer'
import { selectBestSource } from '../utils/formats'
import type { PlayerFeature } from '../types/Feature'
import { builtInFeatures } from '../features/featureRegistry'

export class Player {

private container: HTMLElement
private video: HTMLVideoElement
private wrapper!: HTMLElement
private timelineLayer!: HTMLElement

private config: PlayerConfig
private events: EventEmitter

private destroyed = false
private activeFeatures: PlayerFeature[] = []
private hideTimeout?: number

public readonly api

constructor(container: HTMLElement, config: PlayerConfig) {

if (typeof window === 'undefined') {
  throw new Error('[ChatyPlayer] Cannot initialize on server.')
}

if (!(container instanceof HTMLElement)) {
  throw new Error('[ChatyPlayer] Invalid container element.')
}

this.container = container
this.config = config
this.events = new EventEmitter()

this.video = this.createVideoElement()

this.mount()
this.initCoreEvents()
this.initAutoHide()
this.initFeatures()
this.initMiniPlayer()

this.api = createPublicAPI(this, this.events)

this.events.emit('ready')

}

/* =========================================
Video Element Creation
========================================= */

private createVideoElement(): HTMLVideoElement {

const video = document.createElement('video')

video.preload = this.config.preload ?? 'metadata'
video.playsInline = true
video.controls = false
video.crossOrigin = 'anonymous'

if (this.config.poster) {
  video.poster = this.config.poster
}

const source = this.resolveInitialSource()

if (!source) {
  throw new Error('[ChatyPlayer] No supported video source found.')
}

video.src = source.src

if (this.config.autoplay) {
  video.autoplay = true
  video.muted = true
}

if (this.config.loop) {
  video.loop = true
}

return video

}

/* =========================================
Resolve Initial Source
========================================= */

private resolveInitialSource(): VideoSource | { src: string } | undefined {

const direct = selectBestSource(this.config)

if (direct) return direct

if (Array.isArray(this.config.sources) && this.config.sources.length) {
  return this.config.sources[0]
}

return undefined

}

/* =========================================
Mount Player Structure
========================================= */

private mount(): void {

this.container.textContent = ''
this.container.classList.add('chatyplayer-root')

const videoWrapper = document.createElement('div')
videoWrapper.className = 'chatyplayer-video-wrapper'

this.wrapper = videoWrapper

videoWrapper.appendChild(this.video)

/* timeline layer */

this.timelineLayer = document.createElement('div')
this.timelineLayer.className = 'chatyplayer-timeline-layer'

/* controls layer */

const controlsLayer = document.createElement('div')
controlsLayer.className = 'chatyplayer-controls-layer'

videoWrapper.appendChild(this.timelineLayer)
videoWrapper.appendChild(controlsLayer)

this.container.appendChild(videoWrapper)

createTimeline(this, this.timelineLayer)
createControls(this, controlsLayer)

}

/* =========================================
Mini Player
========================================= */

private initMiniPlayer(): void {

try {
  createMiniPlayer(this)
} catch (error) {
  console.warn('[ChatyPlayer] MiniPlayer failed to initialize.', error)
}

}

/* =========================================
Auto Hide Controls
========================================= */

private initAutoHide(): void {

const showUI = () => {

  if (this.destroyed) return

  this.container.classList.remove('hide-ui')

  if (this.hideTimeout) {
    window.clearTimeout(this.hideTimeout)
  }

  this.hideTimeout = window.setTimeout(() => {

    if (!this.video.paused) {
      this.container.classList.add('hide-ui')
    }

  }, 2000)

}

this.wrapper.addEventListener('mousemove', showUI)
this.wrapper.addEventListener('touchstart', showUI)

this.video.addEventListener('pause', () => {
  this.container.classList.remove('hide-ui')
})

this.video.addEventListener('play', showUI)

}

/* =========================================
Core Events
========================================= */

private initCoreEvents(): void {

const video = this.video

video.addEventListener('play', () => {
  this.events.emit('play')
})

video.addEventListener('pause', () => {
  this.events.emit('pause')
})

video.addEventListener('ended', () => {
  this.events.emit('ended')
})

video.addEventListener('timeupdate', () => {
  this.events.emit('timeupdate', video.currentTime)
})

video.addEventListener('loadedmetadata', () => {
  this.events.emit('loadedmetadata', video.duration)
})

video.addEventListener('error', () => {
  this.events.emit('error')
})

}

/* =========================================
Feature System
========================================= */

private initFeatures(): void {

if (this.destroyed) return

const features = this.config.features ?? builtInFeatures

for (const feature of features) {

  try {

    feature.init(this)
    this.activeFeatures.push(feature)

  } catch (error) {

    console.error(
      `[ChatyPlayer] Feature "${feature.name}" failed.`,
      error
    )

  }

}

}

/* =========================================
Public Controls
========================================= */

public async play(): Promise<void> {

try {
  await this.video.play()
} catch {
  /* autoplay safe fail */
}

}

public pause(): void {
this.video.pause()
}

public toggle(): void {
this.video.paused ? this.play() : this.pause()
}

public seek(seconds: number): void {

if (!Number.isFinite(seconds)) return

const duration = this.video.duration || 0
const safe = Math.max(0, Math.min(seconds, duration))

this.video.currentTime = safe

}

public setVolume(volume: number): void {

if (!Number.isFinite(volume)) return

this.video.volume = Math.max(0, Math.min(volume, 1))

}

public setSpeed(rate: number): void {

if (!Number.isFinite(rate) || rate <= 0) return

this.video.playbackRate = rate

}

/* =========================================
Getters
========================================= */

public getVideo(): HTMLVideoElement {
return this.video
}

public getContainer(): HTMLElement {
return this.container
}

public getTimeline(): HTMLElement {
return this.timelineLayer
}

public getConfig(): PlayerConfig {
return this.config
}

public getEvents(): EventEmitter {
return this.events
}

/* =========================================
Destroy Lifecycle
========================================= */

public destroy(): void {

if (this.destroyed) return

this.pause()

if (this.hideTimeout) {
  window.clearTimeout(this.hideTimeout)
}

for (const feature of this.activeFeatures) {

  try {
    feature.destroy?.(this)
  } catch {}

}

this.video.removeAttribute('src')
this.video.load()

this.events.emit('destroy')
this.events.destroy()

this.container.textContent = ''
this.container.classList.remove('chatyplayer-root')

this.activeFeatures = []
this.destroyed = true

}

}