import { useRef, useState } from 'react';
import { Images, Trash2, Upload } from 'lucide-react';
import type { CreatorAsset, CreatorAssetKind } from '../../domain/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Alert } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { useEditorStore } from '../editorStore';

// Общая модалка библиотеки ассетов. Два режима:
//  - управление (без onSelect): открывается кнопкой «Ассеты» в шапке деки,
//    карточки с hover-удалением;
//  - выбор (onSelect задан): открывается из AssetPicker в инспекторах,
//    клик по карточке вызывает onSelect и закрывает модалку.
interface AssetLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Если задан — режим выбора: клик по карточке выбирает ассет и закрывает модалку. */
  onSelect?: (asset: CreatorAsset) => void;
  /** Фильтр сетки по типу ассета (актуально в режиме выбора, напр. 'image'). */
  kind?: CreatorAssetKind;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function acceptFor(kind?: CreatorAssetKind): string {
  if (kind === 'image') return 'image/*';
  if (kind === 'video') return 'video/*';
  return 'image/*,video/*';
}

export function AssetLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  kind,
}: AssetLibraryDialogProps) {
  const store = useEditorStore();
  const { assets, isAssetsLoading, assetsError, uploadAsset, deleteAsset } = store;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isPickMode = typeof onSelect === 'function';
  const visible = kind ? assets.filter((a) => a.kind === kind) : assets;

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadAsset(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleSelect = (asset: CreatorAsset) => {
    onSelect?.(asset);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isUploading) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="border-neutral-800 bg-neutral-950 text-neutral-100 shadow-black/40 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-neutral-100">
            {isPickMode ? 'Выбор ассета' : 'Ассеты деки'}{' '}
            <span className="text-neutral-500">({visible.length})</span>
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {isPickMode
              ? 'Кликните по ассету, чтобы вставить его. Можно загрузить новый.'
              : 'Загружайте изображения и видео деки. Удаление необратимо.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptFor(kind)}
            onChange={handleInputChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-neutral-100"
          >
            <Upload />
            {isUploading ? 'Загружается…' : 'Загрузить'}
          </Button>
        </div>

        {assetsError ? (
          <Alert variant="destructive">{assetsError}</Alert>
        ) : null}

        <div className="max-h-[60vh] min-h-[180px] overflow-y-auto pr-1">
          {isAssetsLoading && visible.length === 0 ? (
            <div className="flex h-[180px] items-center justify-center text-xs text-neutral-500">
              Загрузка ассетов…
            </div>
          ) : visible.length === 0 ? (
            <div className="flex h-[180px] flex-col items-center justify-center gap-1 text-center">
              <Images className="size-6 text-neutral-600" />
              <p className="text-xs text-neutral-500">
                {kind ? 'Подходящих ассетов нет.' : 'Ассетов пока нет.'} Загрузите первый.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
              {visible.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  selectable={isPickMode}
                  onSelect={isPickMode ? () => handleSelect(asset) : undefined}
                  onDelete={isPickMode ? undefined : () => void deleteAsset(asset.id)}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
            className="border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-neutral-100"
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AssetCardProps {
  asset: CreatorAsset;
  selectable: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

function AssetCard({ asset, selectable, onSelect, onDelete }: AssetCardProps) {
  const fileName = asset.storagePath.split('/').pop() ?? asset.storagePath;

  const preview = (
    <>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-md bg-neutral-900">
        {asset.kind === 'image' ? (
          <img
            src={asset.publicUrl}
            alt={fileName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : asset.kind === 'video' ? (
          <video
            src={asset.publicUrl}
            muted
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[11px] uppercase tracking-wide text-neutral-500">
            file
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-2 py-1.5">
        <div className="truncate text-[11px] text-neutral-200" title={fileName}>
          {fileName}
        </div>
        <div className="text-[10px] text-neutral-500">
          {formatSize(asset.sizeBytes)}
        </div>
      </div>
    </>
  );

  return (
    <Card className="group relative gap-0 overflow-hidden rounded-md border-neutral-800 bg-neutral-950 py-0 shadow-none">
      {selectable ? (
        <button
          type="button"
          onClick={onSelect}
          title={fileName}
          className="flex w-full flex-col text-left outline-none transition hover:ring-2 hover:ring-sky-600 focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {preview}
        </button>
      ) : (
        preview
      )}

      {onDelete ? (
        <Button
          type="button"
          variant="destructive"
          size="icon-xs"
          onClick={onDelete}
          title="Удалить"
          aria-label="Удалить"
          className="absolute right-1.5 top-1.5 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 />
        </Button>
      ) : null}
    </Card>
  );
}
