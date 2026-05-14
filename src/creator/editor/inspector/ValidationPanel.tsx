import type { CreatorAsset, CreatorValidation } from '../../domain/types';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';

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

  if (isValid && warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {!isValid ? (
        <Alert variant="destructive">
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
        </Alert>
      ) : null}

      {warnings.length > 0 ? (
        <Alert variant="warning">
          <AlertTitle className="text-amber-200">Предупреждения по медиа:</AlertTitle>
          <AlertDescription className="text-amber-200">
            <ul className="list-disc space-y-1 pl-4">
              {warnings.map((w, idx) => (
                <li key={idx} className="break-words">
                  {w}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
