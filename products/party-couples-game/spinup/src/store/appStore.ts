import { create } from 'zustand';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { ContentTier } from '@/types/card';

interface AppState {
  hasCompletedOnboarding: boolean;
  hasSeenPartyTutorial: boolean;
  hasSeenCouplesTutorial: boolean;
  drinkingDisclaimerShown: boolean;
  lastSelectedCouplesTier: ContentTier;
  drinkingModeDefault: boolean;
  markOnboardingComplete: () => void;
  markPartyTutorialSeen: () => void;
  markCouplesTutorialSeen: () => void;
  markDrinkingDisclaimerShown: () => void;
  setLastCouplesTier: (tier: ContentTier) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  hasSeenPartyTutorial: false,
  hasSeenCouplesTutorial: false,
  drinkingDisclaimerShown: false,
  lastSelectedCouplesTier: 'romantic',
  drinkingModeDefault: true,
  
  markOnboardingComplete: () => {
    set({ hasCompletedOnboarding: true });
    storage.set(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, true);
  },
  
  markPartyTutorialSeen: () => {
    set({ hasSeenPartyTutorial: true });
    storage.set(STORAGE_KEYS.HAS_SEEN_PARTY_TUTORIAL, true);
  },
  
  markCouplesTutorialSeen: () => {
    set({ hasSeenCouplesTutorial: true });
    storage.set(STORAGE_KEYS.HAS_SEEN_COUPLES_TUTORIAL, true);
  },
  
  markDrinkingDisclaimerShown: () => {
    set({ drinkingDisclaimerShown: true });
    storage.set(STORAGE_KEYS.DRINKING_DISCLAIMER_SHOWN, true);
  },
  
  setLastCouplesTier: (tier: ContentTier) => {
    set({ lastSelectedCouplesTier: tier });
    storage.set(STORAGE_KEYS.LAST_COUPLES_TIER, tier);
  },
}));

export async function loadAppState() {
  const [
    hasCompletedOnboarding,
    hasSeenPartyTutorial,
    hasSeenCouplesTutorial,
    drinkingDisclaimerShown,
    lastSelectedCouplesTier,
    drinkingModeDefault,
  ] = await Promise.all([
    storage.get<boolean>(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
    storage.get<boolean>(STORAGE_KEYS.HAS_SEEN_PARTY_TUTORIAL),
    storage.get<boolean>(STORAGE_KEYS.HAS_SEEN_COUPLES_TUTORIAL),
    storage.get<boolean>(STORAGE_KEYS.DRINKING_DISCLAIMER_SHOWN),
    storage.get<ContentTier>(STORAGE_KEYS.LAST_COUPLES_TIER),
    storage.get<boolean>(STORAGE_KEYS.DRINKING_MODE_DEFAULT),
  ]);

  useAppStore.setState({
    hasCompletedOnboarding: hasCompletedOnboarding ?? false,
    hasSeenPartyTutorial: hasSeenPartyTutorial ?? false,
    hasSeenCouplesTutorial: hasSeenCouplesTutorial ?? false,
    drinkingDisclaimerShown: drinkingDisclaimerShown ?? false,
    lastSelectedCouplesTier: lastSelectedCouplesTier ?? 'romantic',
    drinkingModeDefault: drinkingModeDefault ?? true,
  });
}