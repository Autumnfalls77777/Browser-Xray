import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createContextMenuDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'contextmenu'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'contextmenu',
      status: 'monitoring',
      currentValue: 'READY',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `ctx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'contextmenu',
      type,
      timestamp: Date.now(),
      description,
      metadata,
    }
    signalCount++
    lastEvent = type
    lastEventTimestamp = event.timestamp
    eventListeners.forEach(cb => cb(event))
    const state = getState()
    stateListeners.forEach(cb => cb(state))
  }

  function onContextMenu(e: MouseEvent) {
    if (!isActive) return
    emit('contextmenu', 'Right click detected', {
      x: Math.round(e.clientX),
      y: Math.round(e.clientY),
    })
  }

  return {
    id: 'contextmenu',
    start() {
      isActive = true
      window.addEventListener('contextmenu', onContextMenu, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('contextmenu', onContextMenu)
    },
    getState,
    onEvent(cb) {
      eventListeners.add(cb)
      return () => eventListeners.delete(cb)
    },
    onStateChange(cb) {
      stateListeners.add(cb)
      return () => stateListeners.delete(cb)
    },
  }
}
