export interface IAPEntitlement {
  isUnlocked: boolean; productId: string | null; purchaseDate: string | null;
  isRestored: boolean; lastCheckedAt: number | null;
}