import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createDragDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'dragstart'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'drag',
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
      id: `drg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'drag',
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

  function onDragStart() {
    if (!isActive) return
    emit('dragstart', 'Drag operation started', {})
  }

  function onDrop() {
    if (!isActive) return
    emit('drop', 'Drop operation completed', {})
  }

  return {
    id: 'drag',
    start() {
      isActive = true
      document.addEventListener('dragstart', onDragStart)
      document.addEventListener('drop', onDrop)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('drop', onDrop)
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
