/**
 * ChatyPlayer v1.0
 * Chapters Feature (Production Ready)
 * ----------------------------------------
 * - Chapter segments (range based)
 * - Auto highlight current chapter
 * - Click to seek
 * - Keyboard accessible
 * - Timestamp validation
 * - Sorted chapters
 * - Lifecycle safe cleanup
 */

import type { Player } from '../core/Player'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'

export interface Chapter {
time: number
title: string
}

export function initChaptersFeature(
player: Player,
chapters: Chapter[],
timelineElement: HTMLElement,
lifecycle?: LifecycleManager,
state?: StateManager
) {

const video = player.getVideo()

const segments: HTMLElement[] = []

/* small visual gap between chapters (percent) */
const GAP_PERCENT = 0.35

/* =========================================
Validate + sort chapters (run once)
========================================= */

const validChapters: Chapter[] = Array.isArray(chapters)
? chapters
.filter((chapter) => {

      return (
        chapter &&
        typeof chapter.time === 'number' &&
        Number.isFinite(chapter.time) &&
        chapter.time >= 0 &&
        typeof chapter.title === 'string'
      )

    })
    .sort((a, b) => a.time - b.time)
: []

/* =========================================
Render chapter segments
========================================= */

const renderChapters = (): void => {

const duration = video.duration

if (!Number.isFinite(duration) || duration <= 0) return
if (!validChapters.length) return

for (let i = 0; i < validChapters.length; i++) {

  const chapter = validChapters[i]!
  const next = validChapters[i + 1]

  const start = chapter.time
  const end = next ? next.time : duration

  if (start >= duration) continue

  const GAP_PERCENT = 0.35

let startPercent = (start / duration) * 100
let widthPercent = ((end - start) / duration) * 100

/* apply visual gap */

if (i > 0) {
  startPercent += GAP_PERCENT / 2
}

if (i < validChapters.length - 1) {
  widthPercent -= GAP_PERCENT
}

  const segment = document.createElement('div')

  segment.className = 'chatyplayer-chapter-segment'

  segment.style.left = `${startPercent}%`
  segment.style.width = `${widthPercent}%`

  segment.setAttribute('role', 'button')
  segment.setAttribute('tabindex', '0')
  segment.setAttribute('aria-label', chapter.title)

  const seekToChapter = (): void => {

    player.seek(start)

    state?.set?.('currentTime', start)

  }

  const onKeyDown = (e: KeyboardEvent): void => {

    if (e.key === 'Enter' || e.key === ' ') {

      e.preventDefault()

      seekToChapter()

    }

  }

  segment.addEventListener('click', seekToChapter)
  segment.addEventListener('keydown', onKeyDown)

  timelineElement.appendChild(segment)

  segments.push(segment)

  lifecycle?.registerCleanup(() => {

    segment.removeEventListener('click', seekToChapter)
    segment.removeEventListener('keydown', onKeyDown)

  })

}

}

/* =========================================
Auto highlight current chapter
========================================= */

const updateActiveChapter = (): void => {

const current = video.currentTime

if (!Number.isFinite(current)) return
if (!validChapters.length) return

let activeIndex = 0

for (let i = 0; i < validChapters.length; i++) {

  const chapter = validChapters[i]!

  if (current >= chapter.time) {

    activeIndex = i

  } else {

    break

  }

}

for (let i = 0; i < segments.length; i++) {
  const segment = segments[i]

  if (!segment) continue

  if (i === activeIndex) {

    segment.classList.add('chatyplayer-chapter-active')
   } else {
     segment.classList.remove('chatyplayer-chapter-active')

  }
}
}

/* =========================================
Video events
========================================= */

const onLoadedMetadata = (): void => {
renderChapters()
updateActiveChapter()
}
const onTimeUpdate = (): void => {
updateActiveChapter()
}
video.addEventListener('loadedmetadata', onLoadedMetadata)
video.addEventListener('timeupdate', onTimeUpdate)

/* =========================================
Cleanup
========================================= */

lifecycle?.registerCleanup(() => {
video.removeEventListener('loadedmetadata', onLoadedMetadata)
video.removeEventListener('timeupdate', onTimeUpdate)
for (const segment of segments) {
  if (segment.parentNode === timelineElement) {
      timelineElement.removeChild(segment)
    }
}
segments.length = 0
})
return {
refresh: renderChapters
}
}