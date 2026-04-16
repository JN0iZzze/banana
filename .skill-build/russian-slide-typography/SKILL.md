---
name: russian-slide-typography
description: Polish Russian slide copy and other short presentation text with proper typography, line-breaking, and readability. Use when Codex edits Russian titles, subtitles, bullets, captions, poster text, deck copy, or UI-like short text where non-breaking spaces, dash usage, quotes, punctuation, and compact line control matter.
---

# Russian Slide Typography

## Overview

Use this skill to clean and normalize Russian text for slides and other short display surfaces. Prioritize readability in tight layouts over formal publishing perfection.

## Workflow

1. Determine the text role: title, subtitle, bullet, caption, callout, or short paragraph.
2. Apply the highest-value typographic fixes first:
   - prevent dangling one-letter words and other obvious short orphans;
   - normalize dashes, hyphens, spacing, quotes, and repeated punctuation;
   - keep short slide text compact and easy to scan.
3. Protect layout after the language fix:
   - prefer wider, cleaner line breaks for titles;
   - use non-breaking spaces where they materially improve line breaking;
   - shorten wording only if the user asked for editing, not preservation.
4. Match the file format:
   - use a real non-breaking space in plain text and Markdown;
   - use `&nbsp;` in HTML or JSX text nodes when that keeps the source readable;
   - preserve the project’s existing convention when one already exists.

## Slide Priorities

Prefer these decisions for presentation text:

- Keep titles short, strong, and visually balanced.
- Avoid leaving `а`, `и`, `в`, `к`, `с`, `у`, `о` and similar short words alone at line ends.
- Keep numbers, units, abbreviations, initials, and obvious paired fragments together when separation looks broken on a slide.
- Avoid over-punctuating headings; remove noise before making micro-fixes.
- Preserve meaning and tone before chasing perfect typography.

## Reference File

Read [references/rules.md](references/rules.md) when:

- the text has several possible line-break strategies;
- punctuation or dash rules are ambiguous;
- you need concrete examples for Russian slide typography;
- the user asks for a broader cleanup pass across multiple headings or bullets.

## Output Style

- Make the smallest edit that fixes the typographic issue.
- When asked for a direct text fix, return the corrected text, not a lecture.
- When editing files, avoid broad rewrites outside the touched copy.
