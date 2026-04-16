# Russian Slide Typography Rules

## Contents

1. Non-breaking spaces
2. Dashes and hyphens
3. Quotes and punctuation
4. Slide-specific editing choices
5. Format-specific notes

## Non-breaking spaces

Use non-breaking spaces selectively, where they visibly improve line breaking.

High-value cases:

- after one-letter conjunctions and prepositions in titles and short lines: `а`, `и`, `в`, `к`, `с`, `у`, `о`;
- between number and unit: `12 слайдов`, `5 минут`, `2026 год` when needed for layout;
- between initials and surname: `И. И. Иванов`;
- inside common short paired fragments that should not split awkwardly.

Examples:

- `Система для будущих слайдов, а не макет` -> `Система для будущих слайдов, а не макет`
- `5 минут до старта` -> `5 минут до старта`
- `И. И. Иванов` -> `И. И. Иванов`

Do not flood a short line with non-breaking spaces if it makes the source harder to read without helping layout.

## Dashes and hyphens

Use a hyphen for compounds and joined words:

- `онлайн-редактор`
- `дизайн-система`

Use an em dash for a prose break:

- `Главный инструмент в 2026 году — текст`

For headings and slides, prefer one consistent dash style across the deck.

## Quotes and punctuation

Prefer Russian angle quotes in normal Russian copy:

- `«текст»`

Keep punctuation lean in headings:

- avoid trailing periods in titles unless the style deliberately uses them;
- remove duplicated punctuation and accidental double spaces;
- avoid stacking exclamation marks or ellipses unless tone explicitly requires it.

## Slide-specific editing choices

When the text lives on a slide rather than in body prose:

- prefer fewer lines over literal preservation of every filler word;
- keep the strongest words on the first line when possible;
- treat line-break quality as part of the edit, not as a separate concern;
- if one tiny typographic fix is not enough, consider a light rewrite only when the user asked for editing rather than exact preservation.

Good title direction:

- short;
- balanced by line length;
- free from dangling one-letter words;
- visually compact.

## Format-specific notes

Use these forms depending on the file type:

- plain text / Markdown: use a real non-breaking space character;
- HTML / JSX text nodes: use `&nbsp;` when it is clearer in source;
- existing codebase with another convention: follow that convention consistently.
