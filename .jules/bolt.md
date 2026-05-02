## 2024-05-18 - Avoid layout thrashing in Framer Motion animations
**Learning:** Animating the `width` property (or other layout properties like `height`, `top`, `left`) using `framer-motion` causes expensive browser layout reflows on every frame, which can lead to janky animations and poor performance, especially on mobile devices.
**Action:** Always prefer animating GPU-accelerated CSS properties like `transform` (e.g., `scaleX`, `translateX`) and `opacity`. For progress bars, use `scaleX` with `transform-origin: left` (e.g., Tailwind's `origin-left`) instead of `width`.
