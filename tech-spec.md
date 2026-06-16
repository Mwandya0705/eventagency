# Technical Specification — Major Media Agency

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14 | Framework, SSG/SSR, file-based routing |
| react | ^18 | UI library |
| react-dom | ^18 | React DOM renderer |
| typescript | ^5 | Type safety |
| tailwindcss | ^3 | Utility-first CSS |
| gsap | ^3.12 | Animation engine, ScrollTrigger, timelines |
| lenis | ^1.1 | Smooth scroll with inertia |
| three | ^0.160 | WebGL rendering for post-processing effects |
| @types/three | ^0.160 | Three.js type definitions |
| shadcn/ui | latest | Component primitives (Button, Input, Select) |
| class-variance-authority | ^0.7 | Component variant management |
| clsx | ^2 | Conditional classnames |
| tailwind-merge | ^2 | Tailwind class deduplication |

## Component Inventory

### Layout

| Component | Source | Reuse |
|-----------|--------|-------|
| Navbar | Custom | All pages — fixed nav with active state |
| Footer | Custom | All pages — minimal links bar |
| SmoothScrollProvider | Custom (Lenis) | All pages — wraps app in Lenis context |
| PageTransition | Custom | All pages — route change animation |

### Sections

| Component | Page | Notes |
|-----------|------|-------|
| CardStack | Home | Pinned scroll section with 6 cards |
| Card | CardStack | Individual 3D card with image + caption |
| TextGlowTransition | Home | Fullscreen "ACCELERATE" between cards 3-4 |
| PreFooterCTA | Home | Simple CTA after card stack unpins |
| PortfolioHero | Portfolio | Page heading |
| ProjectGrid | Portfolio | Filterable grid of project cards |
| FilterBar | Portfolio | Service filter pills + search |
| ProjectCard | ProjectGrid | Hoverable project thumbnail card |
| AboutHero | About | Heading + tagline |
| AboutDescription | About | Body text section |
| ServicesList | About | 5 services in 2-col grid |
| ClientLogos | About | Logo grid with grayscale |
| ContactHero | Contact | Heading + description |
| ContactFormCard | Contact | Form card with inputs |

### Shared Components

| Component | Source | Used By |
|-----------|--------|---------|
| ProgressBar | Custom | Home — segmented scroll indicator |
| DecorativeOrbs | Custom | Home — mouse-reactive gradient orbs |
| LoadingScreen | Custom | Home — image preload gate |
| ScrambleText | Custom | CardStack — text decode animation |

## Animation Implementation

| Animation | Library | Implementation | Complexity |
|-----------|---------|---------------|------------|
| 3D Card Stack (scroll-driven rotation + translation) | GSAP ScrollTrigger | Single ScrollTrigger with scrub, RAF loop updates `--r` and `--y` CSS vars per card. First card: -35deg rotation, subsequent: -65deg. Image scale 1.4→1.0. | High |
| Pixel Distortion Transition | Three.js (ShaderMaterial) | Two-texture shader with grid-based noise distortion, RGB split, pixelation, scale/rotation transition. Rendered on separate WebGL canvas behind DOM. Triggered by scroll progress crossing card boundaries. | High |
| Text Glow Transition | Three.js (ShaderMaterial) | Distance-field text rendering with glow pulse. Offscreen canvas renders "ACCELERATE" to texture. Shader controls fill, glow, fade. Composited at scroll position between cards 3-4. | High |
| Mouse-Reactive Orbs | Vanilla JS + RAF | Lerp-interpolated mouse tracking, scroll velocity reactivity. Two orb divs with CSS gradient backgrounds. Updated inside Lenis RAF loop. | Low |
| Text Scramble Reveal | Vanilla JS (setInterval) | Character-by-character random scramble settling to final text. 1000ms duration, 50ms char delay. Sine-wave stagger via `Math.sin(index)`. | Low |
| Title Letter Scale-In | GSAP | `fromTo` on each letter span: opacity 0.2→1, scale 0.2→1. Stagger `0.03 * Math.sin(index)`, duration 0.4s, ease power2.inOut. | Medium |
| Loading Screen | GSAP | Simple opacity fade-out after all images load. Black bg, white "MAJOR" text with CSS pulse. | Low |
| Portfolio Grid Hover | CSS | Grayscale→color, scale 1→1.05, title overlay fade-in. Pure CSS transitions. | Low |
| Filter Pills | CSS + React State | Active state toggled via React. CSS border/background transitions. | Low |
| Page Transitions | GSAP | Fade out current page, navigate, fade in new page. 300ms duration. | Low |
| Smooth Scroll | Lenis | `lerp: 0.08`. Integrated with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. | Low |

