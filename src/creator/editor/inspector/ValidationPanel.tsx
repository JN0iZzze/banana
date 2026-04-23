import type { CreatorAsset, CreatorValidation } from '../../domain/types';

interface ValidationPanelProps {
  validation: CreatorValidation;
  localJsonParseError?: string | null;
  assets?: CreatorAsset[];
}

// Проверяем только те поля документа, где в MVP точно ожидается URL медиа:
// на данный момент — `cover.background.src` у шаблона imageCover.
// Для остальных шаблонов (textStack.items[].src у image-элементов и пр.)
// warnings пока не генерируем, чтобы не давать ложных срабатываний.
function collectMediaUrls(validation: CreatorValidation): string[] {
  if (validation.status !== 'valid') return [];
  const doc = validation.doc;
  const urls: string[] = [];
  if (doc.template === 'imageCover') {
    const src = doc.cover?.background?.src;
    if (typeof src === 'string' && src.length > 0) urls.push(src);
  }
  return urls;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function isKnownAssetUrl(url: string, assets: CreatorAsset[]): boolean {
  return assets.some((a) => a.publicUrl === url);
}

export function ValidationPanel({
  validation,
  localJsonParseError,
  assets = [],
}: ValidationPanelProps) {
  const hasParseError = typeof localJsonParseError === 'string' && localJsonParseError.length > 0;
  const isValid = validation.status === 'valid' && !hasParseError;

  const warnings: string[] = [];
  if (validation.status === 'valid') {
    const urls = collectMediaUrls(validation);
    for (const url of urls) {
      if (isKnownAssetUrl(url, assets)) continue;
      if (isExternalUrl(url)) continue;
      warnings.push(`Ссылка на медиа не найдена среди ассетов деки: ${url}`);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {isValid ? (
        <div className="rounded-md border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
          Документ валиден
        </div>
      ) : (
        <div className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {hasParseError ? (
            <div className="mb-1">
              <span className="font-medium">Некорректный JSON: </span>
              <pre className="whitespace-pre-wrap break-words font-mono text-[11px] text-red-100">
                {localJsonParseError}
              </pre>
            </div>
          ) : null}
          {validation.status === 'invalid' ? (
            <div>
              <span className="font-medium">Схема не прошла:</span>
              <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-[11px] text-red-100">
                {validation.error}
              </pre>
            </div>
          ) : null}
        </div>
      )}

      {warnings.length > 0 ? (
        <div className="rounded-md border border-amber-900/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
          <div className="mb-1 font-medium">Предупреждения по медиа:</div>
          <ul className="list-disc space-y-1 pl-4">
            {warnings.map((w, idx) => (
              <li key={idx} className="break-words">
                {w}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
