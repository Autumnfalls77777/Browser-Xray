import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createFullscreenDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'fullscreenchange'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    const isFullscreen = !!document.fullscreenElement
    return {
      id: 'fullscreen',
      status: isFullscreen ? 'triggered' : 'monitoring',
      currentValue: isFullscreen ? 'FULLSCREEN' : 'WINDOWED',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `fs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'fullscreen',
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

  function onFullscreenChange() {
    if (!isActive) return
    const isFullscreen = !!document.fullscreenElement
    emit(
      'fullscreenchange',
      isFullscreen ? 'Entered fullscreen' : 'Exited fullscreen',
      { fullscreen: isFullscreen, element: document.fullscreenElement?.tagName ?? null }
    )
  }

  return {
    id: 'fullscreen',
    start() {
      isActive = true
      document.addEventListener('fullscreenchange', onFullscreenChange)
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      document.removeEventListener('fullscreenchange', onFullscreenChange)
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
