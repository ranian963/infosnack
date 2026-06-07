# InfoSnack Design System

**인포스낵 (InfoSnack)** — *"정보를 간편하게, 한 입 크기로 · Snack your information"*

InfoSnack is a Korean AI-agent–team startup building a **knowledge-management service that turns scattered links into bite-sized, searchable, team-shareable snacks.** Members grab interesting content from YouTube, X, LinkedIn, Threads, Reddit, blogs, and newsletters via browser extension / share-sheet / Slack bot; the system crawls, OCRs, summarizes, tags, thumbnails it, and stores it in a Graph-RAG knowledge graph. The team gets weekly digests and a chatbot that answers questions across everything they've collected.

> **Core value prop:** *"좋은 인풋이 좋은 아웃풋을 만든다"* — good inputs make good outputs.

This repo is the source-of-truth design system for every InfoSnack surface — marketing site, web app (Next.js), Chrome extension, slides, and Slack/Google-Chat touchpoints.

---

## Source material

| File (original upload) | What it is | Stored at |
|---|---|---|
| `infosnack1.png` | English cookie wordmark ("InfoSnack" in chocolate-chip cookie letterforms) | `assets/logo-cookie-en.png` |
| `infosnack2.png` | Korean outline wordmark (인포스낵, blue cartoon outline with cookie-bite) | `assets/logo-outline-kr.png` |
| `infosnack3.jpg` | Korean cookie wordmark (인포스낵 in cookie letterforms) | `assets/logo-cookie-kr.jpg` |
| `infosnack4.png` | Snack-bag mascot (blue wrapper, cookie + `+` roundel) | `assets/mascot-snackbag.png` |
| PRD (pasted) | *InfoSnack PRD v1.0 (2025-01)* — full feature spec, brand section 0, tech stack, data model, roadmap | Sections below are derived from this; canonical colors + slogans come straight from PRD §0 |

No code or Figma was provided. UI kits are built against the **PRD spec** (features, flows, data model) using the brand system. When real product code/Figma arrives, we'll re-ground the UI kits against it.

---

## Index

```
README.md                    ← you are here
SKILL.md                     ← skill manifest (Claude Code compatible)
colors_and_type.css          ← CSS variables: color + type + shape + motion tokens
assets/                      ← logos, mascot, pattern assets
  ├─ logo-cookie-en.png      ← English primary wordmark
  ├─ logo-cookie-kr.jpg      ← Korean primary wordmark
  ├─ logo-outline-kr.png     ← Korean outline wordmark (UI chrome)
  └─ mascot-snackbag.png     ← app-icon mascot
preview/                     ← design-system cards (Design System tab)
ui_kits/
  ├─ marketing/              ← landing page
  └─ webapp/                 ← InfoSnack web app (feed, reader, chatbot, digest)
```

---

## CONTENT FUNDAMENTALS

The voice is **friendly, playful, and small**. Like a neighborhood bakery's signage, not a SaaS homepage. The PRD slogan *"정보를 간편하게, 한 입 크기로 · Snack your information"* sets the tone for everything.

### Tone & voice
- **Warm and conversational.** Talk like a friend sharing a good find, not a platform announcing a feature.
- **Small over big.** Everything is a "snack," a "bite," a "crumb," a "한 입." Avoid *platform*, *solution*, *ecosystem*, *unlock*, *leverage*.
- **Curious, never preachy.** We share info because it's interesting, not because the user "should" know it.
- **Playful but never snarky.** Cute, not clever.

### Casing
- **Sentence case** everywhere — headers, buttons, nav, menus. Never Title Case. Never ALL CAPS except the `eyebrow` micro-label (CSS `.eyebrow`, letter-spaced).
- Wordmark bicapitalization: **InfoSnack** and **인포스낵**. Never "Infosnack" or "INFOSNACK".

### Person & mixing
- **"You" / "너"** for the reader. **"We" / "우리"** for the team.
- Avoid "users." They are *snackers*, *readers*, or just *you*.
- Korean-first. 해요체, 친근하고 가볍게. English follows in parentheses or below where bilingual.
- Loan words stay romanized: **스낵**, **인포**, **다이제스트**, **챗봇**.

### Emoji
- **Very sparingly.** Never in UI chrome (buttons, tabs, nav, labels, empty states).
- OK in long-form editorial/digest content, max 1–2 per post. Prefer our illustrated cookie/snack marks over emoji.

