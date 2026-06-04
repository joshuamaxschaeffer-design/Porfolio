# Animations & Motion — The Backend

This codebase has a full animation toolkit baked in. Every effect respects `prefers-reduced-motion`, and the heavy libraries (Lottie) are dynamically loaded so they never bloat the main bundle.

## What's available

| Library / Component | Purpose | Cost |
|---|---|---|
| **motion** (Framer Motion) | Declarative animations, springs, gestures, scroll-linked | ~30KB gzipped, in main bundle |
| **Lenis** | Buttery smooth scroll | ~10KB gzipped, in main bundle |
| **@lottiefiles/dotlottie-react** | Lottie / vector animation player | ~50KB, dynamically loaded |
| **CSS 3D transforms** (built-in) | 3D hover, tilt effects | Free |
| **CSS `filter: drop-shadow`** | Shadows that follow PNG transparency | Free |
| **CSS `mask-image`** | Clip an image (and its shadow) to another image's silhouette | Free |

## Primitives (in `components/animation/`)

### `<SmoothScroll />`
Wraps the layout once. Adds Lenis smooth scroll. Auto-disables for users with reduced-motion preference. Already mounted in `app/(frontend)/layout.tsx`.

### `<Reveal>`
Wraps any child for a one-shot scroll-reveal animation. Fades + translates as the element enters the viewport.

```tsx
<Reveal direction="up" delay={120}>
  <h2>Quietly appears as you scroll</h2>
</Reveal>
```

Props: `direction` (`up` / `down` / `left` / `right` / `none`), `distance` (px), `delay` (ms), `duration` (s), `amount` (% in-view), `repeat` (animate every entry).

### `<MotionImage>`
The full-featured image component for any visual block. Handles skew, rotation, four shadow styles, mask-to-another-image clipping, and three hover behaviors — all from props.

```tsx
<MotionImage
  src="/work/baserate-hero.png"
  alt="Baserate dashboard"
  skewX={-3}
  rotate={1.5}
  shadow="drop-png"
  shadowColor="#1a3a8a"
  shadowBlur={40}
  shadowOffsetY={24}
  hover="tilt-3d"
  rounded="lg"
/>
```

Shadow modes:

- **none** — no shadow
- **soft** — subtle box-shadow
- **dramatic** — deep box-shadow
- **colored** — custom-colored box-shadow with offset/blur
- **drop-png** — uses `filter: drop-shadow()` so the shadow follows transparent PNG silhouettes (perfect for product shots)

Hover modes:

- **none** — static
- **lift** — translates up 6px on hover
- **tilt-3d** — cursor-tracked 3D rotation
- **parallax-skew** — additional skew on hover

**Clipping a shadow to another image's shape:** Pass `maskImageUrl` pointing to a second transparent image. The first image renders inside the silhouette of the second; combined with `shadow="drop-png"`, the shadow takes that shape too.

### `<Tilt3D>`
Wraps any content (card, image, component) for the mouse-tracked 3D tilt that Linear / Stripe / Vercel popularized. Optional cursor-following shine.

```tsx
<Tilt3D max={10} shine scale={1.02}>
  <CaseStudyCard {...cs} />
</Tilt3D>
```

~3KB. No Three.js needed.

### `<LottieAnimation>`
Plays Lottie animations (vector animations exported from After Effects, Rive, or LottieFiles). Dynamically imported so it doesn't ship until the page actually uses it.

```tsx
<LottieAnimation
  src="/animations/process.lottie"
  loop
  autoplay
  playOnHover={false}
/>
```

Best for: micro-interactions, loading indicators, illustrated explainers, brand-coded vector motion.

### `<Marquee>`
Infinite horizontal scroll. Wrap logos, words, testimonials.

```tsx
<Marquee duration={40} direction="left" pauseOnHover>
  {logos.map((logo) => <LogoCard key={logo.id} {...logo} />)}
</Marquee>
```

## CMS Blocks for animations

The CMS surfaces three animation-focused blocks so non-code editing covers most needs:

1. **Motion Image** (`motionImage`) — every prop of `<MotionImage>` is editable in the admin. Drop one on any page, set the skew/shadow/hover from a form.
2. **Lottie** (`lottie`) — upload a .lottie or .json file to Media, drop the block on any page, configure loop/autoplay/playOnHover.
3. **Marquee Logos** (`marqueeLogos`) — infinite-scrolling logo strip with adjustable speed and direction.

For one-off advanced effects (e.g., a custom Three.js scene), build a bespoke React component and either:
- Reference it from inside the Hero block's "animation" background option, or
- Add a new block type (see `CLAUDE.md` → "Adding a new block type")

## Scroll-linked animations

For Linear-style scroll-controlled hero animations, use motion's `useScroll` + `useTransform`:

