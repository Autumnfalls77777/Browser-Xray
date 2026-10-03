import { useState, useEffect, useCallback, useRef } from 'react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { SystemStatus } from '@/components/SystemStatus'
import { InteractiveLab } from '@/components/InteractiveLab'
import { EventFeed } from '@/components/EventFeed'
import { ResearchSection } from '@/components/ResearchSection'
import { Footer } from '@/components/Footer'
import { DetailPanel } from '@/components/DetailPanel'
import { createEventStore } from '@/engine/eventStore'
import { createDetectorManager } from '@/engine/detectorManager'
import { detectorConfigs } from '@/data/detectors'
import type { DetectorEvent, DetectorState, DetectorConfig, SystemStats } from '@/types'

export default function App() {
  const [events, setEvents] = useState<DetectorEvent[]>([])
  const [detectorStates, setDetectorStates] = useState<Map<string, DetectorState>>(new Map())
  const [selectedConfig, setSelectedConfig] = useState<DetectorConfig | null>(null)
  const [sessionStart] = useState(() => Date.now())
  const [sessionDuration, setSessionDuration] = useState(0)
  const [totalSignals, setTotalSignals] = useState(0)

  const eventStoreRef = useRef(createEventStore())
  const managerRef = useRef(createDetectorManager(eventStoreRef.current))

  useEffect(() => {
    const store = eventStoreRef.current
    const manager = managerRef.current

    manager.startAll()

    const unsubEvents = store.subscribe(newEvents => {
      setEvents(newEvents)
      setTotalSignals(newEvents.length)
    })

    const unsubState = manager.onAnyStateChange(states => {
      setDetectorStates(new Map(states))
    })

    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStart) / 1000))
    }, 1000)

    return () => {
      manager.stopAll()
      unsubEvents()
      unsubState()
      clearInterval(interval)
    }
  }, [sessionStart])

  const handleClearEvents = useCallback(() => {
    eventStoreRef.current.clear()
  }, [])



  const handleClosePanel = useCallback(() => {
    setSelectedConfig(null)
  }, [])

  const stats: SystemStats = {
    sessionDuration,
    totalSignals,
    activeDetectors: detectorStates.size,
    totalDetectors: detectorConfigs.length,
  }

  return (
    <div className="min-h-screen bg-void text-text-primary">
      <Navbar />
      <Hero />
      <SystemStatus stats={stats} states={detectorStates} />
      <InteractiveLab />
      <EventFeed events={events} onClear={handleClearEvents} />
      <ResearchSection />
      <Footer />
      <DetailPanel
        config={selectedConfig}
        state={selectedConfig ? detectorStates.get(selectedConfig.id) ?? null : null}
        onClose={handleClosePanel}
      />
    </div>
  )
}
