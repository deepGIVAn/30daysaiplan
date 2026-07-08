# Visual Design System

Brand look and feel for Proposal Studio — backgrounds, light, colour, typography, surfaces, and icons. No content or layout specs.

---

## 1. Creative direction

**Name:** Midnight Indigo

**Feel:** Premium editorial. Cinematic, not corporate-flat. High contrast with generous breathing room. Light behaves like volumetric beams through a dark atmosphere — never harsh or neon.

**Mood keywords:** Authoritative · Visionary · Global · Luxurious · Calm confidence

**What to avoid:** Warm oranges/yellows, flat grey SaaS palettes, busy patterns, thin low-contrast grey text on dark backgrounds.

---

## 2. Background system

The app background is built in **four layers**, bottom to top:

```
┌─────────────────────────────────────────┐
│  4. Grain overlay (4% opacity, overlay) │
├─────────────────────────────────────────┤
│  3. UI content (z-10)                   │
├─────────────────────────────────────────┤
│  2. Aurora drift (animated, z-0)        │
├─────────────────────────────────────────┤
│  1. Base fill + aurora on <body>        │
└─────────────────────────────────────────┘
```

### 2.1 Base fill

Solid midnight base behind everything:

| Token | OKLCH | Approx. hex |
|-------|-------|-------------|
| `--background` | `oklch(0.12 0.03 270)` | ~`#0a0a1a` |

Hue **270** anchors the entire palette in deep blue-violet.

### 2.2 Aurora (ambient light)

Three stacked **radial gradients** simulate soft coloured light pools — like aurora or stage wash:

| Pool | Position | Colour | Opacity |
|------|----------|--------|---------|
| 1 | Top-left (20% 0%) | `oklch(0.45 0.25 275)` | 35% |
| 2 | Upper-right (80% 20%) | `oklch(0.50 0.22 295)` | 25% |
| 3 | Bottom-centre (50% 100%) | `oklch(0.40 0.22 260)` | 30% |

- Applied on `<body>` as `background-image`, fixed attachment, full viewport.
- Duplicated in `.aurora-bg` with a slow **20s drift** animation (`translate` + slight `scale`) for subtle movement.
- Ellipse sizes: 80×50%, 60×50%, 70×60% — large, soft, never sharp-edged.

**Intent:** Indigo and violet light bleeding into navy darkness. No hard spotlight circles.

### 2.3 Film grain

`.grain::after` adds a **fractal noise** SVG texture:

- Opacity: **4%**
- Blend mode: **overlay**
- Covers full viewport, pointer-events none

**Intent:** Breaks digital flatness; adds magazine-print texture without visible dots at normal viewing distance.

### 2.4 JARVIS grid (optional accent layer)

Used in the voice assistant canvas only:

- 32×32px indigo grid lines at **8% opacity**
- Masked with radial fade so lines only appear in the centre 80×70% ellipse

---

## 3. Colour palette

### 3.1 Core tokens (OKLCH)

All semantic colours live in `:root` in `src/styles.css`.

| Token | OKLCH | Role |
|-------|-------|------|
| `--background` | `0.12 0.03 270` | Page base |
| `--foreground` | `0.97 0.01 250` | Primary text |
| `--surface` | `0.16 0.035 270` | Recessed panels |
| `--surface-elevated` | `0.20 0.04 270` | Raised panels |
| `--card` | `0.16 0.035 270` | Card fill |
| `--indigo` / `--primary` | `0.58 0.22 275` | Brand accent, buttons, focus rings |
| `--indigo-glow` | `0.70 0.20 280` | Labels, icon stroke, highlights |
| `--secondary` | `0.22 0.04 270` | Secondary surfaces |
| `--muted` | `0.22 0.04 270` | Muted backgrounds |
| `--muted-foreground` | `0.65 0.03 260` | Secondary text |
| `--accent` | `0.28 0.08 275` | Hover / emphasis fills |
| `--destructive` | `0.65 0.22 25` | Errors, delete actions |
| `--border` | `white / 8%` | Hairline borders |
| `--input` | `white / 10%` | Input borders |
| `--ring` | `0.58 0.22 275` | Focus ring (matches indigo) |

### 3.2 Hex equivalents (for external tools)

