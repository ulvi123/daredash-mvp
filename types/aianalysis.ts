export interface AIAnalysis {
    approved: boolean;
    overallRiskScore: number;

    physicalSafetyScore: number;
    legalComplianceScore: number;
    socialAppropriatenessScore: number;
    privacyConcernsScore: number;
    
    flags: RiskFlag[];
    suggestions: string[];
    modifiedChallenge?: string;

    modelUsed: string;
    analysisTimestamp: Date;
    processingTimeMs: number;
}


export interface RiskFlag {
    type: 'danger' | 'warning' | 'info';
    category: 'physical' | 'legal' | 'social' | 'privacy' | 'other';
    message: string;
    severity: number;
}