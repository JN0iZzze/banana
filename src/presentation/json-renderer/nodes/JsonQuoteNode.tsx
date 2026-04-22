import type { JsonSlideQuote } from '../../jsonSlideTypes';
import { Reveal, SlidePromptQuote, Text } from '../../../ui/slides';

export interface JsonQuoteNodeProps {
  quote: JsonSlideQuote;
  delay?: number;
}

export function JsonQuoteNode({ quote, delay = 0.16 }: JsonQuoteNodeProps) {
  const overline = quote.label ?? quote.subtitle;
  const paragraphs = quote.paragraphs?.filter((p) => p.trim().length > 0) ?? [];
  return (
    <Reveal
      preset="soft"
      delay={delay}
      className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
    >
      {overline != null && overline.length > 0 ? <Text variant="overline">{overline}</Text> : null}
      {quote.text != null && quote.text.trim().length > 0 ? (
        <SlidePromptQuote>{quote.text}</SlidePromptQuote>
      ) : null}
      {paragraphs.map((p, i) => (
        <SlidePromptQuote key={`q-${i}`}>{p}</SlidePromptQuote>
      ))}
    </Reveal>
  );
}
