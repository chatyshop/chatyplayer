/**
 * ChatyPlayer v1.0
 * Settings Panel Module (Production Ready - YouTube Style)
 */

import type { Player } from '../core/Player'
import type { LifecycleManager } from '../core/lifecycle'
import type { StateManager } from '../core/state'

export function createSettings(
  player: Player,
  mountPoint: HTMLElement,
  lifecycle?: LifecycleManager,
  state?: StateManager
): void {

  const video = player.getVideo()
  const events = player.getEvents()

  /* ========================================= */

  const wrapper = document.createElement('div')
  wrapper.className = 'chatyplayer-settings-wrapper'

  const toggleBtn = document.createElement('button')
  toggleBtn.type = 'button'
  toggleBtn.className = 'chatyplayer-btn chatyplayer-settings-toggle'
  toggleBtn.setAttribute('aria-label', 'Settings')
  toggleBtn.textContent = '⚙'

  const panel = document.createElement('div')
  panel.className = 'chatyplayer-settings-panel'
  panel.setAttribute('aria-hidden', 'true')
  panel.setAttribute('role', 'menu')

  wrapper.appendChild(toggleBtn)
  wrapper.appendChild(panel)
  mountPoint.appendChild(wrapper)

  /* ========================================= */

  let isOpen = false

  const openPanel = () => {
    isOpen = true
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
  }

  const closePanel = () => {
    isOpen = false
    panel.classList.remove('is-open')
    panel.setAttribute('aria-hidden', 'true')
  }

  const togglePanel = () => {
    isOpen ? closePanel() : openPanel()
  }

  const onToggleClick = (e: Event) => {
    e.stopPropagation()
    togglePanel()
  }

  toggleBtn.addEventListener('click', onToggleClick)

  /* ========================================= */
  /* SAFE outside click */

  const onOutsideClick = (e: Event) => {
    const target = e.target as Node | null
    if (!target) return

    if (panel.contains(target)) return
    if (toggleBtn.contains(target)) return

    closePanel()
  }

  document.addEventListener('pointerdown', onOutsideClick)

  /* ========================================= */

  const menus: Record<string, HTMLElement> = {}

  const showMenu = (name: string) => {
    Object.values(menus).forEach(menu => {
      menu.style.display = 'none'
    })

    const target = menus[name]
    if (target) target.style.display = 'block'
  }

  const createMenu = (name: string): HTMLElement => {
    const menu = document.createElement('div')
    menu.className = 'chatyplayer-settings-menu'
    menu.style.display = 'none'

    panel.appendChild(menu)
    menus[name] = menu

    return menu
  }

  const createBackButton = (menu: HTMLElement) => {
    const back = document.createElement('button')
    back.className = 'chatyplayer-settings-btn'
    back.textContent = '← Back'

    const handler = () => showMenu('main')

    back.addEventListener('click', handler)

    lifecycle?.registerCleanup(() => {
      back.removeEventListener('click', handler)
    })

    menu.appendChild(back)
  }

  /* ========================================= */
  /* MAIN MENU */

  const mainMenu = createMenu('main')

  const createMenuButton = (label: string, targetMenu: string) => {
    const btn = document.createElement('button')
    btn.className = 'chatyplayer-settings-btn'
    btn.textContent = `${label} ›`

    const handler = () => showMenu(targetMenu)

    btn.addEventListener('click', handler)

    lifecycle?.registerCleanup(() => {
      btn.removeEventListener('click', handler)
    })

    mainMenu.appendChild(btn)
  }

  createMenuButton('Playback', 'playback')
  createMenuButton('Player', 'player')
  createMenuButton('View', 'view')

  /* ========================================= */
  /* PLAYBACK MENU */

  const playbackMenu = createMenu('playback')
  createBackButton(playbackMenu)

  /* ---------- SPEED MENU ---------- */

  const speedMenu = createMenu('speed')
  createBackButton(speedMenu)

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
  let currentSpeed = 1

  speeds.forEach(rate => {
    const btn = document.createElement('button')
    btn.className = 'chatyplayer-settings-btn'
    btn.textContent = `${rate}x`

    if (rate === currentSpeed) btn.classList.add('is-active')

    const handler = () => {
      currentSpeed = rate
      player.setSpeed(rate)

      speedMenu.querySelectorAll('button').forEach(b => b.classList.remove('is-active'))
      btn.classList.add('is-active')

      showMenu('playback')
    }

    btn.addEventListener('click', handler)

    lifecycle?.registerCleanup(() => {
      btn.removeEventListener('click', handler)
    })

    speedMenu.appendChild(btn)
  })

  const speedBtn = document.createElement('button')
  speedBtn.className = 'chatyplayer-settings-btn'
  speedBtn.textContent = 'Playback Speed ›'
  speedBtn.addEventListener('click', () => showMenu('speed'))

  playbackMenu.appendChild(speedBtn)

  /* ---------- QUALITY MENU ---------- */

  events.on('ready', () => {
    const qualityAPI = (player as any)?.quality
    if (!qualityAPI?.getAvailableQualities) return

    const qualities = qualityAPI.getAvailableQualities()
    if (!Array.isArray(qualities) || qualities.length <= 1) return

    const qualityMenu = createMenu('quality')
    createBackButton(qualityMenu)

    qualities.forEach((q: string) => {
      const btn = document.createElement('button')
      btn.className = 'chatyplayer-settings-btn'

      const label = q === 'auto' ? 'Auto' : q.toUpperCase()
      btn.textContent = label

      if (q === qualityAPI.getCurrentQuality?.()) {
        btn.classList.add('is-active')
      }

      const handler = () => {
        try {
          qualityAPI.setQuality?.(q)
        } catch {}

        qualityMenu.querySelectorAll('button').forEach(b => b.classList.remove('is-active'))
        btn.classList.add('is-active')

        showMenu('playback')
      }

      btn.addEventListener('click', handler)

      lifecycle?.registerCleanup(() => {
        btn.removeEventListener('click', handler)
      })

      qualityMenu.appendChild(btn)
    })

    const qualityBtn = document.createElement('button')
    qualityBtn.className = 'chatyplayer-settings-btn'
    qualityBtn.textContent = 'Quality ›'
    qualityBtn.addEventListener('click', () => showMenu('quality'))

    playbackMenu.appendChild(qualityBtn)
  })

  /* ---------- LOOP ---------- */

  const loopBtn = document.createElement('button')
  loopBtn.className = 'chatyplayer-settings-btn'
  loopBtn.textContent = 'Toggle Loop'

  const toggleLoop = () => {
    video.loop = !video.loop
    closePanel()
  }

  loopBtn.addEventListener('click', toggleLoop)
  playbackMenu.appendChild(loopBtn)

  /* ========================================= */
  /* PLAYER MENU */

  const playerMenu = createMenu('player')
  createBackButton(playerMenu)

  const pipBtn = document.createElement('button')
  pipBtn.className = 'chatyplayer-settings-btn'
  pipBtn.textContent = 'Picture in Picture'

  const pipSupported =
    'pictureInPictureEnabled' in document &&
    typeof (video as any)?.requestPictureInPicture === 'function'

  if (!pipSupported) pipBtn.disabled = true

  const togglePiP = async () => {
    try {
      if (!document.pictureInPictureElement) {
        await (video as any).requestPictureInPicture()
        state?.set?.('pip', true)
      } else {
        await document.exitPictureInPicture()
        state?.set?.('pip', false)
      }
      closePanel()
    } catch {}
  }

  pipBtn.addEventListener('click', togglePiP)
  playerMenu.appendChild(pipBtn)

  /* ========================================= */
  /* VIEW MENU */

  const viewMenu = createMenu('view')
  createBackButton(viewMenu)

  const theaterBtn = document.createElement('button')
  theaterBtn.className = 'chatyplayer-settings-btn'
  theaterBtn.textContent = 'Theater Mode'
  theaterBtn.addEventListener('click', () => {
    player.toggleTheatre()
    closePanel()
  })

  const miniBtn = document.createElement('button')
  miniBtn.className = 'chatyplayer-settings-btn'
  miniBtn.textContent = 'Mini Player'
  miniBtn.addEventListener('click', () => {
    player.toggleMini()
    closePanel()
  })

  viewMenu.appendChild(theaterBtn)
  viewMenu.appendChild(miniBtn)

  /* ========================================= */

  showMenu('main')

  /* ========================================= */
  /* CLEANUP */

  lifecycle?.registerCleanup(() => {
    toggleBtn.removeEventListener('click', onToggleClick)
    document.removeEventListener('pointerdown', onOutsideClick)
  })
}