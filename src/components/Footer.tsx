const techStack = ['React', 'TypeScript', 'Vite', 'Browser APIs']

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-charcoal/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="font-mono font-black text-xl tracking-tight text-lime">
              X<span className="text-text-primary">ray</span>
            </span>
            <p className="text-sm text-text-secondary max-w-md mt-2">
              Browser observability research laboratory.
              An experimental platform for understanding what websites can observe.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/10 border border-lime/20">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span className="text-[10px] font-mono text-lime tracking-wider">LOCAL EXPERIMENT</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple/10 border border-purple/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple" />
                <span className="text-[10px] font-mono text-purple tracking-wider">NO DATA TRANSMITTED</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {techStack.map(tech => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-charcoal/50 border border-border text-[10px] font-mono text-text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-text-muted">
            Xray — Browser Observability Research Platform
          </span>
          <span className="text-xs text-text-muted">
            Phase 1: Frontend Only
          </span>
        </div>
      </div>
    </footer>
  )
}
