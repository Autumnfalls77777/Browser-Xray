import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createNetworkDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'online'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    const online = navigator.onLine
    return {
      id: 'network',
      status: online ? 'monitoring' : 'triggered',
      currentValue: online ? 'ONLINE' : 'OFFLINE',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `net-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'network',
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

  function onOnline() {
    if (!isActive) return
    emit('online', 'Network connection restored', { online: true })
  }

  function onOffline() {
    if (!isActive) return
    emit('offline', 'Network connection lost', { online: false })
  }

  return {
    id: 'network',
    start() {
      isActive = true
      window.addEventListener('online', onOnline)
      window.addEventListener('offline', onOffline)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
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
