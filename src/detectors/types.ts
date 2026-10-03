import type { DetectorId, DetectorState, DetectorEvent } from '@/types'

export interface Detector {
  id: DetectorId
  start: () => void
  stop: () => void
  getState: () => DetectorState
  onEvent: (callback: (event: DetectorEvent) => void) => () => void
  onStateChange: (callback: (state: DetectorState) => void) => () => void
}

export type DetectorEventListener = (event: DetectorEvent) => void
export type DetectorStateListener = (state: DetectorState) => void
