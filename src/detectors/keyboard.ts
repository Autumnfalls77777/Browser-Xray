import type { Detector } from './types'
import type { DetectorEvent, DetectorState } from '@/types'

export function createKeyboardDetector(): Detector {
  let isActive = true
  let signalCount = 0
  let lastEvent = 'keydown'
  let lastEventTimestamp: number | null = null
  const eventListeners = new Set<(event: DetectorEvent) => void>()
  const stateListeners = new Set<(state: DetectorState) => void>()

  function getState(): DetectorState {
    return {
      id: 'keyboard',
      status: 'monitoring',
      currentValue: 'LISTENING',
      lastEvent,
      lastEventTimestamp,
      signalCount,
      isAvailable: true,
    }
  }

  function emit(type: string, description: string, metadata: Record<string, unknown>) {
    const event: DetectorEvent = {
      id: `kbd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      detectorId: 'keyboard',
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

  function onKeyDown() {
    if (!isActive) return
    emit('keydown', 'Keyboard activity detected', { keyStored: false })
  }

  function onKeyUp() {
    if (!isActive) return
    emit('keyup', 'Key released', { keyStored: false })
  }

  return {
    id: 'keyboard',
    start() {
      isActive = true
      window.addEventListener('keydown', onKeyDown, { passive: true })
      window.addEventListener('keyup', onKeyUp, { passive: true })
      stateListeners.forEach(cb => cb(getState()))
    },
    stop() {
      isActive = false
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
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
