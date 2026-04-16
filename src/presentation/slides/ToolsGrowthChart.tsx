import { motion } from 'framer-motion';
import { Text } from '../../ui/slides';

type GrowthRow = {
  year: string;
  count: string;
  width: number;
  tools: string;
  highlight: boolean;
};

const ROWS: GrowthRow[] = [
  {
    year: '2023',
    count: '5–6',
    width: 40,
    tools: 'DALL-E 3, Midjourney v6, Stable Diffusion XL, Adobe Firefly, Imagen',
    highlight: false,
  },
  {
    year: '2024',
    count: '8–10',
    width: 60,
    tools: 'Flux.1, Stable Diffusion 3, Ideogram 2.0, Imagen 3',
    highlight: false,
  },
  {
    year: '2025',
    count: '12–13',
    width: 83,
    tools: 'Nano Banana, Seedream 4.5, GPT Image 1.5, Qwen Image',
    highlight: false,
  },
  {
    year: '2026',
    count: '15+',
    width: 100,
    tools:
      'Nano Banana 2, GPT Image 1.5, Seedream 5.0, Midjourney v8, Flux 2, Recraft V4, Grok Imagine, ...',
    highlight: true,
  },
];

export function ToolsGrowthChart() {
  return (
    <div className="mx-auto flex w-max max-w-full flex-col gap-[var(--slide-stack-gap-md)]">
      {ROWS.map((item, index) => (
        <div
          key={item.year}
          className="flex items-start gap-[var(--slide-stack-gap-lg)]"
        >
          <div className="flex w-[192px] shrink-0 flex-col justify-center text-right">
            <Text
              variant="h2"
              className={
                item.highlight
                  ? 'text-[color:var(--slide-color-text)]'
                  : 'text-[color:var(--slide-color-text-soft)]'
              }
            >
              {item.year}
            </Text>
          </div>

          <div className="flex w-[896px] min-w-0 shrink-0 flex-col justify-center">
            <div className="mb-2 h-14 w-full overflow-hidden rounded-full bg-[color:var(--slide-color-line)]/35">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.width}%` }}
                transition={{
                  duration: 1.2,
                  delay: 0.45 + index * 0.15,
                  ease: 'easeOut',
                }}
                className={
                  item.highlight
                    ? 'h-full rounded-full bg-[color:var(--slide-color-accent)] shadow-[0_0_28px_rgba(255,86,40,0.42)]'
                    : 'h-full rounded-full bg-[color:var(--slide-color-secondary)]'
                }
              />
            </div>
            <Text
              variant="body"
              className={
                item.highlight
                  ? 'max-w-[56rem] pl-2 text-[color:var(--slide-color-text)] opacity-90'
                  : 'max-w-[56rem] pl-2 text-[color:var(--slide-color-text-soft)] opacity-80'
              }
            >
              {item.tools}
            </Text>
          </div>

          <div className="flex w-[168px] shrink-0 justify-start py-4">
            <Text
              variant="body"
              as="span"
              className={
                item.highlight
                  ? 'font-mono font-bold tabular-nums text-[color:var(--slide-color-text)]'
                  : 'font-mono font-bold tabular-nums text-[color:var(--slide-color-text-soft)]'
              }
            >
              {item.count} шт.
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
