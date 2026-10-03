import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { DetectorEvent, DetectorId } from '@/types'
import type { EventFilter } from '@/engine/eventStore'

interface EventFeedProps {
  events: DetectorEvent[]
  onClear: () => void
}

const filterOptions: { value: EventFilter; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'visibility', label: 'VISIBILITY' },
  { value: 'focus', label: 'FOCUS' },
  { value: 'pointer', label: 'POINTER' },
  { value: 'keyboard', label: 'KEYBOARD' },
  { value: 'click', label: 'L-CLICK' },
  { value: 'contextmenu', label: 'R-CLICK' },
  { value: 'scroll', label: 'SCROLL' },
  { value: 'copy', label: 'COPY' },
  { value: 'paste', label: 'PASTE' },
  { value: 'fullscreen', label: 'FULLSCREEN' },
  { value: 'viewport', label: 'VIEWPORT' },
  { value: 'lifecycle', label: 'LIFECYCLE' },
  { value: 'network', label: 'NETWORK' },
  { value: 'touch', label: 'TOUCH' },
  { value: 'drag', label: 'DRAG' },
]

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  const ms = d.getMilliseconds().toString().padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

const detectorColors: Record<DetectorId, string> = {
  visibility: 'text-lime',
  focus: 'text-purple',
  'document-focus': 'text-purple',
  pointer: 'text-amber',
  keyboard: 'text-amber',
  click: 'text-red',
  contextmenu: 'text-red',
  scroll: 'text-amber',
  copy: 'text-amber',
  paste: 'text-amber',
  fullscreen: 'text-red',
  viewport: 'text-text-secondary',
  lifecycle: 'text-text-secondary',
  network: 'text-lime',
  touch: 'text-amber',
  drag: 'text-amber',
}

export function EventFeed({ events, onClear }: EventFeedProps) {
  const [filter, setFilter] = useState<EventFilter>('all')
  const feedRef = useRef<HTMLDivElement>(null)

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.detectorId === filter)

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0
    }
  }, [events.length])

  return (
    <section id="events" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-lime" />
          <span className="text-xs font-mono tracking-widest text-lime uppercase">
            Live Signal Feed
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Real-time event stream
        </h2>
        <p className="text-text-secondary mt-3 max-w-2xl">
          Every browser event is recorded here in real time. Newest events appear at the top.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-panel rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-charcoal/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse-glow" />
            <span className="text-xs font-mono tracking-wider text-text-secondary">
              LIVE SIGNAL FEED
            </span>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-text-muted hover:text-red hover:bg-red/10 transition-colors"
            aria-label="Clear events"
          >
            <Trash2 className="w-3 h-3" />
            CLEAR
          </button>
        </div>

        <div className="flex gap-1 px-5 py-3 border-b border-border overflow-x-auto">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider transition-colors whitespace-nowrap ${
                filter === opt.value
                  ? 'bg-lime/10 text-lime border border-lime/30'
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div ref={feedRef} className="max-h-[500px] overflow-y-auto p-5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-sm text-text-muted font-mono">No events recorded yet</div>
              <div className="text-xs text-text-muted mt-1">Interact with the page to generate events</div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredEvents.slice(0, 100).map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <div className="text-xs font-mono text-text-muted whitespace-nowrap pt-0.5">
                      {formatTimestamp(event.timestamp)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono font-bold tracking-wider ${detectorColors[event.detectorId]}`}>
                          {event.detectorId.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">
                          {event.type}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        {event.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
