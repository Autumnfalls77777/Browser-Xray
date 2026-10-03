import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createViewportDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'resize'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'viewport',
      status: 'monitoring',
      currentValue: `${window.innerWidth} × ${window.innerHeight}`,
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `vp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'viewport',
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

  let resizeTimeout: ReturnType<typeof setTimeout> | null = null

  function onResize() {
    if (!isActive) return
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      emit('resize', 'Viewport dimensions changed', {
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 300)
  }

  return {
    id: 'viewport',
    start() {
      isActive = true
      window.addEventListener('resize', onResize, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('resize', onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
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
