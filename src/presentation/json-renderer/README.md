# JSON Renderer Guide

This file is written for an AI coding agent. Treat it as the local contract for adding or editing JSON-driven slides in this presentation.

## Purpose
Use the JSON renderer when a slide can be expressed as:
- one standard slide shell
- one supported layout preset
- cards made from ordered **`items[]`** (flat) or **`slots[]`** (grouped): text rows and optional **registry-backed component** rows (`tagList`, `indexedList`)
- optional **registry icons** on cards (`leadingIcon`, `watermarkIcon`)

Do not use this path for slides that need custom widgets, charts, media logic, arbitrary React trees, or icon keys outside the allowlists. Component slots are **not** arbitrary props; each id is validated in the parser and rendered through [`jsonSlideCardComponentRegistry.tsx`](./jsonSlideCardComponentRegistry.tsx): concrete components (e.g. `JsonCardTagList`, `JsonCardIndexedList`), the typed map `JSON_SLIDE_CARD_COMPONENT_REGISTRY`, and dispatch helper `renderJsonCardComponentItem()` (used from [`nodes/JsonCardNode.tsx`](./nodes/JsonCardNode.tsx)).

## Current Runtime
The runtime entry is [`src/presentation/json-renderer/JsonSlideRenderer.tsx`](./JsonSlideRenderer.tsx).

The rendering pipeline is:
1. A deck’s slide entry for JSON is built with `defineJsonSlide()` (e.g. in [`decks/main/jsonSlides.ts`](../decks/main/jsonSlides.ts) or [`decks/vibecoding/jsonSlides.ts`](../decks/vibecoding/jsonSlides.ts)) and includes a validated `jsonDocument` on the slide
2. `JsonSlideRenderer` reads `slide.jsonDocument` (no global registry)
3. If `template` is `imageCover`, [`JsonImageCoverShell.tsx`](./JsonImageCoverShell.tsx) draws the full-bleed cover (image, overlay, frame, rails, headline) and returns — no `JsonSlideShell`, no `layout` dispatch
4. Otherwise `JsonSlideShell` renders frame, backdrop, content, and header, then
5. `renderJsonLayout()` dispatches to one supported layout renderer
6. layout renderers render cards through [`nodes/JsonCardNode.tsx`](./nodes/JsonCardNode.tsx)

Hybrid decks may also list slides with a normal React `component` and no `jsonDocument`; those never go through this JSON pipeline.

## Workflow For Adding A New JSON Slide
1. Create or update a schema JSON file under the deck that owns the slide: [`src/presentation/decks/main/schemas/`](../decks/main/schemas) for the **main** deck, or [`src/presentation/decks/vibecoding/schemas/`](../decks/vibecoding/schemas) for **vibecoding**. For `spotlight` / `none` backdrops, set `backdrop.borderFrame: true` unless the slide is intentionally borderless (see `backdrop` below). `grid` / `mesh` already include the decorative frame inside [`SlideBackdrop`](../../ui/slides/layout.tsx) — do not add a second `borderFrame` for those.
2. **Main:** add a `defineJsonSlide({ ... })` entry in [`decks/main/jsonSlides.ts`](../decks/main/jsonSlides.ts) (or split imports there) and wire it in [`decks/mainDeck.ts`](../decks/mainDeck.ts). **Vibecoding:** add a `defineJsonSlide({ ... })` in [`decks/vibecoding/jsonSlides.ts`](../decks/vibecoding/jsonSlides.ts) and include it in the exported array. Helper: [`decks/defineJsonSlide.ts`](../decks/defineJsonSlide.ts). Slide ids for main live in [`decks/mainSlideIds.ts`](../decks/mainSlideIds.ts); vibecoding ids in [`decks/vibecodingSlideIds.ts`](../decks/vibecodingSlideIds.ts).
3. Reuse only supported contract fields documented below.
4. Verify with `npm run typecheck` and `npm run build`.

If the slide needs unsupported behavior, stop and use a hand-written slide component instead of stretching the JSON contract.

## Global Document Shape

### `template: "default"` (omit or set explicitly)
Layout slides use:

- `frame`
- `backdrop`
- `content`
- `header`
- `layout`

Canonical types live in [`src/presentation/jsonSlideTypes.ts`](../jsonSlideTypes.ts).
Validation lives in [`src/presentation/parseJsonSlideDocument.ts`](../parseJsonSlideDocument.ts).

### `template: "imageCover"`
Full-bleed cover slides. **Do not** set `header`, `layout`, `frame`, `backdrop`, or `content` at the top level; the parser rejects them. Use a single `cover` object only.

The shell uses `SlideFrame` with `padding: "none"` (full-bleed image) and places rails with **`--slide-safe-x-tight` / `--slide-safe-y-tight`**, the same insets as `JsonSlideShell`’s default `frame.padding: "compact"` (see `layout.tsx` `framePaddingClasses.compact`).

