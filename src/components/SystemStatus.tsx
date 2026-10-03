import { motion } from 'framer-motion'
import type { SystemStats, DetectorState } from '@/types'

interface SystemStatusProps {
  stats: SystemStats
  states: Map<string, DetectorState>
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function SystemStatus({ stats, states }: SystemStatusProps) {
  const visibilityState = states.get('visibility')
  const focusState = states.get('focus')
  const fullscreenState = states.get('fullscreen')
  const pointerState = states.get('pointer')
  const networkState = states.get('network')

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8"
    >
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse-glow" />
          <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">
            System Status
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatusItem
            label="PAGE"
            value={visibilityState?.currentValue ?? '—'}
            active={visibilityState?.status === 'monitoring'}
          />
          <StatusItem
            label="WINDOW"
            value={focusState?.currentValue ?? '—'}
            active={focusState?.status === 'monitoring'}
          />
          <StatusItem
            label="POINTER"
            value={pointerState?.currentValue ?? '—'}
            active={true}
          />
          <StatusItem
            label="FULLSCREEN"
            value={fullscreenState?.currentValue ?? '—'}
            active={fullscreenState?.status === 'triggered'}
          />
          <StatusItem
            label="NETWORK"
            value={networkState?.currentValue ?? '—'}
            active={networkState?.status === 'monitoring'}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-lime">{formatDuration(stats.sessionDuration)}</div>
            <div className="text-[10px] font-mono tracking-wider text-text-muted mt-1">SESSION</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-text-primary">{stats.totalSignals}</div>
            <div className="text-[10px] font-mono tracking-wider text-text-muted mt-1">SIGNALS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-text-primary">
              {stats.activeDetectors}<span className="text-text-muted">/{stats.totalDetectors}</span>
            </div>
            <div className="text-[10px] font-mono tracking-wider text-text-muted mt-1">SIGNALS</div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function StatusItem({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-lime' : 'bg-red'} ${active ? 'animate-pulse-glow' : ''}`} />
      <div>
        <div className="text-[10px] font-mono tracking-wider text-text-muted">{label}</div>
        <div className="text-xs font-mono font-semibold text-text-primary">{value}</div>
      </div>
    </div>
  )
}
