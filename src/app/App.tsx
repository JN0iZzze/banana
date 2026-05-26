import { Route, Routes } from 'react-router-dom';
import { PresentationShell } from '../presentation/components/PresentationShell';
import { mainDeck, mainForkDeck, vibecodingDeck } from '../presentation/registry';
import { CreatorRoot } from '../creator/app/CreatorRoot';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PresentationShell deck={mainDeck} />} />
      <Route path="/workshop" element={<PresentationShell deck={mainForkDeck} />} />
      <Route path="/vibecoding" element={<PresentationShell deck={vibecodingDeck} />} />
      <Route path="/creator/*" element={<CreatorRoot />} />
    </Routes>
  );
}