**`cover` fields (strict):**
- `background`: `{ "src", "alt?", "overlay" }` — `overlay` is one of `none` | `gradientPinkBottom` | `gradientBg55` | `gradientBg80` (prepared gradients matching legacy image covers)
- `frame`: `boolean` — when `true`, draws [`SlideBackdropFrame`](../../ui/slides) on the image stack
- `topRail`: `{ "variant": "two" | "three", "tone"?, "items" }` — `items` is length 2 or 3. Each item is `kind: "text"` (lines, optional `textAlign`, optional `style`: `plain` | `label` | `inverted`) or `kind: "cluster"` (horizontal group of `text` overlines, `gap`: `md` | `lg`). Optional **`tone: "inverted"`** tints the whole top row like the white, uppercase rails on creme.
- `headline`: `{ "align": "center", "offsetYPx": 100|220|280, "stack": "br"|"tight"|"none", "blocks" }` — `blocks[]` is the only rich typography: each block has `text`, `font` (`display`|`serif`), `size` (`jumbo`|`mega`|`display`|`displayTight`|`hero`), optional `italic`, optional `weight`, and `color` (`textSoft`|`white`|`gold`)
- `bottomRail`: `{ "variant": "three", "items" (length 3), "centerAccent"?: { "type": "rule" } }` — `centerAccent` draws a short horizontal rule only above the **center** column (see migrated texturing cover)

Arbitrary `className`, free-form CSS, or per-block pixel offsets beyond the allowed enums are **not** part of the contract.

## Supported Top-Level Options

### `frame`
- `align`: `top` | `center` | `bottom`
- `padding`: `compact` | `default` | `spacious`

### `backdrop`
- `variant`: `grid` | `mesh` | `spotlight` | `none`
- `borderFrame?`: `boolean` — for variants that **do not** draw the frame inside `SlideBackdrop` (`spotlight`, `none`), when `true`, `JsonSlideShell` renders the decorative `SlideBackdropFrame`. **`grid` and `mesh` already render `SlideBackdropFrame` inside [`SlideBackdrop`](../../ui/slides/layout.tsx)**; do **not** set `borderFrame: true` for those — `JsonSlideShell` ignores it for `grid`/`mesh` to avoid **double frames** (that was the bug when `borderFrame` was set everywhere).

**Authoring policy — decorative frame:** for **`spotlight`** (and **`none`** if you use it), set `borderFrame: true` on every new or edited slide **unless** the author explicitly wants a borderless slide. Omitting it means no shell frame on those variants. For **`grid`** / **`mesh`**, the outer frame is always present via the backdrop; leave `borderFrame` unset or `false`.
- `dimmed?`: `boolean` — when `true` with `variant: "spotlight"`, lowers backdrop opacity (legacy ~70%).

### `content`
- `width`: `full` | `wide` | `content` | `narrow`
- `density`: `compact` | `comfortable` | `relaxed`
- `align`: `left` | `center`

### `header`
- `meta`: string, required
- `title`: string, optional (omit for meta-only rhythm, as in some legacy title slides)
- `lead`: string, optional

Notes:
- `meta` is passed through `formatSlideMeta()`, so supply the semantic label, not the full `01 / 57` string.
- The shell currently fixes the `h1` style and lead style. Do not try to style header text from JSON.

### `template: "textStack"`
Headerless centred slide: a vertical stack of `text`, `link`, and optional `image` items without `SlideHeader` or layout dispatch. Use this for minimal title slides, multi-link slides, and about-me style slides.

**Do not** set `header` or `layout` — the parser rejects them. All positioning is controlled by `stack`.

Rendered by [`JsonTextStackShell.tsx`](./JsonTextStackShell.tsx).

**Top-level fields:**
- `template: "textStack"` — required
- `theme?`, `frame?`, `backdrop?`, `content?` — same vocabulary as `default` (see above)
- `stack` — required; see below

**`stack` fields:**
- `align`: `left` | `center` | `right` — cross-axis alignment of items and text
- `justify`: `start` | `center` | `end` — main-axis distribution of the stack inside the slide
- `gap?`: `xs` | `sm` | `md` | `lg` — spacing between items (default `lg` ≈ `gap-8`)
- `reveal?`: `{ preset, baseDelay?, step? }` — per-item reveal animation
  - `preset`: `soft` | `hero` | `scale-in` | `enter-up` | `none` — `scale-in` is opacity + scale (no vertical slide); see [`Reveal.tsx`](../ui/slides/Reveal.tsx)
  - `baseDelay?`: number (seconds) for the first item (default `0`)
  - `step?`: number (seconds) added per item (default `0.08`)
- `items`: non-empty array of `text`, `link`, or `image` objects

**`type: "text"` item:**

Use **either** the original single string **or** inline `chunks` — not both:
- `text`: plain string (original form)
- `chunks`: non-empty array of `{ "text", "tone"?, "decoration"? }` for partial accent / strikethrough inside one line

```json
{ "type": "text", "variant": "h1", "size": "display", "text": "Title here" }
```

With **chunks** (example: strikethrough first word, rest normal):
```json
{
  "type": "text",
  "variant": "h1",
  "size": "section",
  "chunks": [
    { "text": "Путь", "decoration": "lineThrough" },
    { "text": " вайб героя" }
  ]
}
```

- `variant`: `h1` | `h2` | `h3` | `lead` | `body` | `bodyLg` | `caption` | `overline` | `prompt`
- `size?`: `display` | `section` | `compact` — **only allowed when `variant` is `"h1"`**
- `context?`: `default` | `onAccent`
- Per-chunk fields (only when `chunks` is used):
  - `text`: required string (can be empty only if you intentionally want a gap; prefer including spaces in adjacent chunks)
  - `tone?`: `default` | `accent` — `accent` uses theme accent color on that run
  - `decoration?`: `none` | `lineThrough` — `lineThrough` for struck-through text (e.g. a joke)

