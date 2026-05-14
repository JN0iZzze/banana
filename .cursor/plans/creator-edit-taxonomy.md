# JSON Renderer Text-Bearing Entities: Complete Taxonomy for Inline Editing

**Status:** READ-ONLY analysis (April 2026)  
**Scope:** Complete mapping of text fields in JSON-renderer across all templates, layouts, and components.  
**Purpose:** Foundation for unifying binding-layer in inline-edit PoC.

---

## Source References

- **JSON Renderer Contract:** [README.md](../../src/presentation/json-renderer/README.md)
- **Type Definitions:** [src/presentation/jsonSlideTypes.ts](../../src/presentation/jsonSlideTypes.ts) — canonical schema
- **Editor Context:** [src/creator/inline-edit/EditorModeContext.tsx](../../src/creator/inline-edit/EditorModeContext.tsx)
- **Editable Paths Collector:** [src/creator/inline-edit/collectEditablePaths.ts](../../src/creator/inline-edit/collectEditablePaths.ts) — current Wave A implementation
- **Slide Shell (default template):** [src/presentation/json-renderer/JsonSlideShell.tsx](../../src/presentation/json-renderer/JsonSlideShell.tsx) — `header.title`, `header.lead` (lines 47–89)
- **Text Stack Shell (textStack template):** [src/presentation/json-renderer/JsonTextStackShell.tsx](../../src/presentation/json-renderer/JsonTextStackShell.tsx) — `stack.items[].text` (lines 117–123)
- **Card Node:** [src/presentation/json-renderer/nodes/JsonCardNode.tsx](../../src/presentation/json-renderer/nodes/JsonCardNode.tsx) — card.items, subtitle (lines 43–83)
- **Text Region Node:** [src/presentation/json-renderer/nodes/JsonTextRegionNode.tsx](../../src/presentation/json-renderer/nodes/JsonTextRegionNode.tsx) — text region items (lines 23–40)
- **Quote Node:** [src/presentation/json-renderer/nodes/JsonQuoteNode.tsx](../../src/presentation/json-renderer/nodes/JsonQuoteNode.tsx) — quote fields (lines 9–26)
- **Image Cover Shell:** [src/presentation/json-renderer/JsonImageCoverShell.tsx](../../src/presentation/json-renderer/JsonImageCoverShell.tsx) — rails & headline (lines 42–312)
- **Media Gallery Layout:** [src/presentation/json-renderer/layouts/JsonMediaGalleryLayout.tsx](../../src/presentation/json-renderer/layouts/JsonMediaGalleryLayout.tsx) — media captions (lines 99–~180)
- **Slide Meta Formatter:** [src/presentation/slideMeta.ts](../../src/presentation/slideMeta.ts) — `header.meta` is a plain string (line 2)
- **Design System Rules:** [.cursor/rules/slides-no-responsive.mdc](../../.cursor/rules/slides-no-responsive.mdc)

---

## Overview

A JSON slide document can contain three classes of text-bearing fields:

1. **`plainText`** — single scalar `string`, directly editable via `contentEditable`
   - Examples: `header.title`, `header.lead`, `quote.text`, card item text

2. **`structuredText`** — text that cannot be reduced to a single scalar
   - Examples: `quote.paragraphs[]` (array of strings), imageCover `headline.blocks[]` (rich blocks), `textStack.items[].chunks[]` (inline markup)
   - These require structured editing or component-level re-render (not line-by-line contentEditable)

3. **`collectionField`** — explicit arrays of strings (reserved for future UI)
   - Example: `textStack.items[]` (implicitly a collection; each item is `type: "text"` with a `text` field)

---

## Wave 1: Plain Text (contentEditable-ready)

**Scope:** Fields that are single scalar strings, directly editable in-place. No array nesting, no structured sub-components.

### Core Header Fields

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `header.title` | plainText | false | **true** | JsonSlideShell:47–66 | Optional field; may be empty string. Width-constrained (`max-w-[28ch]`). |
| `header.lead` | plainText | true | **true** | JsonSlideShell:69–89 | Optional field; rendered as `variant="lead"` with soft reveal. Supports multi-line via Text component. |
| `header.meta` | plainText | false | **true** | JsonSlideShell:45; slideMeta.ts:2 | **Scalar string** passed to `formatSlideMeta()` — NOT structured. Returns formatted "theme · 01 / 57" on render. No per-field editing of position; theme label only. |

### Text Stack Items (textStack template)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `stack.items[i].text` | plainText | true | **true** | JsonTextStackShell:117–123 | Only when `type: "text"` AND **NOT** `chunks` field present. Link/image items (`type: "link"` \| `type: "image"`) are NOT editable. Multiline via pre-wrap where variant allows. |

