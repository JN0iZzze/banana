/**
 * Инспектор ImageCover-сущностей. Регистрируется на три kind:
 *   - `imageCoverBackground` — `cover.background` (src / alt / overlay);
 *   - `imageCoverHeadline`   — `cover.headline`   (align / offset / stack);
 *   - `imageCoverRail`       — конкретный rail-item
 *      (`cover.topRail.items.<i>` или `cover.bottomRail.items.<i>`).
 *
 * Внутри — ветка по `selection.kind`. Поля строго по типам в
 * `presentation/jsonSlideTypes.ts`. Все правки — через `patchNode`.
 */

import type {
  JsonImageCoverBackground,
  JsonImageCoverHeadline,
  JsonImageCoverRailItem,
} from '../../../../presentation/jsonSlideTypes';
import { AssetPicker } from '../../assets/AssetPicker';
import { Input } from '../../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { Field, Section } from '../inspectorPrimitives';
import { getNodeByPath } from '../pathOps';
import type { NodeInspectorProps } from '../registry';

export function ImageCoverInspector(props: NodeInspectorProps) {
  const { selection } = props;
  switch (selection.kind) {
    case 'imageCoverBackground':
      return <BackgroundInspector {...props} />;
    case 'imageCoverHeadline':
      return <HeadlineInspector {...props} />;
    case 'imageCoverRail':
      return <RailItemInspector {...props} />;
    default:
      return null;
  }
}

// --- background --------------------------------------------------------------

const OVERLAY_OPTIONS = [
  { value: 'none', label: 'none' },
  { value: 'gradientPinkBottom', label: 'gradientPinkBottom' },
  { value: 'gradientBg55', label: 'gradientBg55' },
  { value: 'gradientBg80', label: 'gradientBg80' },
] as const;

function BackgroundInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const bg = getNodeByPath(doc, selection.path) as JsonImageCoverBackground | undefined;
  if (!bg) {
    return <NotFound path={selection.path} what="Фон cover" />;
  }

  return (
    <Section title="Cover · фон">
      <Field label="Источник (src)">
        <AssetPicker
          value={bg.src}
          kind="image"
          placeholder="https://… или /local/path.jpg"
          onChange={(url, meta) => {
            patchNode(selection.path, (node) => {
              const next = { ...(node as JsonImageCoverBackground), src: url };
              if (meta?.alt && (next.alt === undefined || next.alt === '')) {
                next.alt = meta.alt;
              }
              return next;
            });
          }}
        />
      </Field>
      <Field label="Alt">
        <Input
          type="text"
          value={bg.alt ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            patchNode(selection.path, (node) => {
              const base = { ...(node as JsonImageCoverBackground) };
              if (v === '') {
                delete base.alt;
              } else {
                base.alt = v;
              }
              return base;
            });
          }}
          size="sm"
          className="w-full"
        />
      </Field>
      <Field label="Overlay">
        <Select
          value={bg.overlay}
          onValueChange={(value) =>
            patchNode(selection.path, (node) => ({
              ...(node as JsonImageCoverBackground),
              overlay: value as JsonImageCoverBackground['overlay'],
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OVERLAY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </Section>
  );
}

// --- headline ----------------------------------------------------------------

const HEADLINE_STACK_OPTIONS = [
  { value: 'br', label: 'br' },
  { value: 'tight', label: 'tight' },
  { value: 'none', label: 'none' },
] as const;

const HEADLINE_OFFSET_OPTIONS = [
  { value: 100, label: '100' },
  { value: 220, label: '220' },
  { value: 280, label: '280' },
] as const;

function HeadlineInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const headline = getNodeByPath(doc, selection.path) as JsonImageCoverHeadline | undefined;
  if (!headline) {
    return <NotFound path={selection.path} what="Headline cover" />;
  }

  return (
    <>
      <Section title="Cover · headline">
        <Field label="Stack">
          <Select
            value={headline.stack}
            onValueChange={(value) =>
              patchNode(selection.path, (node) => ({
                ...(node as JsonImageCoverHeadline),
                stack: value as JsonImageCoverHeadline['stack'],
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HEADLINE_STACK_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Offset Y, px">
          <Select
            value={String(headline.offsetYPx)}
            onValueChange={(value) =>
              patchNode(selection.path, (node) => ({
                ...(node as JsonImageCoverHeadline),
                offsetYPx: Number(value) as JsonImageCoverHeadline['offsetYPx'],
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HEADLINE_OFFSET_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section title={`Блоки (${headline.blocks.length}) — только просмотр`}>
        <ol className="space-y-1.5 text-xs text-neutral-300">
          {headline.blocks.map((b, i) => (
            <li
              key={i}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5"
            >
              <div className="mb-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                #{i + 1} · {b.font} · {b.size} · {b.color}
              </div>
              <div className="font-mono text-[11px] whitespace-pre-wrap text-neutral-200">
                {b.text}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

// --- rail item ---------------------------------------------------------------

const RAIL_TEXT_STYLE_OPTIONS = [
  { value: 'plain', label: 'plain' },
  { value: 'label', label: 'label' },
  { value: 'inverted', label: 'inverted' },
] as const;

const RAIL_TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'left' },
  { value: 'center', label: 'center' },
  { value: 'right', label: 'right' },
] as const;

const CLUSTER_GAP_OPTIONS = [
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

function RailItemInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const item = getNodeByPath(doc, selection.path) as JsonImageCoverRailItem | undefined;
  if (!item) {
    return <NotFound path={selection.path} what="Rail-элемент" />;
  }

  if (item.kind === 'text') {
    return (
      <>
        <Section title="Rail · текстовый элемент">
          <Field label="Style">
            <Select
              value={item.style ?? 'plain'}
              onValueChange={(value) =>
                patchNode(selection.path, (node) => ({
                  ...(node as Extract<JsonImageCoverRailItem, { kind: 'text' }>),
                  style: value as 'plain' | 'label' | 'inverted',
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RAIL_TEXT_STYLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Text align">
            <Select
              value={item.textAlign ?? 'left'}
              onValueChange={(value) =>
                patchNode(selection.path, (node) => ({
                  ...(node as Extract<JsonImageCoverRailItem, { kind: 'text' }>),
                  textAlign: value as 'left' | 'center' | 'right',
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RAIL_TEXT_ALIGN_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Section>

        <Section title={`Строки (${item.lines.length}) — только просмотр`}>
          <ol className="space-y-1.5 text-xs text-neutral-300">
            {item.lines.map((line, i) => (
              <li
                key={i}
                className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5 font-mono text-[11px] text-neutral-200"
              >
                <span className="text-neutral-500">#{i + 1} </span>
                {line}
              </li>
            ))}
          </ol>
        </Section>
      </>
    );
  }

  // cluster
  return (
    <>
      <Section title="Rail · cluster">
        <Field label="Gap">
          <Select
            value={item.gap}
            onValueChange={(value) =>
              patchNode(selection.path, (node) => ({
                ...(node as Extract<JsonImageCoverRailItem, { kind: 'cluster' }>),
                gap: value as 'md' | 'lg',
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLUSTER_GAP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section title={`Подэлементы (${item.items.length}) — только просмотр`}>
        <ol className="space-y-1.5 text-xs text-neutral-300">
          {item.items.map((sub, i) => (
            <li
              key={i}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5 font-mono text-[11px] text-neutral-200"
            >
              <span className="text-neutral-500">#{i + 1} </span>
              {sub.lines.join(' / ')}
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

function NotFound({ path, what }: { path: string; what: string }) {
  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
      {what} не найден по пути <span className="font-mono text-neutral-300">{path}</span>.
    </div>
  );
}