**Accent in one word** (other words default color):
```json
{
  "type": "text",
  "variant": "lead",
  "chunks": [
    { "text": "Одно слово " },
    { "text": "акцент", "tone": "accent" }
  ]
}
```

**`type: "link"` item:**
```json
{ "type": "link", "href": "https://example.com", "label": "example.com" }
```
- `href`: required URL string
- `label`: required display string
- Link style matches legacy `MinimalTitleSlide` / `MinimalTitleMultiLinkSlide` (monospace, accent colour, underline). Style is hardcoded in the renderer — not configurable from JSON.

**`type: "image"` item:**
```json
{ "type": "image", "src": "/images/example.png", "alt": "optional alt text", "width": 420 }
```
- `src`: required string (asset path or URL the slide shell can load)
- `alt?`: optional string
- `width`: required number — width in **CSS pixels**; height keeps aspect ratio unless `height` is set
- `height?`: optional number — **CSS pixels**; omit for automatic height at the given `width`
- No `objectFit`, caption, or radius in this minimal API; use `stack.gap` and `stack.align` for rhythm.

**Restrictions (text `text` vs `chunks`):**
- `text` and `chunks` are mutually exclusive on a single `type: "text"` row; one of them is required
- `chunks` is **only** for `textStack` — do not add `chunks` to card items or `kind: "text"` regions in this project yet
- No arbitrary per-span `className` or ad-hoc colors — only the allowlisted `tone` / `decoration` options above
- `size` is only valid for `variant: "h1"`
- `type: "image"` does not support inline styling beyond `width` / `height`

**Minimal example — title + link:**
```json
{
  "template": "textStack",
  "backdrop": { "variant": "none", "borderFrame": true },
  "stack": {
    "align": "center",
    "justify": "center",
    "gap": "lg",
    "reveal": { "preset": "soft", "baseDelay": 0, "step": 0.08 },
    "items": [
      { "type": "text", "variant": "h1", "size": "display", "text": "GEN AI 2026" },
      { "type": "link", "href": "https://example.com", "label": "example.com/deck" }
    ]
  }
}
```

**About-me example — overline + name + lead + links:**
```json
{
  "template": "textStack",
  "backdrop": { "variant": "spotlight", "borderFrame": true },
  "stack": {
    "align": "center",
    "justify": "center",
    "gap": "md",
    "reveal": { "preset": "soft", "step": 0.1 },
    "items": [
      { "type": "text", "variant": "overline", "text": "About me" },
      { "type": "text", "variant": "h1", "size": "section", "text": "Ivan Petrov" },
      { "type": "text", "variant": "lead", "text": "AI researcher & generative art practitioner" },
      { "type": "link", "href": "https://example.com/ivan", "label": "example.com/ivan" }
    ]
  }
}
```

**Minimal example — overline + image + body:**
```json
{
  "template": "textStack",
  "backdrop": { "variant": "spotlight", "borderFrame": true },
  "stack": {
    "align": "center",
    "justify": "center",
    "gap": "md",
    "reveal": { "preset": "soft", "step": 0.1 },
    "items": [
      { "type": "text", "variant": "overline", "text": "Section" },
      { "type": "image", "src": "/images/hero.png", "width": 360 },
      { "type": "text", "variant": "body", "text": "Caption or supporting line under the image." }
    ]
  }
}
```

Demo schemas: [`demo-text-stack-minimal-title.json`](../decks/main/schemas/demo-text-stack-minimal-title.json), [`demo-text-stack-about-me.json`](../decks/main/schemas/demo-text-stack-about-me.json)

## Supported Layout Presets

### `asymmetricColumns`
Use when column widths are intentionally different. Each column is a full **`JsonSlideRegion`**, same as `splitLayout` / `stackLayout` (not a bare card only): `card`, `text`, `quote`, or nested `layout` (e.g. `stackLayout` + `mediaGallery`).

Fields:
- `type: "asymmetricColumns"`
- `gap?: "xs" | "sm" | "md" | "lg"`
- `items: JsonSlideColumnItem[]` — each item is `{ "span", "region" }` where `region` is `JsonSlideRegion`

Rules:
- each item must have `span` and `region`
- all spans must sum to `12`
- use for patterns like `7+5`, `8+4`, `3+9`

**Example (two columns, card regions):** [`demo-grid-asymmetric.json`](../decks/main/schemas/demo-grid-asymmetric.json)

### `equalColumns`
Use when all columns should have equal visual weight. Same as `asymmetricColumns`, but all `span` values must be **identical** (e.g. `4+4+4`).

Fields:
- `type: "equalColumns"`
- `gap?: "xs" | "sm" | "md" | "lg"`
- `items: JsonSlideColumnItem[]` — `{ "span", "region" }` per column

Rules:
- each item must have `span` and `region`
- all spans must sum to `12`
- all spans must be identical
- use for `6+6`, `4+4+4`, `3+3+3+3`

**Examples:**
- three equal card columns: [`demo-grid-equal.json`](../decks/main/schemas/demo-grid-equal.json)
- `4+4+4` with per-column `stackLayout` (title + image): [`slide-json-images-triptych.json`](../decks/main/schemas/slide-json-images-triptych.json)