### Sample microcopy (lifted / adapted from PRD intent)
| Surface | Korean | English |
|---|---|---|
| Tagline | 정보를 간편하게, 한 입 크기로 | Snack your information. |
| Empty feed | 아직 스낵이 없어요. 링크를 하나 담아볼까요? | No snacks yet. Save your first link. |
| Primary CTA | 한 입 담기 | Take a bite |
| Save confirmation | 스낵 단지에 잘 넣어뒀어요. | Tucked into your snack jar. |
| Weekly digest header | 이번 주 스낵 모음 | This week's snacks |
| Chatbot placeholder | 저장한 스낵에서 무엇이든 물어보세요 | Ask anything about your saved snacks |
| Loading | 포장 뜯는 중… | Unwrapping… |
| 404 | 부스러기뿐이에요. 이 페이지는 누가 먹어버린 것 같아요. | Crumbs. This page got eaten. |

### On-brand vs off-brand
| ✅ | ❌ |
|---|---|
| "오늘의 스낵이 도착했어요." | "새로운 콘텐츠가 업데이트되었습니다." |
| "다섯 입, 1분 컷." | "5개의 콘텐츠를 빠르게 확인하세요." |
| "이번 주엔 LangGraph 얘기가 많았네요." | "Weekly report generated successfully." |

---

## VISUAL FOUNDATIONS

### Core motifs
Every design decision traces to four visual ingredients:

1. **Cookie letterforms** — chunky rounded logos in cookie dough with chip speckles.
2. **Cartoon outline** — thick brown (`--choc-600` `#776C34`) stroke wrapping brand-forward elements.
3. **Snack-bag blue** — cheerful `#18AEF6` (PRD Primary Blue) — the wrapper color, the CTA color.
4. **Sprinkle dots** — small yellow + brown circles floating as texture, echoing chocolate chips + lemon dots on the wrapper.

### Color — PRD canonical
All hex values pulled verbatim from PRD §0.4.

| Role | Token | Hex | Usage |
|---|---|---|---|
| Primary Blue | `--sky-500` | `#18AEF6` | CTAs, headers, links, focus |
| Primary Blue (light) | `--sky-light` | `#19AFF7` | gradient step |
| Primary Blue (dark) | `--sky-dark` | `#16AAF1` | hover / active |
| Snack Yellow | `--cookie-400` | `#FBDB5B` | badges, highlights, the "pop" |
| Snack Gold | `--cookie-500` | `#F9D854` | gradient/accent |
| Snack Brown | `--choc-400` | `#A38F52` | cookie outline, decorative |
| Brown Dark | `--choc-600` | `#776C34` | sticker shadow, deep accent |
| White | `--white` | `#FFFFFF` | page bg |
| Gray Light | `--gray-light` | `#F5F5F5` | card bg (inset) |
| Gray | `--gray` | `#9E9E9E` | muted / placeholder |
| Gray Dark | `--gray-dark` | `#333333` | body text |

Semantic status colors (`success`, `warning`, `danger`, `info`) stay candy-bright to match brand energy. Dark mode is not v1 — warm paper is core identity.

### Typography

| Role | Family | Notes |
|---|---|---|
| Display (EN) | **Fredoka** 700 | Chunky rounded; closest free analog to cookie letters. |
| Display (KR) | **Jua** 400 | Korean poster face, pairs 1:1 with Fredoka. |
| Body | **Nunito** 400–800 | Rounded, friendly, strong at small sizes. Not Inter. |
| Handwritten (KR accent) | **Gaegu** 700 | For playful asides / captions. Sparingly. |
| Mono | **JetBrains Mono** | Code/data. |

> ⚠️ **Font substitution flag:** no custom InfoSnack font was provided — the cookie wordmark is an illustration, not a typeface. Fredoka + Jua are Google Fonts substitutes chosen for shape similarity to the logo. If the team has licensed a custom face, drop TTFs into `fonts/` and swap the `@import` at the top of `colors_and_type.css`.

### Spacing & layout
- **4pt grid.** Components breathe — default card padding is 24–32px, not 12–16px.
- Generous vertical rhythm. Snacks have air around them on the counter.
- Max widths: **1200px** marketing, **720px** long-form reading, **640px** digest email.
- Breakpoints: 640 / 960 / 1200.
- Fixed elements: top nav (web + webapp), floating chatbot FAB (webapp), bottom tab bar (mobile). All use the sticker shadow.

### Backgrounds
- Default: **white** (PRD spec).
- Hero / branded sections: full-bleed `--sky-500` or `--sky-100` panels that echo the snack-bag wrapper.
- **Sprinkle texture**: 3–8 low-density cookie-chip and lemon-dot SVGs floating per section. Never a repeating pattern — that becomes wallpaper.
- Subtle radial gradient from `--sky-100` → `--white` is OK for hero regions. No heavy gradients.
- No stock photography by default. If used: warm, shallow depth, subtle grain.

