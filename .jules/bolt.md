## 2023-10-27 - Framer Motion Layout Properties Anti-Pattern
**Learning:** Found an anti-pattern where layout properties like `width` were being animated using `framer-motion` for a frequently updating component (`ProgressBar`). This causes expensive layout reflows on the main thread for every frame of the animation, leading to higher CPU usage and potential jank on lower-end devices. The preferred approach in this codebase (and general React/Framer ecosystem) is to use `transform` properties like `scaleX` which can be offloaded to the GPU (compositing).
**Action:** When animating progress bars or similarly expanding/shrinking elements, apply a 100% base width (`w-full`), set the origin (`originX: 0` or `origin-left`), and animate `scaleX` between 0 and 1 instead of changing pixel/percentage `width`.

## 2024-05-18 - Missing Component Memoization under Timer Contexts
**Learning:** `TimerScreen` updates state (`timeLeft`) every second during workouts. Without memoization, this frequent update cascades to heavy child components like `YouTubePlayer`, causing unnecessary Virtual DOM diffing (and iframe reflow considerations) every second.
**Action:** Always wrap static or semi-static expensive components (like iframes or large static visual elements) in `React.memo` when they are children of components driven by timers (`setInterval`, `requestAnimationFrame`).
