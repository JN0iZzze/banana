import { cn } from './cn';

export type SlideAssetObjectAlign = 'left' | 'center' | 'right';

const objectAlignClass: Record<SlideAssetObjectAlign, string> = {
  left: 'object-left',
  center: 'object-center',
  right: 'object-right',
};

interface SlideAssetImageProps {
  src: string;
  alt?: string;
  objectAlign?: SlideAssetObjectAlign;
  className?: string;
}

export function SlideAssetImage({ src, alt = '', objectAlign = 'right', className }: SlideAssetImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-full max-h-full w-auto max-w-full rounded-3xl object-contain',
        objectAlignClass[objectAlign],
        className,
      )}
    />
  );
}
