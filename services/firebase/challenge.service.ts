import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  increment
} from "firebase/firestore";

import { AIAnalysis } from "../../types/aianalysis";
import {
  Challenge,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
  PrizeModel,
} from "../../types/challenges";
import { Config } from "../../utils/constants/config";
import { Collections } from "./collections";
import { db } from "./config";
import { TokenService } from "./token.service";

export class ChallengeService {
  //Createing new challenge

  static async createChallenge(
    creatorId: string,
    creatorName: string,
    creatorAvatar: string | undefined,
    title: string,
    description: string,
    category: ChallengeCategory,
    difficulty: ChallengeDifficulty,
    stakeAmount: number,
    prizeModel: PrizeModel,
    aianalysis: AIAnalysis,
    expireInHours: number,
    maxCompletions?: number,
    requiresLocation?: boolean,
    locationLat?: number,
    locationLng?: number,
    locationRadius?: number
  ): Promise<string> {
    try {
      //validating stake amount
      if (stakeAmount < Config.MIN_CHALLENGE_STAKE) {
        throw new Error(
          `Minimum stake is ${Config.MIN_CHALLENGE_STAKE} Dcoins`
        );
      }

      //Checking if the user has the enough balance
      const hasBalance = await TokenService.hasEnoughBalance(
        creatorId,
        stakeAmount
      );
      if (!hasBalance) {
        throw new Error("Insufficient Dcoins balance");
      }

      //Calculating fees
      const platformFee = TokenService.claculatePlatformFee(stakeAmount);
      const prizePool = TokenService.calculatePrizePool(stakeAmount);

      //Deducting the stake from the creator
      await TokenService.deductDCoins(
        creatorId,
        stakeAmount,
        "challenge_stake",
        `Created challenge ${title}`,
        { challengeTitle: title }
      );

      //Calculating expiry date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expireInHours);

      //checking the status
      const getInitalStatus = (): ChallengeStatus => {
        if (aianalysis.approved) return "active";
        if (aianalysis.overallRiskScore > Config.AI_RISK_SCORE_AUTO_APPROVE)
          return "rejected";
        return "pending_moderation";
      };

      //Creating Challenge document
      const challengeData = {
        creatorId,
        creatorName,
        creatorAvatar: creatorAvatar || null,
        title,
        description,
        category,
        difficulty,
        stakeAmount,
        platformFee,
        prizePool,
        prizeModel,
        maxCompletions: maxCompletions || null,
        aianalysis: {
          ...aianalysis,
          analysisTimestamp: Timestamp.fromDate(aianalysis.analysisTimestamp),
        },
        riskScore: aianalysis.overallRiskScore,
        moderationFlags: aianalysis.flags.map((flag) => flag.message),
        status: getInitalStatus(),
        requiresLocation: requiresLocation || null,
        locationLat: locationLat || null,
        locationLng: locationLng || null,
        locationRadius: locationRadius || null,
        expiresAt: Timestamp.fromDate(expiresAt),
        views: 0,
        attempts: 0,
        completions: 0,
        createdAt: serverTimestamp(),
        publishedAt: aianalysis.approved ? serverTimestamp() : null,
      };

      const docRef = await addDoc(
        collection(db, Collections.CHALLENGES),
        challengeData
      );

      //Update user stats
      await updateDoc(doc(db, Collections.USERS, creatorId), {
        challengesCreated: (await this.getUserChallengeCount(creatorId)) + 1, // ✅ Fixed typo
      });

      return docRef.id;
    } catch (error: any) {
      console.error("Error creating challenge: ", error);
      throw new Error(error.message || "Failed to create challenge");
    }
  }

  /**
   * Get challenge by ID
   */

