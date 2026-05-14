import { useRef, useState } from 'react';
import { Trash2, Upload, X } from 'lucide-react';
import type { CreatorAsset } from '../../domain/types';
import { Alert } from '../../ui/alert';
import { Button } from '../../ui/button';
import { useEditorStore } from '../editorStore';

// Реализация: выдвижная панель сверху preview-блока, активируемая кнопкой
// «Ассеты» в header деки. Без порталов / модалок — простой toggle.

interface AssetLibraryProps {
  onClose: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function AssetLibrary({ onClose }: AssetLibraryProps) {
  const store = useEditorStore();
  const { assets, isAssetsLoading, assetsError, uploadAsset, deleteAsset } = store;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="border-b border-neutral-800 bg-neutral-900/80 px-6 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-100">
          Ассеты деки{' '}
          <span className="text-neutral-500">({assets.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload />
            {isUploading ? 'Загружается…' : 'Загрузить'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            title="Скрыть панель"
            aria-label="Скрыть панель"
          >
            <X />
          </Button>
        </div>
      </div>

      {assetsError ? (
        <Alert variant="destructive" className="mb-3">
          {assetsError}
        </Alert>
      ) : null}

      {isAssetsLoading && assets.length === 0 ? (
        <p className="text-xs text-neutral-500">Загрузка ассетов…</p>
      ) : assets.length === 0 ? (
        <p className="text-xs text-neutral-500">Ассетов пока нет. Загрузи первый.</p>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onDelete={() => void deleteAsset(asset.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

interface AssetCardProps {
  asset: CreatorAsset;
  onDelete: () => void;
}

function AssetCard({ asset, onDelete }: AssetCardProps) {
  const fileName = asset.storagePath.split('/').pop() ?? asset.storagePath;
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-md border border-neutral-800 bg-neutral-950">
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-neutral-900">
        {asset.kind === 'image' ? (
          <img
            src={asset.publicUrl}
            alt={fileName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : asset.kind === 'video' ? (
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">video</div>
        ) : (
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">file</div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-2 py-1.5">
        <div className="truncate text-[11px] text-neutral-200" title={fileName}>
          {fileName}
        </div>
        <div className="text-[10px] text-neutral-500">{formatSize(asset.sizeBytes)}</div>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon-xs"
        onClick={onDelete}
        className="absolute right-1.5 top-1.5 opacity-0 transition group-hover:opacity-100"
        title="Удалить"
        aria-label="Удалить"
      >
        <Trash2 />
      </Button>
    </li>
  );
}
