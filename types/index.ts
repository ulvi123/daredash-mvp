export type UserRole = 'challnger' | 'doer' | 'both';
export type AccountTier = 'free' | 'premium';


export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUtl?: string;
    role: UserRole;
    accountTier: AccountTier;


    //Token economics
    dcoins: number;
    dcoinsLifeTimeEarned: number;
    dcoinsLifeTimeSpent: number;


    //stats
    challengesCreated: number;
    challengesCompleted: number;
    challengeSuccessRate: number;
    reputation: number;


    //Verification
    isVerified: boolean;
    deviceId?: string;

    //Timestamps
    createdAt: Date;
    lastActiveAt: Date;
    premiumUntil?: Date;
}