### Card Subtitle (top-pinned label)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.cards[i].subtitle.text` | plainText | false | **true** | JsonCardNode:252–256 | Actually: `layout.{asymmetricColumns\|equalColumns\|...}.items[i].region.card.subtitle.text`. Scalar; may be empty. Does not participate in justify. |

### Card Items (flat items array — plainText rows only)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.{layoutType}.items[i].region.card.items[j].text` | plainText | depends-on-variant | **true** (text rows only) | JsonCardNode:43–83 | Only **text items** (identified by `isJsonSlideCardItemText()`). Exclude `type: "component"` rows (tagList, indexedList, featureList — those are structuredText). Multiline per variant (body/bodyLg support text-wrap; h2/h3 allow wrapping but not explicit newlines in JSON). |

**Clarification:** Paths vary by layout type:
- Column layouts: `layout.{asymmetricColumns\|equalColumns}.items[i].region.card.items[j].text`
- Split layout: `layout.splitLayout.{left\|right}.region.card.items[j].text`
- Stack layout: `layout.stackLayout.items[i].region.card.items[j].text`
- Uniform grid: `layout.uniformGrid.items[i].items[j].text`
- Bento grid: `layout.bentoGrid.items[i].region.card.items[j].text`

### Card Slots Items (grouped items — plainText rows only)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.{layoutType}.items[i].region.card.slots[s].items[j].text` | plainText | depends-on-variant | **true** (text rows only) | JsonCardNode:167–182 | Only text items inside slots. Same multiline rules as flat items. Slot structure groups items for justify:between distribution; individual text nodes are still scalar. |

### Text Region Items (split/stack panes — plainText only)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.{splitLayout\|stackLayout}.{left\|right\|items[i]}.region.text.items[j].text` | plainText | true | **true** | JsonTextRegionNode:23–40 | Plain text stack in panes (no card chrome). Same variant allowlist as card items (overline, caption, h2, h3, body, bodyLg, prompt). |

### Quote Fields (single paragraph or label)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.splitLayout.{left\|right}.region.quote.label` | plainText | false | **true** | JsonQuoteNode:10, 18 | Optional top line (alternative to `subtitle`). Rendered as `variant="overline"`. Scalar string. |
| `layout.splitLayout.{left\|right}.region.quote.subtitle` | plainText | false | **true** | JsonQuoteNode:10, 18 | Optional, used only if `label` is absent. Same semantics as label. |
| `layout.splitLayout.{left\|right}.region.quote.text` | plainText | true | **true** | JsonQuoteNode:19–21 | Main quote body. Rendered in `SlidePromptQuote` (monospace, pre-wrap). Multiline via newlines in JSON string. |

### Image Cover Rails (imageCover template only)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `cover.topRail.items[i].lines[j]` | plainText | false | **true** | JsonImageCoverShell:42–105 | Each line is a scalar. Cluster items also have `lines[j]`. Rail variant (`two` \| `three`) determines number of top items. |
| `cover.bottomRail.items[i].lines[j]` | plainText | false | **true** | JsonImageCoverShell:221–262 | Each line is a scalar. Three-column layout (left, center, right). |

### Image Cover Headline Blocks

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `cover.headline.blocks[i].text` | plainText | true | **true** | JsonImageCoverShell:137–145, 454 (block.text field) | May contain `\n` for line breaks. Rendered with `renderBlockLines()` → per-line fragment. |

### Media Gallery Item Captions

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.mediaGallery.items[i].caption` | plainText | false | **true** | JsonMediaGalleryLayout:99, ~180 | Optional; shown only if `showCaption: true`. Single scalar string. |

---

## Wave 2: Structured Text (Not contentEditable; require component updates)

**Scope:** Text that involves nested structure, arrays of strings, or inline markup. Cannot be edited by a single contentEditable field.

### Quote Paragraphs (array of strings)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.splitLayout.{left\|right}.region.quote.paragraphs[i]` | structuredText | true | **false** | JsonQuoteNode:11–12, 22–24 | Array of paragraph strings. Each rendered as separate `SlidePromptQuote` block. Editing: replace entire array or individual para via modal/form, not contentEditable. |

### Text Stack Chunks (inline markup within single text item)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `stack.items[i].chunks[j].text` | structuredText | false | **false** | JsonTextStackShell:34–49 | Part of rich text item: text + optional `tone` (accent) + optional `decoration` (lineThrough). Cannot edit chunk individually via contentEditable; must edit structured form. Full text editing via modal. |

