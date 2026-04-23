import { useEffect, useRef, useState } from 'react';
import type { CreatorAsset, CreatorAssetKind } from '../../domain/types';
import { useEditorStore } from '../editorStore';

interface AssetPickerMeta {
  alt?: string;
  width?: number;
  height?: number;
}

interface AssetPickerProps {
  value: string;
  onChange: (url: string, meta?: AssetPickerMeta) => void;
  kind?: CreatorAssetKind;
  placeholder?: string;
}

export function AssetPicker({ value, onChange, kind, placeholder }: AssetPickerProps) {
  const store = useEditorStore();
  const { assets } = store;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = kind ? assets.filter((a) => a.kind === kind) : assets;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const handlePick = (asset: CreatorAsset) => {
    const meta: AssetPickerMeta = {};
    if (asset.width !== null) meta.width = asset.width;
    if (asset.height !== null) meta.height = asset.height;
    onChange(asset.publicUrl, meta);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative flex flex-col gap-1">
      <div className="flex items-stretch gap-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-[11px] text-neutral-200 hover:bg-neutral-800"
          title="Выбрать из библиотеки ассетов"
        >
          Из библиотеки
        </button>
      </div>
      {open ? (
        <div className="absolute right-0 top-full z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border border-neutral-700 bg-neutral-950 p-2 shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-1 py-2 text-[11px] text-neutral-500">
              В деке нет ассетов. Загрузи в панели Ассеты.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2">
              {filtered.map((asset) => (
                <li key={asset.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(asset)}
                    className="group flex w-full flex-col overflow-hidden rounded border border-neutral-800 bg-neutral-900 text-left hover:border-sky-600"
                    title={asset.storagePath}
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden bg-neutral-950">
                      {asset.kind === 'image' ? (
                        <img
                          src={asset.publicUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[10px] uppercase text-neutral-500">
                          {asset.kind}
                        </span>
                      )}
                    </div>
                    <div className="truncate px-1.5 py-1 text-[10px] text-neutral-300">
                      {asset.storagePath.split('/').pop()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
