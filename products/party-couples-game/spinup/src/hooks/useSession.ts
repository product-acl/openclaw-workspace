import { useSessionStore } from '@/store/sessionStore';
import { GameMode } from '@/types/card';

export function useSession() {
  const session = useSessionStore((s) => s.session);
  return {
    isSessionActive: () => session !== null,
    activeMode: (): GameMode | null => session ? session.mode : null,
  };
}