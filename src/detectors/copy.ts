import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createCopyDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'copy'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'copy',
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
      id: `cpy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'copy',
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

  function onCopy() {
    if (!isActive) return
    emit('copy', 'Copy action detected', { contentStored: false })
  }

  return {
    id: 'copy',
    start() {
      isActive = true
      document.addEventListener('copy', onCopy)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      document.removeEventListener('copy', onCopy)
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
