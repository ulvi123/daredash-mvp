export interface PurchasePackage {
    id: string;
    name: string;
    dcoins: number;
    price: number;
    bonusPercentage: number;
    isPopular?: boolean;
  }
  
  export const PURCHASE_PACKAGES: PurchasePackage[] = [
    {
      id: 'starter',
      name: 'Starter',
      dcoins: 1000,
      price: 12,
      bonusPercentage: 0,
    },
    {
      id: 'popular',
      name: 'Popular',
      dcoins: 5000,
      price: 50,
      bonusPercentage: 10,
      isPopular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      dcoins: 10000,
      price: 85,
      bonusPercentage: 15,
    },
    {
      id: 'whale',
      name: 'Whale',
      dcoins: 25000,
      price: 200,
      bonusPercentage: 20,
    },
  ];