### `bentoGrid`
Use when cells need explicit coordinates and varying spans.

Fields:
- `type: "bentoGrid"`
- `columns: number`
- `rows: number`
- `gap?: "xs" | "sm" | "md" | "lg"`
- `items: JsonSlideBentoItem[]`

Rules:
- each item must define `colStart`, `rowStart`, `colSpan`, `rowSpan`
- items must stay inside the declared grid bounds
- use when the slide needs a mixed-density layout instead of pure columns

### `uniformGrid`
Use when the slide is a **repeatable N-column grid** of cards (same cell geometry, row-major order). No manual `colStart` / `rowStart`.

Fields:
- `type: "uniformGrid"`
- `columns: number` (integer **2–12**)
- `gap?: "xs" | "sm" | "md" | "lg"`
- `items: JsonSlideCard[]` (non-empty; one card per cell, left-to-right then top-to-bottom)

Rules:
- row count is implicit (`ceil(items.length / columns)`)
- all cells share the same grid track sizing (`1fr` columns, `auto` rows with `auto-rows-fr` for equal row height where possible)

### `splitLayout`
Two side-by-side regions on a **12-column** row: each region is a **card**, a **text** block (plain typography, no card chrome), a **nested** layout, or a **quote** block (for left-column “prompt / result” copy). Nesting is only through this shape (not by replacing every card leaf with `kind: layout` elsewhere).

Fields:
- `type: "splitLayout"`
- `gap?: "xs" | "sm" | "md" | "lg"`
- `leftSpan: number` — integer **1–11**
- `rightSpan: number` — integer **1–11**
- `left: JsonSlideRegion`
- `right: JsonSlideRegion`

