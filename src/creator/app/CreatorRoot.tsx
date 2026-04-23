import { Navigate, Route, Routes } from 'react-router-dom';
import { CreatorRepositoryProvider } from '../data/repositoryContext';
import { CreatorShell } from '../layout/CreatorShell';
import { CreatorDecksListPage } from '../pages/CreatorDecksListPage';
import { CreatorDeckEditorPage } from '../pages/CreatorDeckEditorPage';
import { CreatorPresentPage } from '../pages/CreatorPresentPage';

export function CreatorRoot() {
  return (
    <CreatorRepositoryProvider>
      <CreatorShell>
        <Routes>
          <Route index element={<CreatorDecksListPage />} />
          <Route path="decks/:deckId" element={<CreatorDeckEditorPage />} />
          <Route path="decks/:deckId/slides/:slideId" element={<CreatorDeckEditorPage />} />
          <Route path="decks/:deckId/present" element={<CreatorPresentPage />} />
          <Route path="*" element={<Navigate to="/creator" replace />} />
        </Routes>
      </CreatorShell>
    </CreatorRepositoryProvider>
  );
}
