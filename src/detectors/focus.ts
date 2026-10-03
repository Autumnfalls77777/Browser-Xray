import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createFocusDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'focus'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    const focused = document.hasFocus()
    return {
      id: 'focus',
      status: focused ? 'monitoring' : 'triggered',
      currentValue: focused ? 'FOCUSED' : 'BLURRED',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `foc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'focus',
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

  function onFocus() {
    if (!isActive) return
    emit('focus', 'Window regained focus', { hasFocus: true })
  }

  function onBlur() {
    if (!isActive) return
    emit('blur', 'Window lost focus', { hasFocus: false })
  }

  return {
    id: 'focus',
    start() {
      isActive = true
      window.addEventListener('focus', onFocus)
      window.addEventListener('blur', onBlur)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
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