```tsx
'use client'
import { motion, useScroll, useTransform } from 'motion/react'

export function ScrollHero() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  return (
    <motion.div style={{ y, opacity }}>
      Hero that drifts and fades as you scroll
    </motion.div>
  )
}
```

For more advanced scroll-scrubbing (e.g., scrubbing a sequence of frames), add GSAP later as an optional dependency.

## Reduced-motion strategy

All primitives respect `prefers-reduced-motion` automatically. When a user has it set:

- `<SmoothScroll />` no-ops (native scroll instead)
- `<Reveal>` renders the child immediately with no animation
- `<MotionImage>` and `<Tilt3D>` skip hover animations
- `<LottieAnimation>` pauses (renders the first frame)
- `<Marquee>` renders static (logos in a row, no movement)

This is non-negotiable for accessibility and a good signal to senior buyers who check the small things.

## Performance budgets

| Metric | Target | How |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 95 | Self-hosted fonts, next/image, dynamic Lottie, no CLS |
| Largest Contentful Paint | < 2.0s on mobile | Hero image with `priority`, optimized via Vercel Image CDN |
| Interaction to Next Paint | < 200ms | No big synchronous work, motion runs on rAF |
| Cumulative Layout Shift | < 0.05 | All images have explicit dimensions or `fill` + aspect ratios |
| Main bundle (JS gzipped) | < 150 KB on first paint | Lottie / Three.js are dynamic; only what each page uses ships |

### Concrete performance practices

- **`next/image` everywhere.** Never plain `<img>`. Always set `sizes`.
- **`priority` only on the hero image.** Everything else lazy-loads by default.
- **`next/font/local`** for any custom font you add. Don't fetch from Google at runtime.
- **`'use client'` only when needed.** Server components by default. (`MotionImage`, `Tilt3D`, `Lottie`, `Marquee` are client; everything else server.)
- **Dynamic-import heavy libraries:**
  ```tsx
  const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false })
  ```
- **Suspend / skeleton during loading** — don't block the page on slow data.
- **Run a Lighthouse audit on every major PR.** Vercel offers this built-in.

## When to add Three.js

The base bundle doesn't include Three.js — it's heavy (~150KB+ for fiber + drei + three). Add it only when you have a specific scene that needs it (e.g., a 3D product on the homepage). When you do:

```bash
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

Then wrap your scene in a dynamic import with `ssr: false`:

```tsx
const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })
```

For the standard "3D tilt" hover effect, **don't reach for Three.js** — use `<Tilt3D>` which is ~50× lighter.

## Responsive

Tailwind v4 default breakpoints:

- `sm:` 640px
- `md:` 768px (tablet)
- `lg:` 1024px
- `xl:` 1280px (desktop)
- `2xl:` 1536px

Conventions in this repo:

- **Mobile-first.** Default styles target ~375px width. Add breakpoints for larger.
- **Three real breakpoints in use:** mobile (default), `md:` (tablet), `lg:` (desktop). The others are escape hatches.
- **Touch targets ≥ 44px.** Every interactive element.
- **`sizes` on every `next/image`.** Browser uses it to pick the right image variant.
- **Test on a real phone**, not just dev tools. iPhone Safari is the canonical test.
- **Hide nothing critical on mobile.** Logo wall, hero, primary CTA, contact link must all be reachable without horizontal scroll.

## Examples

### Skewed product image with colored shadow

```tsx
<MotionImage
  src="/work/baserate-screen.png"
  alt="Baserate analytics view"
  skewX={-3}
  shadow="colored"
  shadowColor="#1a3a8a"
  shadowBlur={48}
  shadowOffsetY={24}
  rounded="xl"
  hover="lift"
/>
```

### PNG product with shadow that hugs its silhouette

```tsx
<MotionImage
  src="/work/transparent-product.png"
  alt="Product"
  shadow="drop-png"
  shadowColor="rgba(0,0,0,0.4)"
  shadowBlur={30}
  shadowOffsetY={20}
  hover="tilt-3d"
/>
```

### Image clipped to another image's shape

Upload two transparent PNGs. Set the second as `maskImageUrl`. The render of the first is clipped to the silhouette of the second.

```tsx
<MotionImage
  src="/photos/portrait.jpg"
  alt=""
  maskImageUrl="/shapes/abstract-blob.png"
  shadow="drop-png"
  shadowColor="#000"
/>
```

### 3D hover card

```tsx
<Tilt3D max={10} shine scale={1.02}>
  <CaseStudyCard {...cs} />
</Tilt3D>
```

### Marquee of logos

```tsx
<Marquee duration={50} direction="left" pauseOnHover>
  {logos.map((logo) => (
    <Image key={logo.id} src={logo.image.url} alt={logo.name} width={140} height={40} />
  ))}
</Marquee>
```
