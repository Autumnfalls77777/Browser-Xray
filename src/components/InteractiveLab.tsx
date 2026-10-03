import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MousePointer2, MousePointerClick, MousePointer, ArrowUpDown,
  Keyboard, Copy, ClipboardPaste, Wifi, Hand, GripVertical,
  type LucideIcon,
} from 'lucide-react'

interface InteractionCard {
  id: string
  icon: LucideIcon
  name: string
  description: string
  currentValue: string
  triggered: boolean
  lastEvent: string | null
  signalCount: number
}

const initialCards: InteractionCard[] = [
  { id: 'pointer', icon: MousePointer2, name: 'Tab Switch', description: 'Switch to another tab or window', currentValue: 'ACTIVE', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'click', icon: MousePointerClick, name: 'Left Click', description: 'Click anywhere on the page', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'contextmenu', icon: MousePointer, name: 'Right Click', description: 'Right click for context menu', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'scroll', icon: ArrowUpDown, name: 'Scroll', description: 'Scroll up or down', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'keyboard', icon: Keyboard, name: 'Keyboard', description: 'Press any key', currentValue: 'LISTENING', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'copy', icon: Copy, name: 'Copy', description: 'Copy selected content', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'paste', icon: ClipboardPaste, name: 'Paste', description: 'Paste from clipboard', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'network', icon: Wifi, name: 'Network', description: 'Toggle your connection', currentValue: 'ONLINE', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'touch', icon: Hand, name: 'Touch', description: 'Touch on mobile devices', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
  { id: 'drag', icon: GripVertical, name: 'Drag', description: 'Drag and drop items', currentValue: 'READY', triggered: false, lastEvent: null, signalCount: 0 },
]

export function InteractiveLab() {
  const [cards, setCards] = useState<InteractionCard[]>(initialCards)
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const updateCard = useCallback((id: string, updates: Partial<InteractionCard>) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, ...updates } : card
    ))
  }, [])

  const triggerCard = useCallback((id: string, event: string, value: string) => {
    const existing = timeoutsRef.current.get(id)
    if (existing) clearTimeout(existing)

    updateCard(id, {
      triggered: true,
      lastEvent: event,
      signalCount: (cards.find(c => c.id === id)?.signalCount ?? 0) + 1,
      currentValue: value,
    })

    const timeout = setTimeout(() => {
      updateCard(id, { triggered: false })
      timeoutsRef.current.delete(id)
    }, 300)
    timeoutsRef.current.set(id, timeout)
  }, [cards, updateCard])

  const resetCard = useCallback((id: string, value: string) => {
    const existing = timeoutsRef.current.get(id)
    if (existing) clearTimeout(existing)
    timeoutsRef.current.delete(id)

    updateCard(id, {
      triggered: false,
      lastEvent: id === 'pointer' ? 'focus' : undefined as unknown as string,
      signalCount: (cards.find(c => c.id === id)?.signalCount ?? 0) + (id === 'pointer' ? 1 : 0),
      currentValue: value,
    })
  }, [cards, updateCard])

  useEffect(() => {
    let scrollThrottle = 0
    let touchThrottle = 0

    const onVisibilityChange = () => {
      if (document.hidden) {
        triggerCard('pointer', 'visibilitychange', 'TAB HIDDEN')
      } else {
        resetCard('pointer', 'ACTIVE')
      }
    }

    const onBlur = () => {
      triggerCard('pointer', 'blur', 'WINDOW BLURRED')
    }

    const onMouseLeave = () => {
      triggerCard('pointer', 'mouseleave', 'CURSOR LEFT')
    }

    const onMouseEnter = () => {
      resetCard('pointer', 'ACTIVE')
    }

    const onFocus = () => {
      resetCard('pointer', 'ACTIVE')
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 0) {
        triggerCard('click', 'pointerdown', 'CLICKED')
      }
    }

    const onContextMenu = () => {
      triggerCard('contextmenu', 'contextmenu', 'CLICKED')
    }

    const onWheel = () => {
      const now = Date.now()
      if (now - scrollThrottle < 500) return
      scrollThrottle = now
      triggerCard('scroll', 'wheel', 'SCROLLED')
    }

    const onKeyDown = () => {
      triggerCard('keyboard', 'keydown', 'PRESSED')
    }

    const onCopy = () => {
      triggerCard('copy', 'copy', 'COPIED')
    }

    const onPaste = () => {
      triggerCard('paste', 'paste', 'PASTED')
    }

    const onOnline = () => {
      triggerCard('network', 'online', 'ONLINE')
    }

    const onOffline = () => {
      triggerCard('network', 'offline', 'OFFLINE')
    }

    const onTouchStart = () => {
      const now = Date.now()
      if (now - touchThrottle < 500) return
      touchThrottle = now
      triggerCard('touch', 'touchstart', 'TOUCHED')
    }

    const onDragStart = () => {
      triggerCard('drag', 'dragstart', 'DRAGGING')
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('contextmenu', onContextMenu, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown, { passive: true })
    document.addEventListener('copy', onCopy)
    document.addEventListener('paste', onPaste)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('dragstart', onDragStart)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('paste', onPaste)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('dragstart', onDragStart)

      timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      timeoutsRef.current.clear()
    }
  }, [triggerCard, resetCard])

  return (
    <section id="lab" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
            Interactive Laboratory
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Try to trigger a signal
        </h2>
        <p className="text-text-secondary mt-3 max-w-2xl">
          Interact with this page — move your cursor, click, scroll, press keys.
          Watch each card respond in real time to actual browser events.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`relative p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
              card.triggered
                ? 'bg-red/10 border-red/50 shadow-[0_0_40px_rgba(255,59,59,0.2)]'
                : 'bg-white/[0.04] border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(200,255,0,0.1)]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                card.triggered
                  ? 'bg-red/20 shadow-[0_0_15px_rgba(255,59,59,0.3)]'
                  : 'bg-lime/10 shadow-[0_0_15px_rgba(200,255,0,0.1)]'
              }`}>
                <card.icon className={`w-5 h-5 transition-colors duration-300 ${
                  card.triggered ? 'text-red' : 'text-lime'
                }`} />
              </div>
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                card.triggered ? 'bg-red animate-pulse-glow' : 'bg-lime'
              }`} />
            </div>

            <h3 className="text-sm font-semibold text-text-primary mb-1">{card.name}</h3>
            <p className="text-[11px] text-text-secondary mb-4 leading-relaxed">{card.description}</p>

            <div className="space-y-2 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Value</span>
                <span className={`text-[11px] font-mono font-semibold transition-colors duration-300 ${
                  card.triggered ? 'text-red' : 'text-text-primary'
                }`}>
                  {card.currentValue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Signals</span>
                <span className="text-[11px] font-mono text-text-secondary">{card.signalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Event</span>
                <span className="text-[11px] font-mono text-text-secondary">
                  {card.lastEvent ?? '—'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
