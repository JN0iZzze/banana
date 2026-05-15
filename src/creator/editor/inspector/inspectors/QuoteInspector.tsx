/**
 * Инспектор цитаты (`JsonSlideQuote`).
 *
 * Поля строго по типу `JsonSlideQuote`:
 *   - `label`     — верхняя строка («Промпт» и т.п.);
 *   - `subtitle`  — альтернатива `label`, если он не задан;
 *   - `text`      — основная цитата.
 *   - `paragraphs[]` — массив абзацев (волна 2: только просмотр).
 *
 * Тексты `label / subtitle / text` редактируются inline на сцене, но в панели
 * оставлены — так удобнее править структурно (например, поменять label на
 * subtitle или очистить поле). Все правки идут через `patchNode`.
 */

import type { JsonSlideQuote } from '../../../../presentation/jsonSlideTypes';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Field, Section } from '../inspectorPrimitives';
import { getNodeByPath } from '../pathOps';
import type { NodeInspectorProps } from '../registry';

export function QuoteInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const quote = getNodeByPath(doc, selection.path) as JsonSlideQuote | undefined;

  if (!quote) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Цитата не найдена по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  const setField = <K extends keyof JsonSlideQuote>(key: K, value: JsonSlideQuote[K] | undefined) => {
    patchNode(selection.path, (node) => {
      const base = { ...(node as JsonSlideQuote) };
      if (value === undefined || value === '') {
        delete base[key];
        return base;
      }
      base[key] = value;
      return base;
    });
  };

  const paragraphs = quote.paragraphs ?? [];

  return (
    <>
      <Section title="Цитата">
        <Field label="Label">
          <Input
            type="text"
            value={quote.label ?? ''}
            onChange={(e) => setField('label', e.target.value)}
            size="sm"
            className="w-full"
          />
        </Field>
        <Field label="Subtitle (если без label)">
          <Input
            type="text"
            value={quote.subtitle ?? ''}
            onChange={(e) => setField('subtitle', e.target.value)}
            size="sm"
            className="w-full"
          />
        </Field>
        <Field label="Текст">
          <Textarea
            value={quote.text ?? ''}
            onChange={(e) => setField('text', e.target.value)}
            rows={4}
            className="w-full"
          />
        </Field>
      </Section>

      <Section title={`Параграфы (${paragraphs.length}) — только просмотр`}>
        {paragraphs.length === 0 ? (
          <p className="text-[11px] text-neutral-500">Пусто.</p>
        ) : (
          <ol className="space-y-1.5 text-xs text-neutral-300">
            {paragraphs.map((p, i) => (
              <li
                key={i}
                className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5 font-mono text-[11px] text-neutral-200"
              >
                <span className="text-neutral-500">#{i + 1} </span>
                {p}
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
