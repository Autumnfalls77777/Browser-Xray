import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createScrollDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'wheel'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'scroll',
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
      id: `scr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'scroll',
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

  let scrollThrottle = 0

  function onWheel(e: WheelEvent) {
    if (!isActive) return
    const now = Date.now()
    if (now - scrollThrottle < 1000) return
    scrollThrottle = now
    const direction = e.deltaY > 0 ? 'down' : 'up'
    emit('wheel', `Scroll ${direction} detected`, {
      direction,
      deltaY: Math.round(e.deltaY),
    })
  }

  return {
    id: 'scroll',
    start() {
      isActive = true
      window.addEventListener('wheel', onWheel, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('wheel', onWheel)
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
