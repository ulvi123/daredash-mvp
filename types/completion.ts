export type CompletionStatus = 
  | 'pending'
  | 'verifying'
  | 'verified'
  | 'rejected'
  | 'disputed'
  | 'paid';

export interface Completion {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  proofType: 'photo' | 'video';
  proofUrl: string;
  proofThumbnail?: string;
  caption?: string;
  
  locationLat?: number;
  locationLng?: number;
  locationAccuracy?: number;
  
  aiVerification: AIVerification;
  status: CompletionStatus;
  
  rewardAmount: number;
  rewardPaid: boolean;
  
  submittedAt: Date;
  verifiedAt?: Date;
  paidAt?: Date;
  
  rank?: number;
  voteScore?: number;
}

export interface AIVerification {
  verified: boolean;
  confidence: number;
  explanation: string;
  
  proofMatchesDescription: boolean;
  noDeepfakeDetected: boolean;
  timestampValid: boolean;
  locationValid: boolean;
  
  modelUsed: string;
  verificationTimestamp: Date;
  processingTimeMs: number;
}