| Name | Hex | Usage |
|------|-----|-------|
| **Brand red** | `#C10100` | Accent bars, icon badges on white, links |
| **Indigo** | `#6366F1` | Primary accent, rules, solid bars |
| **Indigo glow** | `#818CF8` | Labels, icon colour on dark |
| **Deep indigo** | `#1E1B4B` | Dot patterns, fallback fills |
| **Slide dark** | `#0F0F1A` | Dense dark panels |
| **White** | `#FFFFFF` | Light cards, inverse text |

### 3.3 Text on dark vs light

**On dark surfaces:**

| Level | Treatment |
|-------|-----------|
| Headline | `--foreground` (near white) |
| Body | White ~80% opacity |
| Muted | `--muted-foreground` or white ~45–55% |
| Label | `--indigo-glow`, uppercase, wide tracking |

**On white / light cards:**

| Level | Hex |
|-------|-----|
| Title | `#111827` (gray-900) |
| Body | `#4B5563` (gray-600) |
| Tertiary | `#6B7280` (gray-500) |
| Accent label | `#C10100` (brand red) |

### 3.4 Selection

Text selection highlight: `oklch(0.58 0.22 275 / 0.4)` — indigo at 40%.

---

## 4. Typography

### 4.1 Font families

| Role | Family | CSS class | Notes |
|------|--------|-----------|-------|
| **Display** | Montserrat | `.font-display` | Headings, titles |
| **Body** | Inter | default / `--font-sans` | Paragraphs, UI, inputs |
| **Label** | Inter (medium) | `.font-label` | Uppercase micro-labels |
| **Mono** | Inter | `.font-mono` | Numbers, code (not a separate mono face) |

Loaded via Google Fonts. `font-feature-settings: "ss01", "cv11"` on body for refined Inter glyphs.

### 4.2 Display (Montserrat)

- Weight: **Semibold** or **Bold** for headings
- Letter-spacing: **-0.01em** (slightly tight)
- Use for: page titles, section headlines, card titles on dark

### 4.3 Labels (Inter, uppercase)

- Weight: **500**
- Transform: **uppercase**
- Letter-spacing: **0.18em** (up to **0.22em** for smaller labels)
- Colour: **indigo glow**
- Use for: section tags, metadata keys, table column headers

### 4.4 Body (Inter)

- Weight: **400** regular, **500** medium for emphasis
- Line-height: **1.45–1.6** for readable blocks
- `-webkit-font-smoothing: antialiased`

### 4.5 Type hierarchy (app UI)

| Element | Class | Typical size |
|---------|-------|--------------|
| Page title | `font-display font-semibold` | `text-3xl` – `text-4xl` |
| Section title | `font-display` | `text-xl` – `text-2xl` |
| Body | default | `text-sm` – `text-base` |
| Micro label | `font-label` | `text-[10px]` – `text-xs` |

---

## 5. Surfaces & depth

### 5.1 Glass surfaces

| Class | Background | Border | Blur |
|-------|------------|--------|------|
| `.surface` | `white / 3%` | `white / 8%` | 20px |
| `.surface-elevated` | `white / 5%` | `white / 10%` | 24px |

Used for cards, panels, and nav segments sitting on the aurora background.

### 5.2 Common border treatments

| Pattern | Value | Where |
|---------|-------|-------|
| Hairline | `white / 8%` | `.hairline`, default borders |
| Panel | `white / 10–15%` | Segmented controls, cards |
| Hover | `white / 5%` fill | Interactive rows, buttons |
| Focus | `ring-indigo / 50%` | Inputs, toggles |

### 5.3 Shadows

**Glow** (`--shadow-glow`):

- 1px indigo ring at 25% opacity
- Large soft drop: `0 20px 60px -20px` indigo at 55%

Used on primary buttons, logo avatar, JARVIS orb.

**Card** (`--shadow-card`):

- Inset 1px white highlight at 4%
- Deep drop: `0 20px 50px -25px` black at 60%

Used on elevated content cards.

### 5.4 Corner radius

Base `--radius: 0.75rem` (12px). Scale up for larger containers:

| Token | Value |
|-------|-------|
| `--radius-sm` | base − 4px |
| `--radius-lg` | 12px |
| `--radius-xl` | base + 4px |
| `--radius-2xl` | base + 8px |

UI cards typically `rounded-xl` (12px) or `rounded-2xl` (16px).

### 5.5 Shimmer (loading accent)

Animated horizontal gradient sweep:

