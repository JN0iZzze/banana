import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type {
  CreatorAssetRepository,
  CreatorDeckRepository,
  CreatorSlideRepository,
} from './repositories';
import { SupabaseDeckRepository } from './supabase/SupabaseDeckRepository';
import { SupabaseSlideRepository } from './supabase/SupabaseSlideRepository';
import { SupabaseAssetRepository } from './supabase/SupabaseAssetRepository';
import { SupabaseStorageAdapter } from './supabase/SupabaseStorageAdapter';

export interface CreatorRepositoryBundle {
  decks: CreatorDeckRepository;
  slides: CreatorSlideRepository;
  assets: CreatorAssetRepository;
}

const Ctx = createContext<CreatorRepositoryBundle | null>(null);

export function CreatorRepositoryProvider({ children }: { children: ReactNode }) {
  const value = useMemo<CreatorRepositoryBundle>(
    () => {
      const storage = new SupabaseStorageAdapter();
      return {
        decks: new SupabaseDeckRepository(),
        slides: new SupabaseSlideRepository(),
        assets: new SupabaseAssetRepository(storage),
      };
    },
    [],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRepositories(): CreatorRepositoryBundle {
  const v = useContext(Ctx);
  if (!v) throw new Error('[creator] useRepositories() вне CreatorRepositoryProvider');
  return v;
}
