export type DetectorId =
  | 'visibility'
  | 'focus'
  | 'document-focus'
  | 'pointer'
  | 'keyboard'
  | 'click'
  | 'contextmenu'
  | 'scroll'
  | 'copy'
  | 'paste'
  | 'fullscreen'
  | 'viewport'
  | 'lifecycle'
  | 'network'
  | 'touch'
  | 'drag'

export type DetectorStatus = 'monitoring' | 'triggered' | 'recovered' | 'unavailable'

export type DetectorCategory = 'visibility' | 'focus' | 'input' | 'display' | 'lifecycle' | 'network'

export interface DetectorEvent {
  id: string
  detectorId: DetectorId
  type: string
  timestamp: number
  description: string
  metadata: Record<string, unknown>
}

export interface DetectorState {
  id: DetectorId
  status: DetectorStatus
  currentValue: string
  lastEvent: string
  lastEventTimestamp: number | null
  signalCount: number
  isAvailable: boolean
}

export interface DetectorConfig {
  id: DetectorId
  name: string
  shortName: string
  description: string
  category: DetectorCategory
  browserAPI: string
  icon: string
  codeExample: string
  tellsPage: string
  doesNotTell: string
  limitation: string
}

export interface SystemStats {
  sessionDuration: number
  totalSignals: number
  activeDetectors: number
  totalDetectors: number
}
