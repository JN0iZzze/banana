/** Dev-only smoke. Do not import. */
import { DEV_USER_ID } from '../../constants';
import { SupabaseDeckRepository } from './SupabaseDeckRepository';
import { SupabaseSlideRepository } from './SupabaseSlideRepository';

export async function smokeCreatorRepositories(): Promise<void> {
  const decks = new SupabaseDeckRepository();
  const slides = new SupabaseSlideRepository();

  const slug = `smoke-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const summary = await decks.createDeck(
    { slug, title: 'Smoke deck', description: 'created by smokeCreatorRepositories' },
    DEV_USER_ID,
  );
  // eslint-disable-next-line no-console
  console.log('[smoke] deck created', summary.id, summary.slug);

  const loaded = await decks.loadDeck(summary.id);
  // eslint-disable-next-line no-console
  console.log('[smoke] deck loaded', loaded.id, 'slides:', loaded.slides.length);

  const slideA = await slides.createSlide(summary.id, { title: 'A' }, DEV_USER_ID);
  const slideB = await slides.createSlide(summary.id, { title: 'B' }, DEV_USER_ID);
  // eslint-disable-next-line no-console
  console.log('[smoke] slides created', slideA.id, slideB.id);

  await slides.reorderSlides(summary.id, [slideB.id, slideA.id], DEV_USER_ID);
  const afterReorder = await decks.loadDeck(summary.id);
  // eslint-disable-next-line no-console
  console.log(
    '[smoke] after reorder',
    afterReorder.slides.map((s) => ({ id: s.id, idx: s.orderIndex, title: s.title })),
  );

  await decks.deleteDeck(summary.id);
  // eslint-disable-next-line no-console
  console.log('[smoke] deck deleted (cascade)');
}
