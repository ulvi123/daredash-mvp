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

declare const analysis: AIAnalysis | undefined;

const finalAnalysis: AIAnalysis = analysis || {
     approved: false,
     overallRiskScore: 100,
     physicalSafetyScore: 100,      // Add these
     legalComplianceScore: 100,      // Add these
     socialAppropriatenessScore: 100, // Add these
     privacyConcernsScore: 100,      // Add these
     flags: [{ 
       type: 'danger',
       category: 'other',             // Add this
       message: 'AI moderation service unavailable.',
       severity: 10                   // Add this
     }],
     suggestions: ['Challenge created for manual review.'],
     modelUsed: 'fallback',           // Add this
     analysisTimestamp: new Date(),   // Add this
     processingTimeMs: 0              // Add this
   };


export interface RiskFlag {
    type: 'danger' | 'warning' | 'info';
    category: 'physical' | 'legal' | 'social' | 'privacy' | 'other';
    message: string;
    severity: number;
}