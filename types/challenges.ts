import { AIAnalysis } from "./aianalysis";

export type ChallengeCategory =
    | 'creative'
    | 'social'
    | 'fitness'
    | 'skill'
    | 'adventure'
    | 'random'
    | 'business'


export type ChallengeDifficulty = 1 | 2 | 3 | 4 | 5;

export type ChallengeStatus =
    | 'pending_moderation'
    | 'rejected'
    | 'active'
    | 'in_progress'
    | 'prending_verififcation'
    | 'completed'
    | 'expired'
    | 'cancelled';


export type PrizeModel =
    | 'single_winner'
    | 'multiple_winners'
    | 'prize_pool_expansion'
    | 'time_decay'


export interface Challenge {
    thumbnail: any;
    coverImage: any;
    id: string;

    //Creator info
    creatorId: string;
    creatorName: string;
    creatorAvatar?: string;

    //Challenge details
    title: string;
    description: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;


    //Economics
    stakeAmount: number;
    platformFee: number;
    prizePool: number;
    prizeModel: PrizeModel;
    maxCompletions?: number;

    //Moderation
    aiAnalysis: AIAnalysis;
    riskScore: number;
    moderationFlags: string[];


    //status
    status: ChallengeStatus;
    acceptedBy?: string;
    acceptedAt?: Date;


    //Constraints
    requiresLocation?: boolean;
    locationLat?: number;
    localtinLong?: number;
    locationRadius?: number;

    expiresAt: Date;
    completionDeadline?: Date;

    // Engagement
    views: number;
    attempts: number;
    completions: number;

    // Timestamps
    createdAt: Date;
    publishedAt?: Date;
    completedAt?: Date;

}