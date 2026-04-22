import { Route, Routes } from 'react-router-dom';
import { PresentationShell } from '../presentation/components/PresentationShell';
import { mainDeck, vibecodingDeck } from '../presentation/registry';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PresentationShell deck={mainDeck} />} />
      <Route path="/vibecoding" element={<PresentationShell deck={vibecodingDeck} />} />
    </Routes>
  );
}

