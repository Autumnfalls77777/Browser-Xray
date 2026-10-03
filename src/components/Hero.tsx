import { motion } from 'framer-motion'
import { ArrowRight, Activity, Eye, MousePointer2, Keyboard, Maximize, Monitor, RefreshCw, Focus, MousePointerClick, ArrowUpDown, Copy, Wifi, Hand } from 'lucide-react'

const indicators = [
  { icon: Eye, label: 'VISIBILITY', color: 'text-lime' },
  { icon: Focus, label: 'FOCUS', color: 'text-lime' },
  { icon: MousePointer2, label: 'POINTER', color: 'text-lime' },
  { icon: Keyboard, label: 'KEYBOARD', color: 'text-lime' },
  { icon: MousePointerClick, label: 'L-CLICK', color: 'text-lime' },
  { icon: ArrowUpDown, label: 'SCROLL', color: 'text-lime' },
  { icon: Copy, label: 'COPY', color: 'text-lime' },
  { icon: Maximize, label: 'FULLSCREEN', color: 'text-text-muted' },
  { icon: Monitor, label: 'VIEWPORT', color: 'text-lime' },
  { icon: RefreshCw, label: 'LIFECYCLE', color: 'text-lime' },
  { icon: Wifi, label: 'NETWORK', color: 'text-lime' },
  { icon: Hand, label: 'TOUCH', color: 'text-text-muted' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <Activity className="w-4 h-4 text-lime" />
              <span className="text-xs font-mono tracking-widest text-lime uppercase">
                Browser Observability Research
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              <span className="text-text-primary">How much can a</span>
              <br />
              <span className="text-lime text-glow-lime">website</span>
              <span className="text-text-primary"> actually see?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg"
            >
              An interactive browser-observability laboratory that lets you experience
              the signals exposed through standard web APIs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#lab"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-lime text-void font-semibold text-sm rounded-lg hover:bg-lime-dim transition-all duration-200 hover:shadow-[0_0_30px_rgba(200,255,0,0.3)]"
              >
                ENTER THE LAB
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#detections"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border-light text-text-primary font-semibold text-sm rounded-lg hover:border-lime/50 hover:text-lime transition-all duration-200"
              >
                VIEW EVENTS
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />

              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red/80" />
                <div className="w-3 h-3 rounded-full bg-amber/80" />
                <div className="w-3 h-3 rounded-full bg-lime/80" />
                <span className="ml-auto text-[10px] font-mono text-text-muted tracking-wider">
                  BROWSER MONITOR
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {indicators.map((ind, i) => (
                  <motion.div
                    key={ind.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.06 }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                  >
                    <ind.icon className={`w-3.5 h-3.5 ${ind.color}`} />
                    <span className="text-[10px] font-mono tracking-wider text-text-secondary">
                      {ind.label}
                    </span>
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full ${
                      ind.color === 'text-lime' ? 'bg-lime animate-pulse-glow' : 'bg-text-muted'
                    }`} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-text-muted">SIGNALS OBSERVED</span>
                <span className="text-sm font-mono text-lime font-bold">LIVE</span>
              </div>

              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent animate-scan-line" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
