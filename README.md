# Xray

**Browser Observability Research Laboratory**

Xray is an interactive browser-security research platform that demonstrates what a normal website can observe about user activity through standard web APIs. No data is collected, stored, or transmitted — everything runs locally in your browser.

## What is Xray?

Xray turns browser observability into a hands-on experience. Instead of reading documentation about what websites *can* detect, you interact with a page and watch it react in real time.

## Features

### Interactive Laboratory

10 real-time detection cards that respond to actual browser events:

| Card | Trigger |
|------|---------|
| Tab Switch | Switch to another tab or window |
| Left Click | Click anywhere on the page |
| Right Click | Right click for context menu |
| Scroll | Scroll up or down |
| Keyboard | Press any key |
| Copy | Copy selected content |
| Paste | Paste from clipboard |
| Network | Toggle your connection |
| Touch | Touch on mobile devices |
| Drag | Drag and drop items |

### Live Signal Feed

Every browser event is recorded in real time with timestamps, event types, and descriptions. Events persist in `localStorage` across sessions.

### Research Section

Educational content explaining:
- What websites can observe
- What can be inferred from signals
- What cannot be directly known

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations
- **Lucide React** — icons
- **Playwright** — testing

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npx playwright test

# Production build
npm run open
```

## Architecture

```
src/
  components/     # UI components
  detectors/      # Browser detector modules
  engine/         # Event store + detector manager
  data/           # Static configuration
  types/          # TypeScript interfaces
```

## Privacy

- No data transmitted
- No tracking
- No fingerprinting
- Events stored only in browser localStorage
- Keyboard values never captured

## License

MIT