### Card Items Chunks (inline markup in card rows)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.{layoutType}.items[...].region.card.items[j].chunks[k].text` | structuredText | false | **false** | jsonSlideTypes.ts:533–557 (TextChunk definition) | Currently **NOT rendered** by JSON renderer — `chunks` is only for `textStack`. Future expansion target. |

### Component Rows (tagList, indexedList, featureList)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `layout.{layoutType}.items[...].region.card.items[j].component` | structuredText | varies | **false** | jsonSlideTypes.ts:46–72, JsonCardNode:177–204 | `type: "component"` + one of (`tagList` \| `indexedList` \| `featureList`). Each has sub-fields: tags[].label, rows[].title/subtitle, rows[].icon/label/value. Not line-by-line editable; edit entire component shape or per-field modal. |

### Image Cover Rails Cluster Items (horizontal group of text)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `cover.topRail.items[i].items[j].lines[k]` (cluster) | structuredText | false | **false** | JsonImageCoverShell:82–95, 428–432 | Cluster is `kind: "cluster"` with `gap` and array of items, each with own `lines[]`. Grouped rendering; not line-editable. |
| `cover.bottomRail.items[i].items[j].lines[k]` (cluster) | structuredText | false | **false** | JsonImageCoverShell:231–242 | Same as top cluster. |

### Image Cover Headline Multiple Blocks (array rendering as one composed element)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `cover.headline.blocks[i]` (full block, not just .text) | structuredText | varies | **false** | JsonImageCoverShell:147–202 | Block includes `text`, `font`, `size`, `italic`, `color`, `weight`. Editing one field requires re-render of entire headline composition. |

---

## Wave 3: Collection Fields (Reserved for Future)

| path-шаблон | kind | multiline | enabled-in-wave-1 | confirmed-in | notes |
|---|---|---|---|---|---|
| `stack.items[i]` (text items within stack) | collectionField | varies | **false** | JsonTextStackShell:174–176 | Array of items (text, link, image). Would require add/remove/reorder UI. Currently only per-item `.text` field is in Wave 1. |
| `layout.{layoutType}.items[...]` (cards/regions in layout) | collectionField | N/A | **false** | all layouts | Arrays of cards or regions. Collection-level operations (add/remove card, swap order) deferred. |

---

## Non-Editable Fields (Reference)

These fields are **explicitly excluded** from inline editing, either by design or because they control rendering logic:

| field | reason | location |
|---|---|---|
| `src`, `alt` (images/videos) | asset references; no semantic text | MediaGalleryItem, textStack image items, cover.background |
| `href`, `label` (links) | link metadata; `label` is actionable text but not Slide content | textStack item `type: "link"` |
| `type` (discriminator fields) | schema routing; not content | `item.type: "text" \| "link" \| "image" \| "component"` |
| `variant`, `size`, `font`, `color` | styling/typography tokens; not text content | Text rows, headline blocks |
| `tone`, `decoration` (chunk fields) | semantic markup; may evolve but not standalone editable | chunks[].tone, chunks[].decoration |
| Layout keys: `span`, `columns`, `rows`, `colStart`, `rowStart` | grid/spacing logic | column/bento layout fields |
| `gap`, `padding`, `stackGap` | spacing tokens | card and layout properties |
| `leadingIcon`, `watermarkIcon`, `headerBadge` | decorative/metadata badges | card fields |
| `surface`, `justify` | visual distribution | card fields |
| `template`, `backdrop.variant`, `frame.align` | structural/rendering | top-level template choice |

---

## Header.meta: Detailed Decision

**Field:** `header.meta`  
**Type in schema:** `string` (required)  
**Rendered via:** `formatSlideMeta(doc.header.meta, index, totalSlides)` → `"${theme} · ${index+1} / ${totalSlides}"` (slideMeta.ts:2)  
**Determination:** **Wave 1: plainText**

**Rationale:**
- At JSON level, `header.meta` is a scalar string (the semantic theme label, e.g., "Архитектура").
- Passed directly to `formatSlideMeta()` as the first argument; position and total are runtime-computed.
- When editing, user changes the theme label only; position auto-updates on render.
- Editable via contentEditable single-line input with no special structure.
- **Conclusion:** Treat as plainText, Wave 1. The "position / total" suffix is injected by the shell, not part of JSON.

---

## Path Normalization Rules

For nested structures, paths are expressed in **absolute dot notation** from the document root:

1. **Array indices:** Use `[i]`, `[j]`, `[s]` placeholders (not numbers).
   - Example: `layout.equalColumns.items[i].region.card.items[j].text`