- Centre: indigo at 30%
- 2s linear infinite
- Used for progress / loading states

---

## 6. Icon system

Icons are **Lucide** (stroke-based). Colour and container depend on context.

### 6.1 On dark backgrounds — indigo circle badge

```
   ╭──────╮
   │  ○   │  ← Circle: indigo fill 20%, border indigo 40%
   │ icon │  ← Icon: indigo-glow (#818CF8), ~20px
   ╰──────╯
```

| Property | Value |
|----------|-------|
| Container | Circle, `bg-indigo/20`, `border-indigo/40` |
| Icon colour | `text-indigo-glow` |
| Icon size | `size-4` – `size-5` (16–20px) |
| Container size | `size-12` (48px) typical |

**Use for:** feature points, pillar lists, credibility bullets on dark panels.

### 6.2 On white cards — red square badge

```
   ┌──────┐
   │ ■    │  ← Square: solid #C10100, rounded-lg
   │ icon │  ← Icon: white
   └──────┘
```

| Property | Value |
|----------|-------|
| Container | `bg-[#c10100]`, `rounded-lg` |
| Icon colour | `text-white` |
| Icon size | `size-3.5` – `size-5` |
| Container size | `size-6` – `size-10` depending on density |

**Use for:** metadata keys, challenge items, call-to-action markers on white cards.

### 6.3 Inline / navigation icons

| State | Colour |
|-------|--------|
| Default | `text-muted-foreground` |
| Active / hover | `text-foreground` or `text-indigo` |
| On indigo button | `text-white` |
| Destructive hover | `text-destructive` |

Stroke width: **1.6** for nav icons (slightly lighter than default).

### 6.4 JARVIS orb

- Gradient fill: `from-indigo to-indigo-glow`
- Shadow: indigo glow `oklch(0.58 0.22 275 / 0.8)`
- Pulse ring: `bg-indigo/30` animated ping

### 6.5 Icon stroke in exports

When rasterised for PowerPoint, icon stroke is **`#818CF8`** (indigo glow) to match the web preview.

---

## 7. Light & atmosphere on content panels

These patterns appear on white cards and photo-backed areas (not the app shell aurora).

### 7.1 Photo overlay

Full-bleed photos get a **dark indigo wash** (~45% opacity) so white type stays readable.

### 7.2 White card atmosphere

Light cards use subtle depth cues:

| Effect | Spec |
|--------|------|
| Dot grid | Indigo `#1E1B4B` dots, 1.2px, 14px spacing, **4.5% opacity** |
| Red corner glow | `#C10100` at 10%, blurred circle, top-right |
| Indigo corner glow | Indigo at 10%, blurred circle, bottom-left |
| Bottom accent bar | **4px solid `#C10100`** along card bottom edge |

### 7.3 Gradient accent bars

Vertical **4px indigo bars** on panel edges act as brand punctuation — solid `#6366F1` or gradient from indigo → indigo-glow → transparent.

### 7.4 Section rule

Short horizontal bar under headlines: **40px × 2px**, indigo, fully rounded ends.

---

## 8. Interactive states

| State | Treatment |
|-------|-----------|
| Hover (row/button) | `bg-white/5` on dark |
| Active tab / toggle | `bg-white/8–10%`, `border-white/15%` |
| Focus | `ring-2 ring-indigo/50` |
| Link hover | `text-indigo` transition |
| Loading spinner | `text-indigo-glow` + spin |
| Progress % | `text-indigo-glow` tabular nums |

---

## 9. Quick reference

```
BACKGROUND     oklch(0.12 0.03 270)  +  aurora radials  +  4% grain
PRIMARY        oklch(0.58 0.22 275)  /  #6366F1
GLOW           oklch(0.70 0.20 280)  /  #818CF8
BRAND RED      #C10100
TEXT           oklch(0.97 0.01 250)  on dark
MUTED TEXT     oklch(0.65 0.03 260)
DISPLAY FONT   Montserrat semibold
BODY FONT      Inter
LABEL          Inter 500 uppercase 0.18em tracking indigo-glow
BORDER         white 8%
SURFACE        white 3–5% + blur 20–24px
ICON (dark)    indigo circle + indigo-glow stroke
ICON (light)   red square + white stroke
```

---

*Source of truth: `src/styles.css`, `src/lib/brand-fonts.ts`, `src/components/app-shell.tsx`*
