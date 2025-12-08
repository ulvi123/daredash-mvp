import { AIVerification } from "../../types/completion";

export class AIVerificationService {
  /**
   * Verify challenge completion proof using Claude Vision API
   */
  static async verifyProof(
    challengeTitle: string,
    challengeDescription: string,
    proofImageUrl: string,
    userCaption: string
  ): Promise<AIVerification> {
    const startTime = Date.now();

    try {

      //checking if api key exists
      const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;
      if (!apiKey) {
        console.warn('⚠️ No Claude API key found - using DEMO MODE');
        console.log('💡 In demo mode, all proofs are auto-approved');
        return {
          verified: true,
          confidence: 95,
          explanation: `Demo Mode: Challenge "${challengeTitle}" automatically verified. In production, this would use Claude AI to analyze the proof image and verify completion.`,
          proofMatchesDescription: true,
          noDeepfakeDetected: true,
          timestampValid: true,
          locationValid: true,
          modelUsed: 'demo-mode-auto-approve',
          verificationTimestamp: new Date(),
          processingTimeMs: Date.now() - startTime,
        }
      }


      console.log('🤖 Calling Claude API for verification...');

      // 1. Fetch the image and convert to base64
      const imageBase64 = await this.fetchImageAsBase64(proofImageUrl);

      // 2. Build the verification prompt
      const prompt = this.buildVerificationPrompt(
        challengeTitle,
        challengeDescription,
        userCaption
      );

      // 3. Call Claude API with vision
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.content
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("\n");

      console.log('📄 Claude response:', responseText);

      // 4. Parse the response
      const verification = this.parseVerificationResponse(responseText);

      const processingTime = Date.now() - startTime;

      return {
        ...verification,
        modelUsed: "claude-sonnet-4-20250514",
        verificationTimestamp: new Date(),
        processingTimeMs: processingTime,
      };
    } catch (error: any) {
      console.error('❌ AI Verification error:', error);

      // Return a failed verification on error
      return {
        verified: false,
        confidence: 0,
        explanation: `Verification failed: ${error.message}`,
        proofMatchesDescription: false,
        noDeepfakeDetected: true,
        timestampValid: true,
        locationValid: true,
        modelUsed: "claude-sonnet-4-20250514",
        verificationTimestamp: new Date(),
        processingTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Fetch image from URL and convert to base64
   */
  private static async fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error('Failed to fetch proof image');
    }
  }

  /**
   * Build verification prompt for Claude
   */
  private static buildVerificationPrompt(
    challengeTitle: string,
    challengeDescription: string,
    userCaption: string
  ): string {
    return `You are an AI verification system for a challenge completion platform. Your job is to verify if the submitted photo/video proof shows that the user actually completed the challenge.

**Challenge Details:**
Title: ${challengeTitle}
Description: ${challengeDescription}

**User's Caption:** ${userCaption || 'No caption provided'}

**Your Task:**
Analyze the image carefully and determine if it shows clear evidence that the user completed this specific challenge.

**Response Format:**
You must respond with a JSON object (and ONLY a JSON object, no other text) with this exact structure:

{
  "verified": boolean,
  "confidence": number (0-100),
  "explanation": "string explaining your decision",
  "proofMatchesDescription": boolean,
  "noDeepfakeDetected": boolean,
  "timestampValid": boolean,
  "locationValid": boolean
}

**Verification Criteria:**
1. **verified**: true if the image clearly shows the challenge was completed
2. **confidence**: How confident you are (0-100). Only return >80 if very clear
3. **explanation**: Brief explanation of your decision (2-3 sentences)
4. **proofMatchesDescription**: Does the proof match what was described?
5. **noDeepfakeDetected**: Does the image appear authentic? (Look for AI-generated artifacts, inconsistencies, impossible physics)
6. **timestampValid**: Does the image appear recent/legitimate timing-wise?
7. **locationValid**: If location matters, does it appear correct?

**Important Rules:**
- Be strict but fair
- If the proof is ambiguous or unclear, set verified: false
- If you see any signs of AI generation, manipulation, or fraud, set verified: false
- If the challenge requires specific actions and you don't see them clearly, set verified: false
- Only set confidence >80 if you're very certain

Respond now with ONLY the JSON object:`;
  }

  /**
   * Parse Claude's verification response
   */
  private static parseVerificationResponse(responseText: string): Omit<
    AIVerification,
    'modelUsed' | 'verificationTimestamp' | 'processingTimeMs'
  > {
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (typeof parsed.verified !== 'boolean') {
        throw new Error('Invalid verification response: missing verified field');
      }

      return {
        verified: parsed.verified,
        confidence: parsed.confidence || 0,
        explanation: parsed.explanation || 'No explanation provided',
        proofMatchesDescription: parsed.proofMatchesDescription ?? true,
        noDeepfakeDetected: parsed.noDeepfakeDetected ?? true,
        timestampValid: parsed.timestampValid ?? true,
        locationValid: parsed.locationValid ?? true,
      };
    } catch (error) {
      console.error('Error parsing verification response:', error);
      console.error('Raw response:', responseText);

      // Return conservative defaults on parse error
      return {
        verified: false,
        confidence: 0,
        explanation: 'Failed to parse verification response',
        proofMatchesDescription: false,
        noDeepfakeDetected: true,
        timestampValid: true,
        locationValid: true,
      };
    }
  }

  /**
   * Check if image appears to be AI-generated (basic checks)
   */
  private static async checkForDeepfake(imageUrl: string): Promise<boolean> {
    // TODO: Implement more sophisticated deepfake detection
    // For now, we rely on Claude's visual analysis
    return true;
  }
}