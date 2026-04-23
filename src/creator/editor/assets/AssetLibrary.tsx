import { useRef, useState } from 'react';
import type { CreatorAsset } from '../../domain/types';
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? 'Загружается…' : 'Загрузить'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-700 px-2 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800"
            title="Скрыть панель"
          >
            Закрыть
          </button>
        </div>
      </div>

      {assetsError ? (
        <div className="mb-3 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {assetsError}
        </div>
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
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-1.5 top-1.5 rounded border border-red-900/70 bg-red-950/80 px-1.5 py-0.5 text-[10px] text-red-200 opacity-0 transition hover:bg-red-900 group-hover:opacity-100"
        title="Удалить"
      >
        Удалить
      </button>
    </li>
  );
}
