import { PurchasePackage } from "../../types/transaction";

export const Config = {
    // App
    APP_NAME: 'DARE',
    APP_VERSION: '1.0.0',
    
    // Economics
    DCOIN_VALUE_USD: 0.01,
    PLATFORM_FEE_PERCENTAGE: 15,
    PRIZE_POOL_PERCENTAGE: 85,
    
    // Withdrawal fees (time-based)
    WITHDRAWAL_FEE: {
      UNDER_7_DAYS: 20,
      UNDER_30_DAYS: 15,
      UNDER_90_DAYS: 10,
      OVER_90_DAYS: 5,
    },

    PURCHASE_PACKAGES: [
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
    ] as PurchasePackage[],
    
    // Challenge constraints
    MIN_CHALLENGE_STAKE: 50,
    MAX_CHALLENGE_STAKE_UNVERIFIED: 5000,
    MAX_CHALLENGE_STAKE_VERIFIED: 50000,
    MAX_CHALLENGE_STAKE_BUSINESS: 500000,
    
    // Token lifecycle
    TOKEN_EXPIRY_DAYS: 365,
    IDLE_FEE_PERCENTAGE: 5,
    IDLE_FEE_THRESHOLD_DAYS: 90,
    IDLE_FEE_MIN_BALANCE: 50000,
    
    // Timeouts
    CHALLENGE_ACCEPTANCE_LOCK_HOURS: 24,
    COMPLETION_REVIEW_HOURS: 24,
    SIMULTANEOUS_SUBMISSION_WINDOW_SECONDS: 60,
    
    // AI
    AI_RISK_SCORE_AUTO_APPROVE: 70,
    AI_RISK_SCORE_HUMAN_REVIEW: 60,
    AI_VERIFICATION_CONFIDENCE_THRESHOLD: 80,
    
    // Pagination
    CHALLENGES_PER_PAGE: 20,
    TRANSACTIONS_PER_PAGE: 50,
    
    // Reputation
    MIN_REPUTATION_FOR_HIGH_STAKES: 50,
    MIN_COMPLETIONS_BEFORE_CREATING: 3,
    
    // Limits
    FREE_CHALLENGES_PER_MONTH: 3,
    PREMIUM_PRICE_USD: 9.99,

    //pURCHASE PACKAGE

  };