Rules:
- `leftSpan + rightSpan` must equal **12**
- each region is an object:
  - `{ "kind": "card", "card": JsonSlideCard }`
  - `{ "kind": "text", "text": ... }` (see [Text region](#text-region-splitstack))
  - `{ "kind": "layout", "layout": JsonSlideLayout }`
  - `{ "kind": "quote", "quote": JsonSlideQuote }` (see [Quote region](#quote-region-split-panes))
- recursive `splitLayout` inside a region is allowed up to a **fixed depth** enforced in the parser (see `SPLIT_LAYOUT_MAX_DEPTH` in [`parseJsonSlideDocument.ts`](../parseJsonSlideDocument.ts))

Example (4 + 8 with nested grid): [`src/presentation/decks/main/schemas/slide-prompt-structure.json`](../decks/main/schemas/slide-prompt-structure.json)

### `stackLayout`
Vertical stack of **regions** (same `JsonSlideRegion` union as `splitLayout`: `card`, `text`, `layout`, `quote`). Row heights are proportional **fr** weights from each item’s `span` (spans must sum to **12**, same convention as column layouts).

Fields:
- `type: "stackLayout"`
- `gap?`: `xs` | `sm` | `md` | `lg`
- `items`: non-empty array of `{ "span": number (1–12), "region": JsonSlideRegion }`

Use for gallery columns that need a **pair above + single below** (see [`slide-reference-roles.json`](../decks/main/schemas/slide-reference-roles.json)) or any vertical composition of nested layouts.

### `mediaGallery`
Renders a strip or grid of **images and/or videos** (no card chrome). Use inside a `splitLayout` or `stackLayout` region via `{ "kind": "layout", "layout": { "type": "mediaGallery", ... } }`.

Fields:
- `type: "mediaGallery"`
- `items`: non-empty array of `{ "type": "image" | "video", ... }` (see `JsonSlideMediaGalleryItem` in types). Image items may include `objectFit?: "contain" | "cover"`.
- `gap?`: `xs` | `sm` | `md` | `lg`
- `preset?`: `single` | `pair` | `row` | `column` | `auto` (optional; see below)
- `verticalAlign?`: `top` | `center` | `bottom` — vertical alignment of media within each gallery cell (default `center`). Does not replace `objectAlign` or `rowJustify`.
- `rowJustify?`: `start` | `end` — for `pair` and `row` only (default `end`, matches legacy `SlideImagePair`)
- `cellVariant?`: `panel` | `fill` — `fill` uses legacy-style clipped tiles (`rounded-[var(--slide-radius-inner)]`, image defaults to **cover** in the cell). Omit for the default centered panel look.

**Animation:** per-item `Reveal` in [`JsonMediaGalleryLayout.tsx`](./layouts/JsonMediaGalleryLayout.tsx) uses the `scale-in` preset (opacity + scale, no vertical offset). This is not configurable from JSON; change the preset in the layout renderer if needed.

**Preset rules**
- omit or `auto`: keep the **count-based** layout (1 → 1 col, 2 → 2 col, 3 → 3 col, 4 → 2×2, 5+ → flex row at ~20% width each) — this is the behavior used by already migrated JSON slides
- `single`: exactly **1** item; one main media cell
- `pair`: exactly **2** items; with `cellVariant: "fill"` uses a **2-column** grid of fill cells; otherwise uses `SlideImagePair` (two-up strip, panel-style images)
- `row`: a flexible **row** of equal flex children (`flex-1`), for multiple side-by-side items without the 5+ special-case
- `column`: **N** items in one column, **N** equal-height rows (for stacked reference/result strips — see [`slide-leo-wide-shot.json`](../decks/main/schemas/slide-leo-wide-shot.json))

### Text region (split/stack)
Plain text stack without `SurfaceCard` / card padding — use when you need headings or body copy in a `splitLayout` or `stackLayout` pane but **not** a full card. **Not** the same as `imageCover` top/bottom rail items that use `kind: "text"` with `lines` (different template; see [imageCover](#template-imagecover)).

Under `text`:
- `items` — required non-empty array of text rows: `{ "variant", "text" }` with the same `variant` allowlist as [card `items[]`](#card-items): `overline` | `caption` | `h2` | `h3` | `body` | `bodyLg` | `prompt`. No `type: "component"` rows.
- `stackGap?` — `xs` | `sm` | `md` | `lg` (default `md`)
- `align?` — `left` | `center` | `right` (default `left`)

Rendered in [`nodes/JsonTextRegionNode.tsx`](./nodes/JsonTextRegionNode.tsx). Example: [`slide-angles-lighting.json`](../decks/main/schemas/slide-angles-lighting.json) (left column).

```json
{
  "kind": "text",
  "text": {
    "align": "left",
    "stackGap": "md",
    "items": [{ "variant": "h2", "text": "Title without card" }]
  }
}
```

### Quote region (split panes)
`JsonSlideQuote` is a neutral block: small **overline** + monospace **quote** body (same shell as `SlidePromptQuote`).

Object shape (under `quote`):
- `label?` or `subtitle?` — one optional top line (if both are set, `label` wins)
- `text?` — main quoted string
- `paragraphs?` — optional array of strings; each paragraph renders as its own quote block. At least one of `text` (non-empty) or non-empty `paragraphs` is required.

Rendered in [`nodes/JsonQuoteNode.tsx`](./nodes/JsonQuoteNode.tsx). Examples: [`slide-agentic-workflow-result.json`](../decks/main/schemas/slide-agentic-workflow-result.json), [`slide-prompt-order-pair-images.json`](../decks/main/schemas/slide-prompt-order-pair-images.json), [`slide-editing-prompt-principles.json`](../decks/main/schemas/slide-editing-prompt-principles.json)

## Card Contract
Cards are rendered by [`src/presentation/json-renderer/nodes/JsonCardNode.tsx`](./nodes/JsonCardNode.tsx).

Do not use old fields like:
- `overline`
- `title`
- `body`

Those fields are obsolete.

Use this contract:

```json
{
  "tone": "standard",
  "padding": "default",
  "stackGap": "md",
  "subtitle": { "variant": "overline", "text": "Section" },
  "justify": "between",
  "items": [
    { "variant": "h2", "text": "Card title" },
    { "variant": "body", "text": "Card body copy." }
  ]
}
```

### Card Fields
- `tone`: `standard` | `accent`
- `padding?`: `compact` | `default` | `spacious`
- `surface?`: `box` | `ghost` | `accentGradient` — **container** styling only; default `box` matches the usual `Box` shell. `ghost` uses a glass-style `SurfaceCard`; `accentGradient` uses a gradient fill on an accent `Box`. Semantic text still follows `tone`.
- `headerBadge?`: `{ "text": string, "tone"?: "default" | "accent" | "onAccent" }` — circular badge. If the first two `items[]` rows are `overline` then `h2`, they render in one row with the badge on the right; otherwise the badge is absolutely positioned in the corner (content gets extra right padding).
- `stackGap?`: `xs` | `sm` | `md` | `lg` — vertical spacing inside the card (between leading icon, `subtitle`, and `items[]`, and between `items[]`). Same vocabulary as `layout.gap`. **Default** when omitted: `sm` if `padding` is `compact`, otherwise `md`. If set, overrides that default.
- `leadingIcon?`: optional **registry** id — small icon in a rounded badge above `subtitle` / content (see [Card icons](#card-icons))
- `watermarkIcon?`: optional **registry** id — large faded icon in the bottom-right of the card (decorative)
- `subtitle?`: optional pinned label above the content zone (see below)
- `justify?`: `start` | `end` | `between` — vertical layout of the body zone, not `subtitle`. With `slots`, `justify` applies **between slots**; items inside a slot stay glued by `gap`. With flat `items`, special case: when `headerBadge` is set and the first two `items[]` are `overline` then `h2`, those two render as a **header row** with the badge; `between` then puts space **between** that row and the remaining `items[]`. If there are several rows after the header, `between` also spreads them inside that lower block.
- `items`: flat rows — **union** of text rows and `type: "component"` rows (see [Card `items[]`](#card-items)). Provide **either** `items` **or** `slots`, not both.
- `slots?`: grouped rows — array of `{ items, gap? }` blocks (see [Card slots](#card-slots)). Use when `justify: "between"` must pin top/bottom groups while keeping inner rows glued.

### Card icons
Allowed ids are a **closed set** (extend by editing [`jsonSlideCardIconRegistry.tsx`](./jsonSlideCardIconRegistry.tsx) and [`jsonSlideTypes.ts`](../jsonSlideTypes.ts) `JSON_SLIDE_CARD_ICON_IDS`).

Export for tooling: `JSON_SLIDE_CARD_ICON_IDS` from [`jsonSlideSchema.ts`](../jsonSlideSchema.ts).

Current ids include brand icons (`gemini`, `midjourney`, `openai`, `volcengine`, …) and Lucide-backed keys (`clapperboard`, `workflow`, `palette`, `image`, `layout-template`, …). The parser rejects unknown strings.

Example:

```json
{
  "tone": "accent",
  "leadingIcon": "gemini",
  "watermarkIcon": "gemini",
  "justify": "between",
  "items": [
    { "variant": "h2", "text": "Title" },
    { "variant": "body", "text": "Note." }
  ]
}
```

### `subtitle`
- Optional object with the **same shape as one `items[]` entry**: `{ "variant": "…", "text": "…" }` using the same `variant` allowlist as `items[]`.
- Legacy JSON may use `"type"` instead of `"variant"` for the same values (parser treats it as an alias).
- Always rendered at the **top** of the card, **above** `items[]`.
- Does **not** participate in `justify`; only the content stack (`items[]`) is distributed vertically per `justify`.

### `justify`
Controls vertical distribution of the card **body**. `subtitle` stays pinned above and does not participate.

- `start` -> body rows stay at the **top** of the body zone
- `end` -> body rows stay at the **bottom** of the body zone
- `between` ->
  - With **`slots`**: space is distributed **between slots**; items inside a slot stay glued by `gap` (or card `stackGap`).
  - With flat `items`, **without** the `headerBadge` + `overline`+`h2` header pattern: body rows are distributed evenly across the body zone (with a single row, the runtime pins it to the bottom of the flex area).
  - With flat `items` **and** that header pattern: space goes **between** the header row and the block of remaining rows; if there are **two or more** tail rows, `between` also spreads them within that lower block (e.g. `body` vs `tagList` on prompt-structure cards). Prefer `slots` for new slides — the heuristic path is kept for backward compatibility.

### Card authoring heuristics
These are not parser rules, but they are the default quality bar for new cards and refactors.

- A strong card usually has **one prominent title** (`h2` or `h3`) that carries the main thought. The title may sit in the top group or in the bottom group, depending on the composition.
- The title often works best when it stays **glued to its supporting description**. If title + body should read as one semantic block, put them in the same `slot` instead of letting `justify: "between"` tear them apart.
- Use `justify: "between"` to split a card into a clear **top part** and **bottom part**. Avoid layouts where `between` leaves a stray row visually hanging in the middle of the card.
- If a card has three semantic zones instead of two, prefer `slots` with an intentional grouping, or switch to `start` / `end`. Do not rely on accidental mid-card spacing.
- In comparison slides or grids of peer cards, keep the cards structurally homogeneous: same title level, same ordering of rows, same typography rhythm. Do **not** mix `h2` on one peer card with `h3` on another unless asymmetry is intentional and content-driven.
- Card titles should usually name the **core entity / claim / fear** of the card, not the answer to it. Example: on a slide about "Три страха на пороге", the card title should be the fear itself; the response belongs in `body`, not in the title.
- `subtitle` / `overline` are supporting labels, not the main title. If the card has a real heading, keep it in `items[]` as `h2` / `h3`.
- If `headerBadge` is present, the visual header should also contain a real heading signal above the body: either a title (`h2` / `h3`) or an icon. Do not pair `headerBadge` in the top zone with only `overline` / `subtitle`.

### Card icon style
For `Claude`, `Cursor`, and similar tooling cards, prefer **monochrome** LobeHub icons from the registry. Do not use colored LobeHub marks inside cards.

### Card slots
Use `slots` when `justify: "between"` must distribute **groups** of rows, not individual rows. Each slot is an indivisible vertical block; items inside a slot are separated by `gap` (or card `stackGap`). `leadingIcon`, `subtitle`, `headerBadge`, and `watermarkIcon` still behave the same and sit outside the slots stack.

Shape:

```json
{
  "tone": "standard",
  "leadingIcon": "type",
  "justify": "between",
  "slots": [
    {
      "items": [
        { "variant": "overline", "text": "До 2025" }
      ]
    },
    {
      "items": [
        { "variant": "h2",   "text": "Идея упиралась в синтаксис" },
        { "variant": "body", "text": "Most ideas never left the notebook." }
      ]
    }
  ]
}
```

Slot fields:
- `items`: required, non-empty array — same **union** as flat `items[]` (text rows and `type: "component"` rows)
- `gap?`: `xs` | `sm` | `md` | `lg` — vertical spacing between items inside **this slot only**; defaults to card-level `stackGap`

Rules:
- Provide **either** `items` **or** `slots` on a card, not both — the parser rejects mixing.
- Slot depth is exactly one; slots cannot nest.
- With `slots`, the legacy `headerBadge` + `overline`+`h2` header-pair heuristic is **disabled**. If you need a header row next to a badge, put the header rows in the first slot yourself.

Example slide: [`slide-vibecoding-02-definition.json`](../decks/vibecoding/schemas/slide-vibecoding-02-definition.json).

## Card `items[]`
Each entry is either:

1. **Text item** (backward compatible): `{ "variant": "…", "text": "…" }` — no `type` field required.
2. **Component item** (allowlist only): `{ "type": "component", "component": "<id>", … }` — only ids listed in `JSON_SLIDE_CARD_COMPONENT_IDS` in [`jsonSlideTypes.ts`](../jsonSlideTypes.ts) are accepted. The parser and [`jsonSlideCardComponentRegistry.tsx`](./jsonSlideCardComponentRegistry.tsx) must agree on shape and rendering.

Mixed arrays are allowed, e.g. `h2`, `bodyLg`, then `tagList`. Component rows render in the **same** flex stack as text rows, so `justify` and `stackGap` apply consistently.

### `tagList`
Pill tags for short labels (tone follows `card.tone`, not the JSON item).

Shape:

```json
{
  "type": "component",
  "component": "tagList",
  "variant": "compact",
  "direction": "row",
  "gap": "sm",
  "items": [{ "label": "Tag A" }, { "label": "Tag B" }]
}
```

- `variant` optional: `default` | `compact` — `compact` uses full pill shape (`rounded-full`), `px-4` / `py-2`, tight line-height; default keeps inner-radius pills and section padding tokens. Not to be confused with **text** `items[].variant` (`overline`, `h2`, …).
- `direction` optional: `row` | `column` — default `row` (with wrap when `row`)
- `gap` optional: `xs` | `sm` | `md` | `lg` — spacing between pills; default `sm`
- `items` required: non-empty array of `{ "label": string }` — duplicate labels are rejected at parse time

Example (abbreviated): [`src/presentation/decks/main/schemas/slide-midjourney-vs-nano-banana.json`](../decks/main/schemas/slide-midjourney-vs-nano-banana.json)

### `indexedList`
Numbered vertical list (index + title + subtitle per row). Styling follows `card.tone` (`accent` rows use the same on-accent treatment as the hero card on [`slide-prompt-structure.json`](../decks/main/schemas/slide-prompt-structure.json)).

Shape:

```json
{
  "type": "component",
  "component": "indexedList",
  "gap": "md",
  "items": [
    { "index": 1, "title": "Row title", "subtitle": "Row subtitle" }
  ]
}
```

- `gap` optional: `xs` | `sm` | `md` | `lg` — spacing between rows; default `md`
- `items` required: non-empty array; `index` must be a non-negative integer and **unique** within the list; `title` and `subtitle` must be non-empty strings

### `featureList`
Vertical list of comparison/characteristic rows — icon badge, supporting label, and main value per row. Dividers between rows (last row has no divider). Styling follows `card.tone`.

Shape:

```json
{
  "type": "component",
  "component": "featureList",
  "gap": "sm",
  "items": [
    { "icon": "zap",     "label": "Философия",         "value": "Быстрая" },
    { "icon": "monitor", "label": "Разрешение",        "value": "1K" },
    { "icon": "image",   "label": "Кол-во референсов", "value": "4 шт" }
  ]
}
```

- `gap` optional: `xs` | `sm` | `md` | `lg` — spacing between rows; default `sm`
- `items` required: non-empty array; each row must have:
  - `icon` — one of the ids from `JSON_SLIDE_CARD_ICON_IDS` (includes `zap`, `monitor`, `globe`, `brain`, `image`, `type` and all other card icons; see [`jsonSlideTypes.ts`](../jsonSlideTypes.ts))
  - `label` — non-empty string; rendered as subdued supporting caption
  - `value` — non-empty string; rendered as the primary value

Example: [`slide-nano-banana-versions.json`](../decks/main/schemas/slide-nano-banana-versions.json)

### How to register a new component item
1. Add the id to `JSON_SLIDE_CARD_COMPONENT_IDS` in [`jsonSlideTypes.ts`](../jsonSlideTypes.ts) and extend `JsonSlideCardItem` with a **fully typed** branch (no `Record<string, unknown>` props).
2. Extend [`parseJsonSlideDocument.ts`](../parseJsonSlideDocument.ts): add a dedicated parser (or branch in `parseComponentCardItem`) so `type: "component"` + your id and all fields are validated.
3. In [`jsonSlideCardComponentRegistry.tsx`](./jsonSlideCardComponentRegistry.tsx): implement a `React` component with `{ tone, item }` props, add it to `JSON_SLIDE_CARD_COMPONENT_REGISTRY` (must satisfy `JsonSlideCardComponentRegistry` — a missing key is a type error), and add an exhaustive `case` in `renderJsonCardComponentItem()`. Do **not** add branches in [`nodes/JsonCardNode.tsx`](./nodes/JsonCardNode.tsx); it only dispatches text vs `renderJsonCardComponentItem()`.
4. If the grid uses “first text item” heuristics for React keys, update [`layouts/JsonUniformGridLayout.tsx`](./layouts/JsonUniformGridLayout.tsx) to treat your component like other non-text rows (use [`isJsonSlideCardItemText`](../jsonSlideTypes.ts)).
5. Re-export any new public types from [`jsonSlideSchema.ts`](../jsonSlideSchema.ts) if needed for callers.
6. Document the shape in this file (contract + example) and add a schema JSON under the owning deck’s [`schemas/`](../decks/main/schemas) folder (or [`vibecoding/schemas/`](../decks/vibecoding/schemas)) when the deck ships the slide.

## Allowed Card Item Variants
For **text** items, allowed `card.items[].variant` values are intentionally narrower than the full `Text` component API:

- `overline`
- `caption`
- `h2`
- `h3`
- `body`
- `bodyLg`
- `prompt` — monospace, `pre-wrap`, prompt-sized block; rendered as [`Text`](../../ui/slides/Text.tsx) `variant="prompt"` (default element `pre`). Same allowlist applies to `subtitle`, plain `kind: "text"` regions, and `textStack` `type: "text"` rows.

Do not use:
- `h1`
- `lead`
- `meta`
- `tileAccent`

Reason:
- cards should stay narrow and predictable
- the document should not become a generic rich text DSL

**Extending typography:** add new JSON-facing modes as new `variant` values in `Text.tsx` and extend the parser allowlists — not `className`, `font`, or other style escape hatches.

**Example — mono prompt in a ghost card** (see [`slide-prompt-order-flex.json`](../decks/main/schemas/slide-prompt-order-flex.json)):

```json
{
  "tone": "standard",
  "surface": "ghost",
  "padding": "default",
  "items": [
    {
      "variant": "prompt",
      "text": "Your long prompt string here; newlines inside the JSON string are preserved (pre-wrap)."
    }
  ]
}
```

**`textStack` vs layout + card:** use `template: "textStack"` for headerless vertical copy (titles, links, centered stacks). Use `default` + `stackLayout` / `equalColumns` + `kind: "card"` when you need the grid, ghost panels, or mixed regions (as on the prompt-order slide).

## Card Item Ordering
Order is defined strictly by the array order.

This is the intended pattern:

```json
"items": [
  { "variant": "caption", "text": "Mini" },
  { "variant": "h3", "text": "Cell title" },
  { "variant": "body", "text": "Body copy." }
]
```

The renderer must not assume that:
- title is always first
- overline is always present
- body is always last

If the order should change, change the JSON array order.

## Practical Authoring Rules
- Prefer `subtitle` for a short label that must stay at the top while `justify` moves the main stack.
- Prefer `overline` or `caption` inside `items[]` when the label is part of the same vertical stack as the rest.
- Prefer `h2` for larger cards and `h3` for compact cards.
- Use `body` for normal supporting copy.
- Use `bodyLg` only when the card is sparse and needs larger body text.
- Use `prompt` inside a card (often `surface: "ghost"`) for long monospace prompt copy; do not fake this with `body` + ad hoc classes.
- Use `justify: "between"` for tall cards that clearly split into **top and bottom groups**.
- Prefer `slots` over flat `items` when `justify: "between"` must pin **groups** (e.g. overline on top, `h2`+`body` glued together on the bottom) instead of spreading every row evenly or leaving a floating middle row.
- Use `justify: "end"` for cards whose `items[]` should sit near the bottom.
- Omit `justify` when normal top stacking is enough.

## Constraints
- Keep using fixed-stage slide primitives. Do not introduce responsive Tailwind prefixes in this JSON path.
- Do not add arbitrary `className` support to JSON.
- Do not add free-form nested blocks inside `card.items`; the only non-text rows are **registry** `type: "component"` entries (see [Card `items[]`](#card-items)).
- Do not add **media, markdown, or arbitrary React** inside `card.items`; use `layout.type: "mediaGallery"` (or a hand-written slide) for media.

## When To Stop Using JSON
Switch to a dedicated `.tsx` slide instead of forcing JSON if the slide needs:
- images or video with special composition logic
- a chart, widget, or animated custom component
- icon-specific rendering logic
- conditional rendering branches beyond simple layout choice
- layout behavior that does not fit `asymmetricColumns`, `equalColumns`, `bentoGrid`, `uniformGrid`, `splitLayout`, `stackLayout` (optionally with `mediaGallery` / `quote` regions), or `mediaGallery` at the root

## Minimal Examples

### Asymmetric Columns
```json
{
  "layout": {
    "type": "asymmetricColumns",
    "gap": "md",
    "items": [
      {
        "span": 7,
        "region": {
          "kind": "card",
          "card": {
            "tone": "standard",
            "subtitle": { "variant": "overline", "text": "Main block" },
            "justify": "between",
            "items": [
              { "variant": "h2", "text": "Seven columns" },
              { "variant": "body", "text": "Primary content area." }
            ]
          }
        }
      },
      {
        "span": 5,
        "region": {
          "kind": "card",
          "card": {
            "tone": "accent",
            "items": [
              { "variant": "h2", "text": "Side panel" },
              { "variant": "body", "text": "Secondary content." }
            ]
          }
        }
      }
    ]
  }
}
```

### Equal Columns
```json
{
  "layout": {
    "type": "equalColumns",
    "items": [
      {
        "span": 4,
        "region": { "kind": "card", "card": { "tone": "standard", "items": [{ "variant": "h3", "text": "A" }] } }
      },
      {
        "span": 4,
        "region": { "kind": "card", "card": { "tone": "standard", "items": [{ "variant": "h3", "text": "B" }] } }
      },
      {
        "span": 4,
        "region": { "kind": "card", "card": { "tone": "accent", "items": [{ "variant": "h3", "text": "C" }] } }
      }
    ]
  }
}
```

### Bento Grid
```json
{
  "layout": {
    "type": "bentoGrid",
    "columns": 4,
    "rows": 3,
    "items": [
      {
        "colStart": 1,
        "rowStart": 1,
        "colSpan": 1,
        "rowSpan": 2,
        "card": {
          "tone": "accent",
          "subtitle": { "variant": "overline", "text": "Tall cell" },
          "justify": "between",
          "items": [
            { "variant": "h2", "text": "Hero block" },
            { "variant": "body", "text": "Large content area." }
          ]
        }
      }
    ]
  }
}
```
