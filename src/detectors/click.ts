import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createClickDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'pointerdown'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'click',
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
      id: `clk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'click',
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

  function onPointerDown(e: PointerEvent) {
    if (!isActive) return
    if (e.button === 0) {
      emit('pointerdown', 'Left click detected', {
        button: 'left',
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
      })
    }
  }

  return {
    id: 'click',
    start() {
      isActive = true
      window.addEventListener('pointerdown', onPointerDown, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('pointerdown', onPointerDown)
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
