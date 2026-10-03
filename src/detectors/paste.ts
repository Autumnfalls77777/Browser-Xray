import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createPasteDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'paste'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'paste',
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
      id: `pst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'paste',
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

  function onPaste() {
    if (!isActive) return
    emit('paste', 'Paste action detected', { contentStored: false })
  }

  return {
    id: 'paste',
    start() {
      isActive = true
      document.addEventListener('paste', onPaste)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      document.removeEventListener('paste', onPaste)
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
