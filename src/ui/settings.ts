/**
 * ChatyPlayer v1.0
 * Settings Panel Module (Production Ready)
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
  const container = player.getContainer()
  const events = player.getEvents()

  /* =========================================
     ROOT
  ========================================= */

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

  wrapper.appendChild(toggleBtn)
  wrapper.appendChild(panel)
  mountPoint.appendChild(wrapper)

  /* =========================================
     PANEL VISIBILITY
  ========================================= */

  let isOpen = false

  const togglePanel = () => {
    isOpen = !isOpen
    panel.classList.toggle('is-open', isOpen)
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
  }

  toggleBtn.addEventListener('click', togglePanel)

  /* =========================================
     MENU SYSTEM
  ========================================= */

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
    menu.appendChild(back)

    lifecycle?.registerCleanup(() => {
      back.removeEventListener('click', handler)
    })

  }

  /* =========================================
     MAIN MENU
  ========================================= */

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

  /* =========================================
     PLAYBACK MENU
  ========================================= */

  const playbackMenu = createMenu('playback')
  createBackButton(playbackMenu)

  /* =========================================
     QUALITY DROPDOWN
  ========================================= */

  events.on('ready', () => {

    const qualityAPI = (player as any).quality

    if (!qualityAPI?.getAvailableQualities) return

    const qualities = qualityAPI.getAvailableQualities()

    if (!Array.isArray(qualities) || qualities.length <= 1) return

    const qualityWrapper = document.createElement('div')

    const qualityLabel = document.createElement('div')
    qualityLabel.textContent = 'Quality'

    const qualitySelect = document.createElement('select')
    qualitySelect.className = 'chatyplayer-settings-select'

    qualities.forEach((q: string) => {

      const opt = document.createElement('option')
      opt.value = q

      opt.textContent =
        q === 'auto'
          ? 'Auto'
          : q.toUpperCase()

      qualitySelect.appendChild(opt)

    })

    const currentQuality = qualityAPI.getCurrentQuality?.()

    if (currentQuality) {
      qualitySelect.value = currentQuality
    }

    const changeQuality = () => {
      qualityAPI.setQuality?.(qualitySelect.value)
    }

    qualitySelect.addEventListener('change', changeQuality)

    qualityWrapper.appendChild(qualityLabel)
    qualityWrapper.appendChild(qualitySelect)

    playbackMenu.appendChild(qualityWrapper)

    lifecycle?.registerCleanup(() => {
      qualitySelect.removeEventListener('change', changeQuality)
    })

  })

  /* =========================================
     PLAYBACK SPEED
  ========================================= */

  const speedWrapper = document.createElement('div')

  const speedLabel = document.createElement('div')
  speedLabel.textContent = 'Playback Speed'

  const speedSelect = document.createElement('select')
  speedSelect.className = 'chatyplayer-settings-select'

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  speeds.forEach(rate => {

    const option = document.createElement('option')
    option.value = String(rate)
    option.textContent = `${rate}x`

    if (rate === 1) option.selected = true

    speedSelect.appendChild(option)

  })

  const changeSpeed = () => {

    const value = parseFloat(speedSelect.value)

    if (!Number.isFinite(value) || value <= 0) return

    player.setSpeed(value)
    state?.set?.('playing', !video.paused)

  }

  speedSelect.addEventListener('change', changeSpeed)

  speedWrapper.appendChild(speedLabel)
  speedWrapper.appendChild(speedSelect)

  playbackMenu.appendChild(speedWrapper)

  /* =========================================
     LOOP
  ========================================= */

  const loopBtn = document.createElement('button')
  loopBtn.className = 'chatyplayer-settings-btn'
  loopBtn.textContent = 'Toggle Loop'

  const toggleLoop = () => {
    video.loop = !video.loop
  }

  loopBtn.addEventListener('click', toggleLoop)
  playbackMenu.appendChild(loopBtn)

  /* =========================================
     PLAYER MENU
  ========================================= */

  const playerMenu = createMenu('player')
  createBackButton(playerMenu)

  const pipBtn = document.createElement('button')
  pipBtn.className = 'chatyplayer-settings-btn'
  pipBtn.textContent = 'Picture in Picture'

  const pipSupported =
    typeof document !== 'undefined' &&
    'pictureInPictureEnabled' in document &&
    typeof (video as any).requestPictureInPicture === 'function'

  if (!pipSupported) pipBtn.disabled = true

  const togglePiP = async () => {

    if (!pipSupported) return

    try {

      if (!document.pictureInPictureElement) {

        await (video as any).requestPictureInPicture()
        state?.set?.('pip', true)

      } else {

        await document.exitPictureInPicture()
        state?.set?.('pip', false)

      }

    } catch {}

  }

  pipBtn.addEventListener('click', togglePiP)
  playerMenu.appendChild(pipBtn)

  /* =========================================
     VIEW MENU
  ========================================= */

  const viewMenu = createMenu('view')
  createBackButton(viewMenu)

  const theaterBtn = document.createElement('button')
  theaterBtn.className = 'chatyplayer-settings-btn'
  theaterBtn.textContent = 'Theater Mode'

  const toggleTheater = () => {
    (player as any).toggleTheater?.()
  }

  theaterBtn.addEventListener('click', toggleTheater)
  viewMenu.appendChild(theaterBtn)

  const miniBtn = document.createElement('button')
  miniBtn.className = 'chatyplayer-settings-btn'
  miniBtn.textContent = 'Mini Player'

  const toggleMini = () => {

    container.classList.toggle('chatyplayer-mini')

    const enabled = container.classList.contains('chatyplayer-mini')

    state?.set?.('mini', enabled)

  }

  miniBtn.addEventListener('click', toggleMini)
  viewMenu.appendChild(miniBtn)

  /* =========================================
     INITIAL STATE
  ========================================= */

  showMenu('main')

  /* =========================================
     CLEANUP
  ========================================= */

  lifecycle?.registerCleanup(() => {

    toggleBtn.removeEventListener('click', togglePanel)
    speedSelect.removeEventListener('change', changeSpeed)
    loopBtn.removeEventListener('click', toggleLoop)
    pipBtn.removeEventListener('click', togglePiP)
    theaterBtn.removeEventListener('click', toggleTheater)
    miniBtn.removeEventListener('click', toggleMini)

  })

}