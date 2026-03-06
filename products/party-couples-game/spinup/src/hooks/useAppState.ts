import { useEffect } from 'react';
import { AppState } from 'react-native';

export function useAppState() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // Placeholder: iapStore.checkEntitlement() — Epic 10
        // Placeholder: session resume check — Epic 11
        console.log('[AppState] foregrounded');
      }
    });
    return () => sub.remove();
  }, []);
}