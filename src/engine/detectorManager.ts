import type { Detector } from '@/detectors/types'
import type { DetectorEvent, DetectorId, DetectorState } from '@/types'
import { createVisibilityDetector } from '@/detectors/visibility'
import { createFocusDetector } from '@/detectors/focus'
import { createDocumentFocusDetector } from '@/detectors/documentFocus'
import { createPointerDetector } from '@/detectors/pointer'
import { createKeyboardDetector } from '@/detectors/keyboard'
import { createClickDetector } from '@/detectors/click'
import { createContextMenuDetector } from '@/detectors/contextmenu'
import { createScrollDetector } from '@/detectors/scroll'
import { createCopyDetector } from '@/detectors/copy'
import { createPasteDetector } from '@/detectors/paste'
import { createFullscreenDetector } from '@/detectors/fullscreen'
import { createViewportDetector } from '@/detectors/viewport'
import { createLifecycleDetector } from '@/detectors/lifecycle'
import { createNetworkDetector } from '@/detectors/network'
import { createTouchDetector } from '@/detectors/touch'
import { createDragDetector } from '@/detectors/drag'
import type { EventStore } from './eventStore'

export interface DetectorManager {
  startAll: () => void
  stopAll: () => void
  getDetector: (id: DetectorId) => Detector | undefined
  getAllStates: () => Map<DetectorId, DetectorState>
  onAnyEvent: (callback: (event: DetectorEvent) => void) => () => void
  onAnyStateChange: (callback: (states: Map<DetectorId, DetectorState>) => void) => () => void
}

export function createDetectorManager(eventStore: EventStore): DetectorManager {
  const detectors = new Map<DetectorId, Detector>()
  const stateListeners = new Set<(states: Map<DetectorId, DetectorState>) => void>()

  const detectorFactories: Record<DetectorId, () => Detector> = {
    visibility: createVisibilityDetector,
    focus: createFocusDetector,
    'document-focus': createDocumentFocusDetector,
    pointer: createPointerDetector,
    keyboard: createKeyboardDetector,
    click: createClickDetector,
    contextmenu: createContextMenuDetector,
    scroll: createScrollDetector,
    copy: createCopyDetector,
    paste: createPasteDetector,
    fullscreen: createFullscreenDetector,
    viewport: createViewportDetector,
    lifecycle: createLifecycleDetector,
    network: createNetworkDetector,
    touch: createTouchDetector,
    drag: createDragDetector,
  }

  for (const [id, factory] of Object.entries(detectorFactories) as [DetectorId, () => Detector][]) {
    const detector = factory()
    detector.onEvent(event => eventStore.addEvent(event))
    detector.onStateChange(() => {
      const states = getAllStates()
      stateListeners.forEach(cb => cb(states))
    })
    detectors.set(id, detector)
  }

  function getAllStates(): Map<DetectorId, DetectorState> {
    const states = new Map<DetectorId, DetectorState>()
    for (const [id, detector] of detectors) {
      states.set(id, detector.getState())
    }
    return states
  }

  return {
    startAll() {
      detectors.forEach(d => d.start())
    },
    stopAll() {
      detectors.forEach(d => d.stop())
    },
    getDetector(id) {
      return detectors.get(id)
    },
    getAllStates,
    onAnyEvent(callback) {
      const unsubs = Array.from(detectors.values()).map(d => d.onEvent(callback))
      return () => unsubs.forEach(u => u())
    },
    onAnyStateChange(callback) {
      stateListeners.add(callback)
      return () => stateListeners.delete(callback)
    },
  }
}
