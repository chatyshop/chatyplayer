/**
 * ChatyPlayer v1.0
 * Settings Panel Module (Production Ready - Final Stable)
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

  if (!container) return

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
  panel.setAttribute('role', 'menu')

  wrapper.appendChild(toggleBtn)
  wrapper.appendChild(panel)
  mountPoint.appendChild(wrapper)

  /* =========================================
     PANEL STATE
  ========================================= */

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

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    togglePanel()
  })

  /* =========================================
     OUTSIDE CLICK (CRITICAL FIX)
  ========================================= */

  const onOutsideClick = (e: Event) => {
    const target = e.target as Node | null
    if (!target) return

    if (!panel.contains(target) && !toggleBtn.contains(target)) {
      closePanel()
    }
  }

  document.addEventListener('pointerdown', onOutsideClick)

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
     QUALITY
  ========================================= */

  events.on('ready', () => {

    const qualityAPI = (player as any).quality
    if (!qualityAPI?.getAvailableQualities) return

    const qualities = qualityAPI.getAvailableQualities()
    if (!Array.isArray(qualities) || qualities.length <= 1) return

    const wrapper = document.createElement('div')

    const label = document.createElement('div')
    label.textContent = 'Quality'

    const select = document.createElement('select')
    select.className = 'chatyplayer-settings-select'

    qualities.forEach((q: string) => {
      const opt = document.createElement('option')
      opt.value = q
      opt.textContent = q === 'auto' ? 'Auto' : q.toUpperCase()
      select.appendChild(opt)
    })

    select.value = qualityAPI.getCurrentQuality?.() ?? 'auto'

    const change = () => {
      qualityAPI.setQuality?.(select.value)
      closePanel()
    }

    select.addEventListener('change', change)

    // sync externally
    events.on?.('qualitychange', (q: string) => {
      select.value = q
    })

    wrapper.appendChild(label)
    wrapper.appendChild(select)
    playbackMenu.appendChild(wrapper)

    lifecycle?.registerCleanup(() => {
      select.removeEventListener('change', change)
    })
  })

  /* =========================================
     SPEED
  ========================================= */

  const speedWrapper = document.createElement('div')

  const speedSelect = document.createElement('select')
  speedSelect.className = 'chatyplayer-settings-select'

  ;[0.5, 0.75, 1, 1.25, 1.5, 2].forEach(rate => {
    const opt = document.createElement('option')
    opt.value = String(rate)
    opt.textContent = `${rate}x`
    if (rate === 1) opt.selected = true
    speedSelect.appendChild(opt)
  })

  const changeSpeed = () => {
    const v = parseFloat(speedSelect.value)
    if (!Number.isFinite(v) || v <= 0) return
    player.setSpeed(v)
    closePanel()
  }

  speedSelect.addEventListener('change', changeSpeed)

  speedWrapper.appendChild(document.createTextNode('Playback Speed'))
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
    closePanel()
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
      closePanel()
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

  theaterBtn.addEventListener('click', () => {
    ;(player as any).toggleTheater?.()
    closePanel()
  })

  viewMenu.appendChild(theaterBtn)

  const miniBtn = document.createElement('button')
  miniBtn.className = 'chatyplayer-settings-btn'
  miniBtn.textContent = 'Mini Player'

  miniBtn.addEventListener('click', () => {
    container.classList.toggle('chatyplayer-mini')
    state?.set?.('mini', container.classList.contains('chatyplayer-mini'))
    closePanel()
  })

  viewMenu.appendChild(miniBtn)

  /* =========================================
     INIT
  ========================================= */

  showMenu('main')

  /* =========================================
     CLEANUP
  ========================================= */

  lifecycle?.registerCleanup(() => {

    toggleBtn.removeEventListener('click', togglePanel)
    document.removeEventListener('pointerdown', onOutsideClick)

    speedSelect.removeEventListener('change', changeSpeed)
    loopBtn.removeEventListener('click', toggleLoop)
    pipBtn.removeEventListener('click', togglePiP)
    theaterBtn.removeEventListener('click', () => {})
    miniBtn.removeEventListener('click', () => {})

  })
}