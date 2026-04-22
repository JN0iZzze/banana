import { SlideBackdrop, SlideContent, SlideFrame, Text } from '../../ui/slides';

export function JsonRendererMissingDocument({ slideId }: { slideId: string }) {
  return (
    <SlideFrame padding="default" align="center">
      <SlideBackdrop variant="none" />
      <SlideContent width="content" align="center" density="comfortable" className="h-full min-h-0 justify-center">
        <Text variant="bodyLg" className="text-center text-pretty">
          Для слайда «{slideId}» не зарегистрирована JSON-схема в jsonSlideDocumentRegistry.
        </Text>
      </SlideContent>
    </SlideFrame>
  );
}

/** Reserved for future runtime sources; registry currently validates at load time. */
export function JsonRendererSchemaError({ message }: { message: string }) {
  return (
    <SlideFrame padding="default" align="center">
      <SlideBackdrop variant="none" />
      <SlideContent width="content" align="center" density="comfortable" className="h-full min-h-0 justify-center">
        <Text variant="h2" className="text-center text-[color:var(--slide-color-accent)]">
          Ошибка JSON-схемы
        </Text>
        <Text variant="body" className="mt-4 max-w-[56ch] text-center text-pretty text-[color:var(--slide-color-text-soft)]">
          {message}
        </Text>
      </SlideContent>
    </SlideFrame>
  );
}
