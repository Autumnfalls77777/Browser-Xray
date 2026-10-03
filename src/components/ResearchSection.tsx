import { motion } from 'framer-motion'
import { Eye, Brain, ShieldX } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: 'WHAT WE CAN OBSERVE',
    color: 'text-lime',
    borderColor: 'border-lime/30',
    items: [
      'Whether the page is visible or hidden',
      'Whether the window has focus',
      'Pointer position and movement',
      'That keyboard input occurred',
      'Left and right clicks',
      'Scroll direction and activity',
      'Copy and paste actions',
      'Fullscreen state',
      'Viewport dimensions',
      'Page lifecycle events',
      'Network connectivity status',
      'Touch events on mobile',
      'Drag and drop operations',
    ],
  },
  {
    icon: Brain,
    title: 'WHAT WE CAN INFER',
    color: 'text-purple',
    borderColor: 'border-purple/30',
    items: [
      'User may have switched tabs',
      'User may be interacting with another window',
      'User may have resized their browser',
      'User may have entered fullscreen intentionally',
      'Approximate time spent on page',
      'User may be copying content for later use',
    ],
  },
  {
    icon: ShieldX,
    title: 'WHAT WE CANNOT DIRECTLY KNOW',
    color: 'text-red',
    borderColor: 'border-red/30',
    items: [
      'What the user is doing in another tab',
      'What the user is typing',
      'What other applications are open',
      'The user\'s physical location',
      'The user\'s identity',
      'Browsing history',
      'What content was copied or pasted',
    ],
  },
]

export function ResearchSection() {
  return (
    <section id="research" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
            Research
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          What does the browser actually reveal?
        </h2>
        <p className="text-text-secondary mt-3 max-w-2xl">
          Understanding the boundary between observation and inference is key to
          browser security research.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`glass-panel rounded-xl p-6 border ${section.borderColor}`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-lg bg-charcoal/50 flex items-center justify-center`}>
                <section.icon className={`w-5 h-5 ${section.color}`} />
              </div>
              <h3 className={`text-sm font-mono font-bold tracking-wider ${section.color}`}>
                {section.title}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {section.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${section.color.replace('text-', 'bg-')}`} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
