import type { DetectorConfig } from '@/types'

export const detectorConfigs: DetectorConfig[] = [
  {
    id: 'visibility',
    name: 'Tab Visibility',
    shortName: 'VISIBILITY',
    description: 'Detects whether the document is currently visible to the user.',
    category: 'visibility',
    browserAPI: 'document.visibilityState',
    icon: 'Eye',
    codeExample: `document.addEventListener('visibilitychange', () => {
  console.log(document.visibilityState);
  // "visible" or "hidden"
});`,
    tellsPage: 'Whether the page is currently visible or hidden.',
    doesNotTell: 'Why the page became hidden — the user may have switched tabs, minimized the window, or locked their screen.',
    limitation: 'The Page Visibility API only tells you that the document is hidden, not the reason.',
  },
  {
    id: 'focus',
    name: 'Window Focus',
    shortName: 'FOCUS',
    description: 'Detects when the browser window gains or loses focus.',
    category: 'focus',
    browserAPI: 'window.focus / window.blur',
    icon: 'Focus',
    codeExample: `window.addEventListener('focus', () => {
  console.log('Window focused');
});
window.addEventListener('blur', () => {
  console.log('Window blurred');
});`,
    tellsPage: 'Whether the browser window currently has focus.',
    doesNotTell: 'What the user is doing in another window or application.',
    limitation: 'Window blur does not prove a specific user action — it only indicates the window lost focus.',
  },
  {
    id: 'document-focus',
    name: 'Document Focus',
    shortName: 'DOC FOCUS',
    description: 'Checks whether the document currently has keyboard focus.',
    category: 'focus',
    browserAPI: 'document.hasFocus()',
    icon: 'FileSearch',
    codeExample: `if (document.hasFocus()) {
  console.log('Document has focus');
} else {
  console.log('Document does not have focus');
}`,
    tellsPage: 'Whether the document is the active target for keyboard input.',
    doesNotTell: 'Which specific element has focus or what the user is typing.',
    limitation: 'hasFocus() returns a boolean — it does not identify the focused element.',
  },
  {
    id: 'pointer',
    name: 'Pointer Movement',
    shortName: 'POINTER',
    description: 'Detects pointer movement anywhere on the page.',
    category: 'input',
    browserAPI: 'pointermove',
    icon: 'MousePointer2',
    codeExample: `window.addEventListener('pointermove', (e) => {
  console.log(e.clientX, e.clientY);
});`,
    tellsPage: 'Pointer position and movement across the entire page.',
    doesNotTell: 'What the user is pointing at outside the browser window.',
    limitation: 'Pointer events only fire within the browser viewport.',
  },
  {
    id: 'keyboard',
    name: 'Keyboard Activity',
    shortName: 'KEYBOARD',
    description: 'Detects that keyboard input occurred without storing key values.',
    category: 'input',
    browserAPI: 'keydown / keyup',
    icon: 'Keyboard',
    codeExample: `window.addEventListener('keydown', () => {
  console.log('Keyboard activity detected');
  // Key values are NOT stored
});`,
    tellsPage: 'That a key was pressed or released.',
    doesNotTell: 'Which key was pressed — this implementation deliberately does not store key values.',
    limitation: 'This detector records activity only. Key values are never captured or stored.',
  },
  {
    id: 'click',
    name: 'Left Click',
    shortName: 'L-CLICK',
    description: 'Detects left mouse button clicks anywhere on the page.',
    category: 'input',
    browserAPI: 'pointerdown',
    icon: 'MousePointerClick',
    codeExample: `window.addEventListener('pointerdown', (e) => {
  if (e.button === 0) {
    console.log('Left click at', e.clientX, e.clientY);
  }
});`,
    tellsPage: 'That a left click occurred and where.',
    doesNotTell: 'What the user intended to click on or why.',
    limitation: 'Click detection does not reveal the user\'s intent or the target element.',
  },
  {
    id: 'contextmenu',
    name: 'Right Click',
    shortName: 'R-CLICK',
    description: 'Detects right mouse button clicks (context menu).',
    category: 'input',
    browserAPI: 'contextmenu',
    icon: 'MousePointer',
    codeExample: `window.addEventListener('contextmenu', (e) => {
  console.log('Right click at', e.clientX, e.clientY);
});`,
    tellsPage: 'That a right click occurred and where.',
    doesNotTell: 'What menu item the user selected or what they intend to do.',
    limitation: 'Right click detection does not reveal the user\'s subsequent actions.',
  },
  {
    id: 'scroll',
    name: 'Scroll',
    shortName: 'SCROLL',
    description: 'Detects page scroll events and direction.',
    category: 'input',
    browserAPI: 'wheel',
    icon: 'ArrowUpDown',
    codeExample: `window.addEventListener('wheel', (e) => {
  console.log(e.deltaY > 0 ? 'Scrolled down' : 'Scrolled up');
});`,
    tellsPage: 'That the user scrolled and in which direction.',
    doesNotTell: 'What content the user is reading or how far they scrolled.',
    limitation: 'Scroll events do not reveal the user\'s reading intent or comprehension.',
  },
  {
    id: 'copy',
    name: 'Copy',
    shortName: 'COPY',
    description: 'Detects when the user copies content from the page.',
    category: 'input',
    browserAPI: 'copy',
    icon: 'Copy',
    codeExample: `document.addEventListener('copy', () => {
  console.log('Copy action detected');
});`,
    tellsPage: 'That the user copied something from the page.',
    doesNotTell: 'What content was copied — this implementation does not store clipboard data.',
    limitation: 'Copy detection does not reveal what was copied or where it was pasted.',
  },
  {
    id: 'paste',
    name: 'Paste',
    shortName: 'PASTE',
    description: 'Detects when the user pastes content into the page.',
    category: 'input',
    browserAPI: 'paste',
    icon: 'ClipboardPaste',
    codeExample: `document.addEventListener('paste', () => {
  console.log('Paste action detected');
});`,
    tellsPage: 'That the user pasted something into the page.',
    doesNotTell: 'What content was pasted — this implementation does not store clipboard data.',
    limitation: 'Paste detection does not reveal the source or content of the pasted data.',
  },
  {
    id: 'fullscreen',
    name: 'Fullscreen',
    shortName: 'FULLSCREEN',
    description: 'Detects when the page enters or exits fullscreen mode.',
    category: 'display',
    browserAPI: 'document.fullscreenElement',
    icon: 'Maximize',
    codeExample: `document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    console.log('In fullscreen');
  } else {
    console.log('Not in fullscreen');
  }
});`,
    tellsPage: 'Whether the page is currently in fullscreen mode.',
    doesNotTell: 'What the user sees on other monitors or applications.',
    limitation: 'Fullscreen state is binary — it does not reveal what content is displayed.',
  },
  {
    id: 'viewport',
    name: 'Viewport',
    shortName: 'VIEWPORT',
    description: 'Tracks browser window dimensions and resize events.',
    category: 'display',
    browserAPI: 'window.innerWidth / window.innerHeight',
    icon: 'Monitor',
    codeExample: `window.addEventListener('resize', () => {
  console.log(window.innerWidth, window.innerHeight);
});`,
    tellsPage: 'The current dimensions of the browser viewport.',
    doesNotTell: 'The physical screen resolution or what is visible outside the browser window.',
    limitation: 'Viewport dimensions do not equal screen resolution.',
  },
  {
    id: 'lifecycle',
    name: 'Page Lifecycle',
    shortName: 'LIFECYCLE',
    description: 'Detects page load, show, hide, and bfcache events.',
    category: 'lifecycle',
    browserAPI: 'pageshow / pagehide',
    icon: 'RefreshCw',
    codeExample: `window.addEventListener('pageshow', (e) => {
  console.log('Page shown', e.persisted);
});
window.addEventListener('pagehide', (e) => {
  console.log('Page hidden', e.persisted);
});`,
    tellsPage: 'When the page is shown, hidden, or restored from bfcache.',
    doesNotTell: 'What the user does after navigating away.',
    limitation: 'Lifecycle events do not track navigation destination or user intent.',
  },
  {
    id: 'network',
    name: 'Network Status',
    shortName: 'NETWORK',
    description: 'Detects when the browser goes online or offline.',
    category: 'network',
    browserAPI: 'navigator.onLine',
    icon: 'Wifi',
    codeExample: `window.addEventListener('online', () => {
  console.log('Back online');
});
window.addEventListener('offline', () => {
  console.log('Gone offline');
});`,
    tellsPage: 'Whether the browser currently has a network connection.',
    doesNotTell: 'What network the user is connected to or what they are doing online.',
    limitation: 'Network status does not reveal the user\'s network identity or activity.',
  },
  {
    id: 'touch',
    name: 'Touch',
    shortName: 'TOUCH',
    description: 'Detects touch events on touch-enabled devices.',
    category: 'input',
    browserAPI: 'touchstart',
    icon: 'Hand',
    codeExample: `window.addEventListener('touchstart', (e) => {
  console.log('Touch detected');
});`,
    tellsPage: 'That a touch occurred and where.',
    doesNotTell: 'What the user is touching outside the browser or their intent.',
    limitation: 'Touch events only fire on touch-enabled devices.',
  },
  {
    id: 'drag',
    name: 'Drag & Drop',
    shortName: 'DRAG',
    description: 'Detects drag and drop operations.',
    category: 'input',
    browserAPI: 'dragstart / drop',
    icon: 'GripVertical',
    codeExample: `document.addEventListener('dragstart', () => {
  console.log('Drag started');
});
document.addEventListener('drop', () => {
  console.log('Drop completed');
});`,
    tellsPage: 'That a drag operation started or completed.',
    doesNotTell: 'What is being dragged or where it is being dropped.',
    limitation: 'Drag events do not reveal the content being dragged or the drop target.',
  },
]
