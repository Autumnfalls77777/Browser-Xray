import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { DetectorConfig, DetectorState } from '@/types'

interface DetailPanelProps {
  config: DetectorConfig | null
  state: DetectorState | null
  onClose: () => void
}

function formatTimeAgo(timestamp: number | null): string {
  if (!timestamp) return '—'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 1) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ago`
}

export function DetailPanel({ config, state, onClose }: DetailPanelProps) {
  if (!config) return null

  return (
    <AnimatePresence>
      {config && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-panel border-l border-border overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-panel/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime" />
                <span className="text-xs font-mono tracking-widest text-text-secondary uppercase">
                  Detector Details
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-charcoal/50 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{config.name}</h2>
                <p className="text-sm text-text-secondary">{config.description}</p>
              </div>

              {state && (
                <div className="grid grid-cols-2 gap-3">
                  <InfoBox label="Current Value" value={state.currentValue} />
                  <InfoBox label="Status" value={state.status.toUpperCase()} />
                  <InfoBox label="Signals" value={state.signalCount.toString()} />
                  <InfoBox label="Last Event" value={formatTimeAgo(state.lastEventTimestamp)} />
                </div>
              )}

              <div>
                <SectionTitle>Browser API</SectionTitle>
                <div className="mt-2 px-4 py-3 rounded-lg bg-charcoal/50 border border-border">
                  <code className="text-sm font-mono text-lime">{config.browserAPI}</code>
                </div>
              </div>

              <div>
                <SectionTitle>Example Code</SectionTitle>
                <div className="mt-2 relative">
                  <pre className="px-4 py-3 rounded-lg bg-charcoal/50 border border-border overflow-x-auto">
                    <code className="text-xs font-mono text-text-secondary leading-relaxed">
                      {config.codeExample}
                    </code>
                  </pre>
                </div>
              </div>

              <div>
                <SectionTitle>What this tells the page</SectionTitle>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {config.tellsPage}
                </p>
              </div>

              <div>
                <SectionTitle>What this does NOT tell the page</SectionTitle>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {config.doesNotTell}
                </p>
              </div>

              <div>
                <SectionTitle>Browser limitation</SectionTitle>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {config.limitation}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href={`https://developer.mozilla.org/en-US/docs/Web/API/${config.browserAPI.split('.')[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-lime hover:text-lime-dim transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  MDN Documentation
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-mono tracking-widest text-text-muted uppercase">
      {children}
    </h3>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 rounded-lg bg-charcoal/30 border border-border">
      <div className="text-[10px] font-mono text-text-muted mb-1">{label}</div>
      <div className="text-sm font-mono font-semibold text-text-primary">{value}</div>
    </div>
  )
}
