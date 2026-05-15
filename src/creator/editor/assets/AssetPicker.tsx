import { useState } from 'react';
import { Images } from 'lucide-react';
import type { CreatorAsset, CreatorAssetKind } from '../../domain/types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { AssetLibraryDialog } from './AssetLibraryDialog';

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
  const [open, setOpen] = useState(false);

  const handleSelect = (asset: CreatorAsset) => {
    const meta: AssetPickerMeta = {};
    if (asset.width !== null) meta.width = asset.width;
    if (asset.height !== null) meta.height = asset.height;
    onChange(asset.publicUrl, meta);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-stretch gap-1">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          size="sm"
          className="w-full border-neutral-800"
        />
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => setOpen(true)}
          className="shrink-0 text-[11px]"
          title="Выбрать из библиотеки ассетов"
        >
          <Images />
          Из библиотеки
        </Button>
      </div>
      <AssetLibraryDialog
        open={open}
        onOpenChange={setOpen}
        kind={kind}
        onSelect={handleSelect}
      />
    </div>
  );
}