### Borders & outlines
- **Default border:** `1.5px solid var(--border)` (`#E5E5E5`) — soft neutral.
- **Signature cartoon outline:** `3px solid var(--choc-600)` (`#776C34`) — the cookie stroke. Used on primary CTAs, hero cards, logo lockup.
- Never hairline 1px — feels too techy.

### Radii
- Generous. Cookies are round.
- Cards: `--radius-lg` (20px) / `--radius-xl` (28px).
- Buttons: `--radius-pill` for primary CTAs, `--radius-md` for secondary.
- Inputs: `--radius-md` (14px).
- Never square corners, never 4px.

### Shadows & elevation
- Warm-tinted, not neutral gray.
- Pillow shadows (`--shadow-sm` → `--shadow-xl`) for ambient elevation.
- **Sticker shadow** (`--shadow-sticker` = `3px 4px 0 var(--choc-600)`): hard offset, no blur. The trademark. Used on primary CTAs, hero cards, brand lockups.
- Never combine pillow + sticker on the same element.

### Hover, press, focus
- **Hover:** `translateY(-2px)` + brand color `500→dark (#16AAF1)` + sticker shadow grows to `5px 6px 0`. `--dur-fast` / `--ease-out`.
- **Press:** `translateY(2px)` + sticker shrinks to `1px 2px 0`. (The cookie gets bitten.)
- **Focus:** 3px `--focus-ring` halo, 2px offset. Never remove outlines.
- Transitions use `--ease-snack` (slight overshoot) for user-triggered, `--ease-out` for state.

### Motion
- Snappy and perky. Default `--dur-med` 220ms.
- Entrances: **pop-in** (scale 0.85→1.02→1), not fade. Staggered 40–60ms in lists.
- Loading: a little nibbled-cookie frame animation (mascot variants), not a spinner.
- No parallax. No scroll hijacking.

### Transparency & blur
- **Frosted nav on scroll:** `backdrop-filter: blur(12px)` + `rgba(255,255,255,0.82)`.
- No glassmorphism card style. Brand is *paper*, not glass.
- Image overlays use warm brown `rgba(119,108,52,0.45)` — not black.

### Canonical card
```
background: var(--white);
border: 3px solid var(--choc-600);
border-radius: var(--radius-xl);   /* 28px */
box-shadow: var(--shadow-sticker); /* 3px 4px 0 #776C34 */
padding: var(--space-6);           /* 24px */
```
Secondary/ghost cards drop the sticker shadow and use 1.5px `--border` instead.

### Imagery vibe
- Warm cast on whites, brown shadows, high sat + low contrast. Candy-shop cheerful, not neon.
- Never b&w, never cool-toned. Optional subtle grain (`opacity: 0.05`).

---

## ICONOGRAPHY

InfoSnack's PRD specifies **Lucide React** as the icon system for the frontend (Tech Stack §5.1). We use it directly.

### System
- **Primary icons: [Lucide](https://lucide.dev/) via CDN.** Clean 2px strokes, rounded joins — pairs cleanly with Nunito/Fredoka.
  - CDN: `<script src="https://unpkg.com/lucide@latest"></script>` + `lucide.createIcons()`
  - Usage: `<i data-lucide="cookie"></i>`
  - Color inherits from `color` (usually `--fg1` or `--brand`).
  - Default size in UI: **20px**. Section accents: 28–40px.
- **Illustrated marks > icons** for brand moments. The mascot, cookie, and snack-bag illustrations carry brand weight that a line icon can't.

### Do / don't
- ✅ Lucide at 20–24px in UI chrome; 28–40px as section accents.
- ✅ Illustrated mascot/wordmark for brand moments.
- ❌ No hand-rolled SVG icons.
- ❌ No emoji in UI chrome.
- ❌ No mixing icon sets on one screen.

### Logo usage (from PRD §0.6)
| Context | Asset |
|---|---|
| Website header | `logo-cookie-en.png` or `logo-cookie-kr.jpg` (audience-dependent) |
| App icon | snack-bag only crop of `mascot-snackbag.png` |
| Favicon | cookie-only crop |
| Slack bot profile | `mascot-snackbag.png` |
| Weekly digest header | `logo-cookie-kr.jpg` |
| SNS share thumbnail | `mascot-snackbag.png` |

Clear space: 24px+ around all wordmarks. Never recolor cookie logos. Outline wordmark can flip to `--white` on `--sky-500` hero backgrounds.

---

## Caveats & next steps
See the CAVEATS note at end of chat. With real product code / Figma / custom fonts, we'll tighten this from "identity + PRD-derived" to "product-grounded."
