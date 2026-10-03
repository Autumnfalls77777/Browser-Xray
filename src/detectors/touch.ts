import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createTouchDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'touchstart'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'touch',
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
      id: `tch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'touch',
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

  let touchThrottle = 0

  function onTouchStart(e: TouchEvent) {
    if (!isActive) return
    const now = Date.now()
    if (now - touchThrottle < 1000) return
    touchThrottle = now
    const touch = e.touches[0]
    emit('touchstart', 'Touch detected', {
      x: Math.round(touch.clientX),
      y: Math.round(touch.clientY),
      touchCount: e.touches.length,
    })
  }

  return {
    id: 'touch',
    start() {
      isActive = true
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('touchstart', onTouchStart)
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
