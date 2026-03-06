import { create } from 'zustand';

interface IapState {
  isUnlocked: boolean;
  unlock: () => void;
}

export const useIapStore = create<IapState>((set) => ({
  isUnlocked: false,
  unlock: () => set({ isUnlocked: true }),
}));