2. **Layout type variable:** Layouts nest cards/regions under different keys:
   - Column layouts (`equalColumns`, `asymmetricColumns`): `.items[i].region`
   - Split layout: `.left` / `.right` (no array)
   - Stack layout: `.items[i].region` (array of span/region pairs)
   - Media gallery: `.items[i]` (direct items, not region-wrapped)
   - Bento: `.items[i].region`

3. **Quote in split panes:** `layout.splitLayout.{left|right}.region.quote.*`

4. **Text region in split panes:** `layout.splitLayout.{left|right}.region.text.items[j].text`

---

## Wave 1 Completeness Checklist

- [x] `header.title` — scalar, contentEditable, single-line
- [x] `header.lead` — scalar, contentEditable, multi-line
- [x] `header.meta` — scalar, contentEditable, single-line (theme label only)
- [x] `stack.items[i].text` (textStack only) — scalar, contentEditable, multi-line
- [x] `layout.{layoutType}.items[...].region.card.subtitle.text` — scalar, single-line
- [x] `layout.{layoutType}.items[...].region.card.items[j].text` (all text rows) — scalar, multi-line per variant
- [x] `layout.{layoutType}.items[...].region.card.slots[s].items[j].text` (all text rows in slots) — scalar, multi-line
- [x] `layout.{splitLayout|stackLayout}.{left|right|items[i]}.region.text.items[j].text` — scalar, multi-line
- [x] `layout.splitLayout.{left|right}.region.quote.label` — scalar, single-line
- [x] `layout.splitLayout.{left|right}.region.quote.subtitle` — scalar, single-line
- [x] `layout.splitLayout.{left|right}.region.quote.text` — scalar, multi-line
- [x] `cover.topRail.items[i].lines[j]` (imageCover) — scalar, single-line per rail
- [x] `cover.bottomRail.items[i].lines[j]` (imageCover) — scalar, single-line per rail
- [x] `cover.headline.blocks[i].text` (imageCover) — scalar, multi-line (contains \n)
- [x] `layout.mediaGallery.items[i].caption` — scalar, single-line

---

## Wave 2 Deferred (structuredText)

- `quote.paragraphs[i]` — array of strings; each para is separate quote block
- `stack.items[i].chunks[j].text` — part of inline markup; edit via modal/form
- `card.items[j].chunks[k].text` — future; not yet rendered
- `tagList`, `indexedList`, `featureList` component rows — edit via dedicated component UI
- `cover.topRail/bottomRail.items[i].items[j].lines[k]` (clusters) — grouped rendering
- `cover.headline.blocks[i]` (full block) — composed typography; edit as shape

---

## Implementation Notes for Binding Layer

1. **Editor Path Collection:**
   - Extend `collectEditablePaths()` in `src/creator/inline-edit/collectEditablePaths.ts` to walk Wave 1 paths.
   - Per-layout deep recursion: column layouts → items → region → card → items/subtitle; split/stack → left/right/items → region → {card|text|quote}.

2. **Editor Props Pattern:**
   - Pass `editorPath` (dot-notation string) to each contentEditable text node.
   - Pass `editorMultiline` boolean based on Wave 1 table.
   - `onEditorStartEdit`, `onEditorCommit`, `onEditorCancel` callbacks bubble to EditorModeProvider.

3. **Path Resolution:**
   - Use `getByPath()` / `setByPath()` utilities from `collectEditablePaths.ts` for read/write.
   - Validate path exists before render (null-safe).

4. **Recursive Layout Traversal:**
   - All layout types must be walked: asymmetricColumns, equalColumns, bentoGrid, uniformGrid, splitLayout, stackLayout, mediaGallery.
   - For each layout item/region, check if region is `kind: "card"`, `kind: "text"`, `kind: "quote"`, or nested `kind: "layout"`.
   - Depth limit on split/stack nesting (enforced by parser `SPLIT_LAYOUT_MAX_DEPTH`).

---

## Next Steps (Future Implementation)

1. **Wave 1 Full Rollout:** Extend collectEditablePaths to all Wave 1 fields; add editor props to all rendering nodes.
2. **Testing:** Unit tests for path collection; visual test of inline edit on each path.
3. **Wave 2 Design:** Modal/form UI for structuredText (paragraphs, chunks, component rows).
4. **Performance:** Lazy contentEditable teardown; avoid re-render on every keystroke outside edited field.

---

**Document Generated:** 2026-04-29  
**Reviewed Against:** jsonSlideTypes.ts, renderer shells, nodes, layouts  
**Next Review Point:** After Wave 1 implementation rollout
