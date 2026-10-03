import type { DetectorEvent, DetectorId } from '@/types'

const MAX_EVENTS = 1000
const STORAGE_KEY = 'browse-inspect-events'

export type EventFilter = DetectorId | 'all'

export interface EventStore {
  getEvents: (filter?: EventFilter, limit?: number) => DetectorEvent[]
  getEventCount: () => number
  getEventCountByDetector: (detectorId: DetectorId) => number
  clear: () => void
  subscribe: (callback: (events: DetectorEvent[]) => void) => () => void
  addEvent: (event: DetectorEvent) => void
}

function loadFromStorage(): DetectorEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed.slice(0, MAX_EVENTS)
      }
    }
  } catch {
    // ignore parse errors
  }
  return []
}

function saveToStorage(events: DetectorEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)))
  } catch {
    // ignore quota errors
  }
}

export function createEventStore(): EventStore {
  let events: DetectorEvent[] = loadFromStorage()
  const listeners = new Set<(events: DetectorEvent[]) => void>()

  function notify() {
    listeners.forEach(cb => cb([...events]))
  }

  function addEvent(event: DetectorEvent) {
    events.unshift(event)
    if (events.length > MAX_EVENTS) {
      events = events.slice(0, MAX_EVENTS)
    }
    saveToStorage(events)
    notify()
  }

  function getEvents(filter: EventFilter = 'all', limit = 100): DetectorEvent[] {
    const filtered = filter === 'all' ? events : events.filter(e => e.detectorId === filter)
    return filtered.slice(0, limit)
  }

  function getEventCount(): number {
    return events.length
  }

  function getEventCountByDetector(detectorId: DetectorId): number {
    return events.filter(e => e.detectorId === detectorId).length
  }

  function clear() {
    events = []
    saveToStorage(events)
    notify()
  }

  function subscribe(callback: (events: DetectorEvent[]) => void) {
    listeners.add(callback)
    return () => listeners.delete(callback)
  }

  return { getEvents, getEventCount, getEventCountByDetector, clear, subscribe, addEvent }
}
