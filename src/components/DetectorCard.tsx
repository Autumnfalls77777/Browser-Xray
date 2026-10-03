import { motion } from 'framer-motion'
import {
  Eye, Focus, FileSearch, MousePointer2, Keyboard, MousePointerClick, MousePointer,
  ArrowUpDown, Copy, ClipboardPaste, Maximize, Monitor, RefreshCw, Wifi, Hand,
  GripVertical, type LucideIcon,
} from 'lucide-react'
import type { DetectorState, DetectorConfig } from '@/types'

const iconMap: Record<string, LucideIcon> = {
  Eye, Focus, FileSearch, MousePointer2, Keyboard, MousePointerClick, MousePointer,
  ArrowUpDown, Copy, ClipboardPaste, Maximize, Monitor, RefreshCw, Wifi, Hand,
  GripVertical,
}

interface DetectorCardProps {
  config: DetectorConfig
  state: DetectorState
  onClick: () => void
  index: number
}

function formatTimeAgo(timestamp: number | null): string {
  if (!timestamp) return '—'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 1) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ago`
}

export function DetectorCard({ config, state, onClick, index }: DetectorCardProps) {
  const Icon = iconMap[config.icon] ?? Eye
  const isTriggered = state.status === 'triggered'

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left p-5 rounded-xl border backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/50 ${
        isTriggered
          ? 'bg-red/10 border-red/40 shadow-[0_0_30px_rgba(255,59,59,0.15)]'
          : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(200,255,0,0.08)] hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isTriggered ? 'bg-red/15' : 'bg-lime/10'
        }`}>
          <Icon className={`w-5 h-5 ${isTriggered ? 'text-red' : 'text-lime'}`} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            isTriggered ? 'bg-red animate-pulse-glow' : 'bg-lime'
          }`} />
          <span className={`text-[10px] font-mono tracking-wider ${
            isTriggered ? 'text-red' : 'text-lime'
          }`}>
            {isTriggered ? 'TRIGGERED' : 'MONITORING'}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-text-primary mb-1">{config.name}</h3>
      <p className="text-xs text-text-secondary mb-4 line-clamp-2">{config.description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">CURRENT</span>
          <span className={`text-xs font-mono font-semibold ${
            isTriggered ? 'text-red' : 'text-text-primary'
          }`}>
            {state.currentValue}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">SIGNALS</span>
          <span className="text-xs font-mono text-text-secondary">{state.signalCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">LAST EVENT</span>
          <span className="text-xs font-mono text-text-secondary">
            {state.lastEventTimestamp ? formatTimeAgo(state.lastEventTimestamp) : '—'}
          </span>
        </div>
      </div>
    </motion.button>
  )
}
