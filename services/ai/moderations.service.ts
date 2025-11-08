// import {  RiskFlag } from '../../types';
import { AIAnalysis } from '../../types/aianalysis';
import {ChallengeCategory} from  "../../types/challenges"
import { Config } from '../../utils/constants/config';

// Note: In production, this should be a Firebase Cloud Function to protect API keys
// For MVP, we'll call OpenAI directly from the client (development only)

export class ModerationService {
  private static readonly OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  /**
   * Analyze a challenge for safety concerns using GPT-4
   */
  static async analyzeChallenge(
    challengeText: string,
    category: ChallengeCategory
  ): Promise<AIAnalysis> {
    const startTime = Date.now();

    try {
      const systemPrompt = this.buildModerationPrompt(category);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using mini for cost efficiency
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: challengeText },
          ],
          temperature: 0.3, // Lower temperature for consistent moderation
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      const analysis = JSON.parse(analysisText);

      const processingTime = Date.now() - startTime;

      return this.formatAnalysis(analysis, processingTime);
    } catch (error) {
      console.error('AI Moderation error:', error);
      // Return safe fallback (reject by default on error)
      return this.getFailsafeAnalysis(challengeText, Date.now() - startTime);
    }
  }

  /**
   * Build the moderation prompt based on category
   */
  private static buildModerationPrompt(category: ChallengeCategory): string {
    return `You are a safety moderator for DARE, a challenge platform. Your job is to analyze challenges and assess their safety.

CHALLENGE CATEGORY: ${category}

Analyze the challenge for these risk factors (score each 0-100, where 100 is most risky):
1. Physical Safety: Risk of injury, harm, dangerous activities
2. Legal Compliance: Illegal activities, trespassing, harassment
3. Social Appropriateness: Bullying, discrimination, public disturbance
4. Privacy Concerns: Recording strangers, entering private property

SCORING GUIDELINES:
- 0-30: Safe, approve automatically
- 31-60: Moderate risk, suggest improvements
- 61-100: High risk, reject

AUTO-REJECT if challenge involves:
- Physical danger (heights, stunts, weapons, vehicles)
- Illegal activities (vandalism, theft, drugs, trespassing)
- Harassment or bullying
- Privacy violations (filming strangers without consent)
- Self-harm or extreme activities
- Inappropriate content for minors
- Financial fraud or scams

RESPOND ONLY WITH VALID JSON in this exact format:
{
  "approved": boolean,
  "physicalSafetyScore": number,
  "legalComplianceScore": number,
  "socialAppropriatenessScore": number,
  "privacyConcernsScore": number,
  "overallRiskScore": number,
  "flags": [
    {
      "type": "danger" | "warning" | "info",
      "category": "physical" | "legal" | "social" | "privacy",
      "message": "string",
      "severity": number
    }
  ],
  "suggestions": ["string"],
  "modifiedChallenge": "string or null"
}

EXAMPLES:

Challenge: "Jump off a roof"
Response: {
  "approved": false,
  "physicalSafetyScore": 95,
  "legalComplianceScore": 20,
  "socialAppropriatenessScore": 30,
  "privacyConcernsScore": 0,
  "overallRiskScore": 85,
  "flags": [
    {
      "type": "danger",
      "category": "physical",
      "message": "Extreme risk of serious injury or death",
      "severity": 95
    }
  ],
  "suggestions": ["Try a safe parkour challenge in a gym with proper equipment"],
  "modifiedChallenge": "Do a parkour roll at a local gym with proper mats"
}

Challenge: "Sing happy birthday to a stranger and make them smile"
Response: {
  "approved": true,
  "physicalSafetyScore": 5,
  "legalComplianceScore": 10,
  "socialAppropriatenessScore": 15,
  "privacyConcernsScore": 20,
  "overallRiskScore": 12,
  "flags": [
    {
      "type": "info",
      "category": "social",
      "message": "Ensure the person is comfortable with the interaction",
      "severity": 15
    }
  ],
  "suggestions": ["Ask permission before singing", "Choose appropriate locations like cafes or parks"],
  "modifiedChallenge": null
}

Now analyze the following challenge:`;
  }

  /**
   * Format the AI response into our AIAnalysis type
   */
  private static formatAnalysis(
    rawAnalysis: any,
    processingTime: number
  ): AIAnalysis {
    const overallRiskScore = rawAnalysis.overallRiskScore || 
      Math.round(
        (rawAnalysis.physicalSafetyScore +
         rawAnalysis.legalComplianceScore +
         rawAnalysis.socialAppropriatenessScore +
         rawAnalysis.privacyConcernsScore) / 4
      );

    return {
      approved: rawAnalysis.approved === true && overallRiskScore <= Config.AI_RISK_SCORE_AUTO_APPROVE,
      overallRiskScore,
      physicalSafetyScore: rawAnalysis.physicalSafetyScore || 0,
      legalComplianceScore: rawAnalysis.legalComplianceScore || 0,
      socialAppropriatenessScore: rawAnalysis.socialAppropriatenessScore || 0,
      privacyConcernsScore: rawAnalysis.privacyConcernsScore || 0,
      flags: rawAnalysis.flags || [],
      suggestions: rawAnalysis.suggestions || [],
      modifiedChallenge: rawAnalysis.modifiedChallenge || undefined,
      modelUsed: 'gpt-4o-mini',
      analysisTimestamp: new Date(),
      processingTimeMs: processingTime,
    };
  }

  /**
   * Failsafe analysis if AI call fails
   */
  private static getFailsafeAnalysis(
    challengeText: string,
    processingTime: number
  ): AIAnalysis {
    // Keywords that indicate danger (basic fallback)
    const dangerKeywords = [
      'jump', 'roof', 'height', 'cliff', 'bridge',
      'drugs', 'alcohol', 'drink', 'smoke',
      'steal', 'vandal', 'break', 'destroy',
      'naked', 'nude', 'strip',
      'fight', 'hit', 'punch', 'hurt',
      'trespass', 'sneak', 'illegal',
    ];

    const lowerText = challengeText.toLowerCase();
    const containsDangerKeyword = dangerKeywords.some(keyword => 
      lowerText.includes(keyword)
    );

    return {
      approved: false, // Reject by default if AI fails
      overallRiskScore: containsDangerKeyword ? 80 : 60,
      physicalSafetyScore: containsDangerKeyword ? 80 : 50,
      legalComplianceScore: 50,
      socialAppropriatenessScore: 50,
      privacyConcernsScore: 50,
      flags: [
        {
          type: 'danger',
          category: 'other',
          message: 'AI moderation service unavailable. Challenge requires manual review.',
          severity: 60,
        },
      ],
      suggestions: [
        'AI moderation is temporarily unavailable. Please try again or rephrase your challenge.',
      ],
      modifiedChallenge: undefined,
      modelUsed: 'failsafe',
      analysisTimestamp: new Date(),
      processingTimeMs: processingTime,
    };
  }

  /**
   * Get risk level label for display
   */
  static getRiskLevelLabel(score: number): string {
    if (score <= 30) return 'Low Risk';
    if (score <= 60) return 'Moderate Risk';
    return 'High Risk';
  }

  /**
   * Get risk level color
   */
  static getRiskLevelColor(score: number): string {
    if (score <= 30) return '#00FF88'; // Green
    if (score <= 60) return '#FFA500'; // Orange
    return '#FF4444'; // Red
  }

  /**
   * Quick check if challenge likely contains dangerous keywords
   */
  static containsDangerousKeywords(text: string): boolean {
    const dangerKeywords = [
      'kill', 'die', 'death', 'suicide',
      'jump off', 'fall from',
      'steal', 'rob', 'vandalize',
      'drugs', 'cocaine', 'heroin',
      'naked', 'strip', 'nude',
      'fight', 'attack', 'assault',
    ];

    const lowerText = text.toLowerCase();
    return dangerKeywords.some(keyword => lowerText.includes(keyword));
  }
}