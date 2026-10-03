import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createVisibilityDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'visibilitychange'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    const visible = document.visibilityState === 'visible'
    return {
      id: 'visibility',
      status: visible ? 'monitoring' : 'triggered',
      currentValue: document.visibilityState.toUpperCase(),
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `vis-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'visibility',
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

  function onVisibilityChange() {
    if (!isActive) return
    const visible = document.visibilityState === 'visible'
    emit(
      'visibilitychange',
      visible ? 'Document became visible' : 'Document became hidden',
      { visibilityState: document.visibilityState, hidden: document.hidden }
    )
  }

  return {
    id: 'visibility',
    start() {
      isActive = true
      document.addEventListener('visibilitychange', onVisibilityChange)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      document.removeEventListener('visibilitychange', onVisibilityChange)
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