## State & Logic

**Image Preloading (Home):**
All 6 card background images must be fully decoded before the scroll animation begins. Use `Promise.all` with `Image` objects. Show `<LoadingScreen />` until resolved. Hide loading screen with GSAP fade-out.

**Card Stack Scroll State:**
A single GSAP ScrollTrigger with `scrub: true` drives the entire animation. On every progress update, compute which card is active (`cardProgress > 0.5 && cardProgress < 1`), update CSS custom properties `--r` and `--y` for all 6 cards, and scale images. No React state for this — direct DOM manipulation via refs for 60fps performance.

**Pixel Transition Trigger:**
Track `currentCard` index from scroll progress. When index changes, trigger a GSAP timeline that animates `uTransitionProgress` 0→1 over 800ms. After completion, swap textures and reset progress to 0. Only one transition active at a time.

**Orb Reactivity:**
Mouse position stored in a ref (not state). Updated via `mousemove` listener. Orb positions computed in the Lenis RAF callback using lerp interpolation. Scroll velocity derived from `scroll.y - prevScrollY`.

**Portfolio Filtering:**
React state: `activeFilter` (string), `searchQuery` (string). Filter projects array client-side. No API calls.

**Contact Form:**
React state for form fields. Client-side validation for required fields. Submit handler logs to console (no backend). No external form service.

## Architecture Decisions

**Three.js Integration Pattern:**
The pixel distortion and text glow effects use Three.js but are isolated to the Home page. Create a `PixelDistortionCanvas` component that manages its own WebGLRenderer lifecycle. The canvas is `position: absolute` behind the card stack DOM layer. All Three.js objects (scenes, cameras, renderers, geometries, materials) are created and disposed in `useEffect` cleanup to prevent memory leaks.

**No R3F (React Three Fiber):**
The Three.js usage is a single post-processing pipeline with custom shaders, not a 3D scene graph. R3F's declarative model adds overhead without benefit. Use imperative Three.js via refs.

**ScrollTrigger Integration with Lenis:**
Initialize Lenis in `_app.tsx` (or layout) via `SmoothScrollProvider`. Bridge to GSAP in the provider: `lenis.on('scroll', ScrollTrigger.update)`. The CardStack component creates its own ScrollTrigger instance that references the shared Lenis instance via context.

**CSS Custom Properties for Card Transforms:**
The card rotation and Y-translation are written directly to CSS custom properties (`--r`, `--y`) on each card element on every frame. This avoids React re-renders and GPU-composits the transforms. The RAF loop reads scroll progress from GSAP and writes to DOM refs.

**Text Splitting Strategy:**
Card titles are split into individual `<span>` elements (one per character) at mount time using a utility function. Spaces rendered as `&nbsp;`. This is done once per card and cached — not re-split on re-render.

## Shader Architecture

Three custom GLSL shaders:

1. **CardFragmentShader** — Two-texture mix with distortion noise, RGB split, pixelation, scale/rotation. Used by Card mesh materials.

2. **PostProcessFragmentShader** — Grid-based noise distortion, RGB channel split, per-card UV scale/rotation, chromatic aberration. Used by PixelDistortionEffect fullscreen quad.

3. **TextGlowFragmentShader** — Distance-field text rendering with fill progress, glow intensity, fade-out. Used by TextGlowTransition.

All shaders use standard Three.js `ShaderMaterial` with custom uniforms. Vertex shaders are pass-through (assign `vUv`, compute `gl_Position`).