  static async getChallengeById(
    challengeId: string
  ): Promise<Challenge | null> {
    try {
      const challengeDoc = await getDoc(
        doc(db, Collections.CHALLENGES, challengeId)
      );
      if (!challengeDoc.exists()) {
        return null;
      }

      return this.formatChallenge(challengeId, challengeDoc.data());
    } catch (error) {
      console.error("Error getting challenge: ", error);
      return null;
    }
  }
  /**
   * Get active challenges (feed)
   */
  static async getActiveChallenges(
    categoryFilter?: ChallengeCategory,
    limitCount: number = 20
  ): Promise<Challenge[]> {
    try {
      const constraints = [
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ];

      if (categoryFilter) {
        constraints.unshift(where("category", "==", categoryFilter));
      }

      const q = query(collection(db, Collections.CHALLENGES), ...constraints);

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) =>
        this.formatChallenge(doc.id, doc.data())
      );
    } catch (error) {
      console.error("Error getting challenges:", error);
      return [];
    }
  }


  /**
   * Get challenges created by user
   */
  static async getChallengesByCreator(
    creatorId: string,
    limitCount: number = 20
  ): Promise<Challenge[]> {
    try {
      const q = query(
        collection(db, Collections.CHALLENGES),
        where("creatorId", "==", creatorId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) =>
        this.formatChallenge(doc.id, doc.data())
      );
    } catch (error) {
      console.error("Error getting user challenges:", error);
      return [];
    }
  }

  /**
   * Accept a challenge
   */

  static async acceptChallenge(
    challengeId: string,
    userId: string
  ): Promise<void> {
    try {
      console.log('🎯 Accepting challenge:', { challengeId, userId });

      const challengeRef = await doc(db, Collections.CHALLENGES, challengeId);
      const challengeDoc = await getDoc(challengeRef);

      if (!challengeDoc.exists()) {
        throw new Error("Challenge not found");
      }

      const challenge = challengeDoc.data();
      console.log('📄 Current challenge data:', {
        status: challenge.status,
        creatorId: challenge.creatorId,
        acceptedBy: challenge.acceptedBy,
      });

      if (challenge.status !== "active") {
        throw new Error("Challenge is not active");
      }

      if (challenge.creatorId === userId) {
        throw new Error("Cannot accept your own challenge");
      }

      if (challenge.acceptedBy) {
        throw new Error("Challenge already accepted");
      }

      //updating challenge status:
      const updateData = {
        status: "in_progress",
        acceptedBy: userId,
        acceptedAt: serverTimestamp(),
        attempts: (challenge.attempts || 0) + 1
      };

      console.log('✍️ Updating challenge with:', updateData);
      await updateDoc(challengeRef, updateData);
      console.log('✅ Challenge updated successfully');

    } catch (error: any) {
      console.error("Error accepting challenge: ", error);
      console.error("❌ Error accepting challenge:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      throw new Error(error.message || "Failed to accept challenge");
    }
  }

  /**
   * Increment view count
   */
  static async incrementViews(challengeId: string): Promise<void> {
    try {
      const ref = doc(db, Collections.CHALLENGES, challengeId);
      await updateDoc(ref, { views: increment(1) });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

  /**
   * Format Firestore document to Challenge type
   */
  private static formatChallenge(id: string, data: any): Challenge {
    return {
      id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || undefined,
      completedAt: data.completedAt?.toDate() || undefined,
      expiresAt: data.expiresAt?.toDate() || new Date(),
      acceptedAt: data.acceptedAt?.toDate() || undefined,
      aiAnalysis: {
        ...data.aianalysis,
        analysisTimestamp:
          data.aianalysis?.analysisTimestamp?.toDate() || new Date(),
      },
    } as Challenge;
  }

  /**
   * Get user's challenge count
   */
  private static async getUserChallengeCount(userId: string): Promise<number> {
    try {
      const userDoc = await getDoc(doc(db, Collections.USERS, userId));
      return userDoc.exists() ? userDoc.data().challengesCreated || 0 : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Cancel a challenge (before anyone accepts)
   */
  static async cancelChallenge(
    challengeId: string,
    creatorId: string
  ): Promise<void> {
    try {
      const challengeRef = doc(db, Collections.CHALLENGES, challengeId);
      const challengeDoc = await getDoc(challengeRef);

      if (!challengeDoc.exists()) {
        throw new Error("Challenge not found");
      }

      const challenge = challengeDoc.data();

      if (challenge.creatorId !== creatorId) {
        throw new Error("Not authorized to cancel this challenge");
      }

      if (
        challenge.status !== "active" &&
        challenge.status !== "pending_moderation"
      ) {
        throw new Error("Cannot cancel challenge in current status");
      }

      if (challenge.acceptedBy) {
        throw new Error("Cannot cancel - challenge already accepted");
      }

      // Refund the stake (minus a small cancellation fee?)
      const refundAmount = challenge.stakeAmount;
      await TokenService.addDCoins(
        creatorId,
        refundAmount,
        "challenge_refund",
        `Refund for cancelled challenge: ${challenge.title}`,
        { challengeId }
      );

      // Update challenge status
      await updateDoc(challengeRef, {
        status: "cancelled",
      });
    } catch (error: any) {
      console.error("Error cancelling challenge:", error);
      throw new Error(error.message || "Failed to cancel challenge");
    }
  }
}
