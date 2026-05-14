import type { JsonSlideQuote } from '../../jsonSlideTypes';
import { Reveal, SlidePromptQuote, Text } from '../../../ui/slides';
import { cn } from '../../../ui/slides/cn';
import { useEditableTextProps, useIsEditorActive } from '../../../creator/inline-edit';

export interface JsonQuoteNodeProps {
  quote: JsonSlideQuote;
  delay?: number;
  /**
   * Absolute dot-path to the quote region inside the slide document, e.g.
   * `layout.splitLayout.left.quote` or `layout.equalColumns.items.0.region.quote`.
   * When omitted, inline editing stays off — the helper returns `{}`.
   *
   * Wave 1 wires only plain-text fields: `label`, `subtitle`, `text`.
   * `paragraphs[]` is a wave 2 structured target and is intentionally left as-is.
   */
  editorPath?: string;
}

/** Path placeholder for cases where the quote has no editor path attached. */
const NOOP_EDITOR_PATH = '__noop__';

export function JsonQuoteNode({ quote, delay = 0.16, editorPath }: JsonQuoteNodeProps) {
  const isEditorActive = useIsEditorActive();

  const labelPath = editorPath ? `${editorPath}.label` : NOOP_EDITOR_PATH;
  const subtitlePath = editorPath ? `${editorPath}.subtitle` : NOOP_EDITOR_PATH;
  const textPath = editorPath ? `${editorPath}.text` : NOOP_EDITOR_PATH;

  // `overline` shows whichever of label/subtitle is present (label wins). Both
  // bindings live in the registry as plain-text, but only the rendered field
  // needs the live editor props.
  const overlineEditableProps = useEditableTextProps(
    quote.label != null ? labelPath : subtitlePath,
  );
  const textEditableProps = useEditableTextProps(textPath);

  const overline = quote.label ?? quote.subtitle;
  const paragraphs = quote.paragraphs?.filter((p) => p.trim().length > 0) ?? [];

  return (
    <Reveal
      preset="soft"
      delay={delay}
      className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
    >
      {overline != null && overline.length > 0 ? (
        <Text
          variant="overline"
          className={cn(isEditorActive && 'pointer-events-auto')}
          {...overlineEditableProps}
        >
          {overline}
        </Text>
      ) : null}
      {quote.text != null && quote.text.trim().length > 0 ? (
        <div className="border-l-4 border-[color:var(--slide-color-accent)] pl-6">
          <Text
            variant="prompt"
            className={cn(isEditorActive && 'pointer-events-auto')}
            {...textEditableProps}
            multiline
          >
            {quote.text}
          </Text>
        </div>
      ) : null}
      {/* paragraphs[] — wave 2 structured target, intentionally left untouched. */}
      {paragraphs.map((p, i) => (
        <SlidePromptQuote key={`q-${i}`}>{p}</SlidePromptQuote>
      ))}
    </Reveal>
  );
}
