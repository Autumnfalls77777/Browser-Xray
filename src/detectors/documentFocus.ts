import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createDocumentFocusDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'document.hasFocus'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    const focused = document.hasFocus()
    return {
      id: 'document-focus',
      status: focused ? 'monitoring' : 'triggered',
      currentValue: focused ? 'HAS FOCUS' : 'NO FOCUS',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `dfoc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'document-focus',
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

  function onFocusChange() {
    if (!isActive) return
    const focused = document.hasFocus()
    emit(
      'document.hasFocus',
      focused ? 'Document has focus' : 'Document does not have focus',
      { hasFocus: focused }
    )
  }

  return {
    id: 'document-focus',
    start() {
      isActive = true
      window.addEventListener('focus', onFocusChange)
      window.addEventListener('blur', onFocusChange)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('focus', onFocusChange)
      window.removeEventListener('blur', onFocusChange)
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
