import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createPointerDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'pointermove'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'pointer',
      status: 'monitoring',
      currentValue: 'ACTIVE',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `ptr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'pointer',
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

  let moveThrottle = 0

  function onPointerMove(e: PointerEvent) {
    if (!isActive) return
    const now = Date.now()
    if (now - moveThrottle < 1500) return
    moveThrottle = now
    emit('pointermove', 'Pointer movement detected', {
      x: Math.round(e.clientX),
      y: Math.round(e.clientY),
    })
  }

  return {
    id: 'pointer',
    start() {
      isActive = true
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('pointermove', onPointerMove)
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
