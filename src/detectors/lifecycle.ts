import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createLifecycleDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'load'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'lifecycle',
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
      id: `lc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'lifecycle',
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

  function onPageShow(e: PageTransitionEvent) {
    if (!isActive) return
    emit('pageshow', e.persisted ? 'Page restored from bfcache' : 'Page shown', {
      persisted: e.persisted,
    })
  }

  function onPageHide(e: PageTransitionEvent) {
    if (!isActive) return
    emit('pagehide', e.persisted ? 'Page entering bfcache' : 'Page hidden', {
      persisted: e.persisted,
    })
  }

  return {
    id: 'lifecycle',
    start() {
      isActive = true
      window.addEventListener('pageshow', onPageShow, { passive: true })
      window.addEventListener('pagehide', onPageHide, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('pagehide', onPageHide)
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
