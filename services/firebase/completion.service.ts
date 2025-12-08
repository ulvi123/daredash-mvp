import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
    orderBy,
    limit
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./config"
import { Collections } from "./collections"
import { Completion, CompletionStatus, AIVerification } from "../../types/completion"
import { TokenService } from "./token.service"
import { AIVerificationService } from "../ai/verification.service"


export class CompletionService {
    /**
     * Submit proof for a challenge
    */

    static async submitProof(
        challengeId: string,
        userId: string,
        userName: string,
        userAvatar: string | undefined,
        proofType: 'photo' | 'video',
        proofUri: string,
        caption?: string,
        locationLat?: number,
        locationLng?: number,
        locationAccuracy?: number
    ): Promise<string> {
        try {
            console.log("Submitting proof for challenge: ", challengeId)

            //1.Verify challenge exists and is accepted by user
            const challengeRef = doc(db, Collections.CHALLENGES, challengeId)
            const challengeDoc = await getDoc(challengeRef)

            if (!challengeDoc.exists()) {
                throw new Error("Challenge not found")
            }

            const challenge = challengeDoc.data()

            if (challenge.acceptedBy !== userId) {
                throw new Error("You have not accepted this challenge")
            }
            if (challenge.status !== "in_progress") {
                throw new Error("Challenge is not in progress")
            }

            //Check if already it is submitted
            const existingCompletion = await this.getCompletionByUserAndChallenge(
                userId,
                challengeId
            )
            if (existingCompletion) {
                throw new Error("You have already submitted proof for that challenge")
            }

            //2.Uploading proof to firebase
            console.log("Uploading proof to storage...")
            const proofUrl = await this.uploadProof(
                userId,
                challengeId,
                proofUri,
                proofType,
            )
            console.log("Proof uploaded", proofUrl)



            //3.Creating initial compleiton document
            const completionData = {
                challengeId,
                userId,
                userName,
                userAvatar: userAvatar || null,
                proofType,
                proofUrl,
                proofThumbnail: null, // TODO: generateing thumbnail impoortant,
                caption: caption || null,
                locationLat: locationLat || null,
                locationLng: locationLng || null,
                locationAccuracy: locationAccuracy || null,
                aiVerification: null, // Will be set after verification
                status: 'verifying' as CompletionStatus,
                rewardAmount: challenge.prizePool,
                rewardPaid: false,
                submittedAt: serverTimestamp(),
                verifiedAt: null,
                paidAt: null,
                rank: null,
                voteScore: 0,
            }

            const docRef = await addDoc(
                collection(db, Collections.COMPLETIONS),
                completionData
            )
            console.log('✅ Completion document created:', docRef.id);


            //4.Updating the challenge status
            await updateDoc(
                challengeRef, {
                status: "pending_verification",
            }
            )


            //5.Starting AI verification asynchronously which means we dont wait for it
            this.verifyProofAsync(
                docRef.id,
                challengeId,
                challenge.title,
                challenge.description,
                proofUrl,
                caption || "",
                challenge.prizePool,
                userId
            )


            return docRef.id;

        } catch (error: any) {
            console.error("Error submitting proof: ", error)
            throw new Error(error.message || "Failed to submit proof")
        }
    }


    //Methods

    /**
   * Upload proof media to Firebase Storage
   */
    private static async uploadProof(
        userId: string,
        challengeId: string,
        proofUri: string,
        proofType: 'photo' | 'video'
    ): Promise<string> {
        try {
            //Converting URI to blob
            const response = await fetch(proofUri)
            const blob = await response.blob()

            //Creating storage reference
            const timestamp = Date.now()
            const extension = proofType === 'video' ? 'mp4' : 'jpg'
            const filename = `${userId}_${challengeId}_${timestamp}.${extension}`;
            const storageRef = ref(
                storage,
                `completions/${challengeId}/${filename}`
            );
            //Uploading file
            await uploadBytes(storageRef, blob)

            //Getting download Url
            const downloadUrl = await getDownloadURL(storageRef)
            return downloadUrl;
        } catch (error) {
            console.error('❌ Error uploading proof:', error);
            throw new Error('Failed to upload proof media');
        }
    }


    /**
    * Verify proof using AI (async, doesn't block submission)
    */

    private static async verifyProofAsync(
        completionId: string,
        challengeId: string,
        challengeTitle: string,
        challengeDescription: string,
        proofUrl: string,
        caption: string,
        rewardAmount: number,
        userId: string,
    ): Promise<void> {
        try {
            console.log("Starting AI verification for completion: ", completionId)

            //Calling AI verification service:
            const verification = await AIVerificationService.verifyProof(
                challengeTitle,
                challengeDescription,
                proofUrl,
                caption
            )

            console.log("AI verificaiton complete: ", verification)

            //Updating completion with verification resutls
            const completionRef = doc(db, Collections.COMPLETIONS, completionId)
            const updateData: any = {
                aiVerification: {
                    ...verification,
                    verificationTimestamp: Timestamp.fromDate(verification.verificationTimestamp)
                },
                status: verification.verified ? "verified" : "rejected",
                verifiedAt: serverTimestamp(),
            };

            await updateDoc(completionRef, updateData)


            //If verified then we distribute rewards
            if (verification.verified) {
                await this.distributeRewards(completionId, challengeId, userId, rewardAmount)
            } else {
                //Updating the challenge status to failed
                await updateDoc(doc(db, Collections.CHALLENGES, challengeId), {
                    status: 'failed'
                })
            }

            console.log("Verification process completed successfully!")
        } catch (error) {
            console.error("❌ Error in AI verification:", error)

            //Marking here completion as failed 
            const completionRef = doc(db, Collections.COMPLETIONS, completionId)
            await updateDoc(completionRef, {
                status: 'rejected',
                aiVerification: {
                    verified: false,
                    confidence: 0,
                    explanation: 'Verification failed due to system Error',
                    proofMatchesDescription: false,
                    noDeepFakeDetected: true,
                    timestampValid: true,
                    locationValid: true,
                    modelUsed: 'error',
                    verificationTimestamp: serverTimestamp(),
                    processingTimeMs: 0
                }
            })
        }
    }

    /**
    * Distribute rewards after successful verification
    */

    private static async distributeRewards(
        completionId: string,
        challengeid: string,
        userId: string,
        rewardAmount: number
    ): Promise<void> {
        try {
            console.log("Distributing rewards:", rewardAmount, " DC to user:", userId)

            //Adding Dcoins to user
            await TokenService.addDCoins(
                userId,
                rewardAmount,
                'challenge_reward',
                'Reward for completiing challenge',
                { completionId, challengeid }
            )

            //Updating completion as paid
            await updateDoc(doc(db, Collections.COMPLETIONS, completionId), {
                status: 'paid',
                rewardPaid: true,
                paidAt: serverTimestamp()
            })


            //Updating the challenge status
            await updateDoc(doc(db, Collections.CHALLENGES, challengeid), {
                status: 'completed',
                completedAt: serverTimestamp(),
                completions: (await this.getChallengeCompletionCount(challengeid)) + 1
            })

            //Updating user statistics
            const userRef = doc(db, Collections.USERS, userId)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const currentCompletions = userDoc.data().challengesCompleted || 0;
                await updateDoc(userRef, {
                    challengesCompleted: currentCompletions + 1
                })
            }

            console.log('✅ Rewards distributed successfully');
        } catch (error) {
            console.error('❌ Error distributing rewards:', error);
            throw error;

        }
    }

    /**
   * Get completion by ID
   */

    static async getCompletionById(
        completionId: string
    ): Promise<Completion | null> {
        try {
            const document = await getDoc(
                doc(db, Collections.COMPLETIONS, completionId)
            )
            if (!document.exists()) return null
            return this.formatCompletion(document.id, document.data())
        } catch (error) {
            console.error('Error getting completion:', error);
            return null;
        }
    }


    /**
   * Get completion by user and challenge
   */
    static async getCompletionByUserAndChallenge(
        userId: string,
        challengeId: string
    ): Promise<Completion | null> {
        try {
            const q = query(
                collection(db, Collections.COMPLETIONS),
                where('userId', '==', userId),
                where('challengeId', '==', challengeId),
                limit(1)
            );

            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            return this.formatCompletion(doc.id, doc.data());
        } catch (error) {
            console.error('Error getting completion:', error);
            return null;
        }
    }

    /**
   * Get completions for a challenge
   */
    static async getCompletionsByChallenge(
        challengeId: string
    ): Promise<Completion[]> {
        try {
            const q = query(
                collection(db, Collections.COMPLETIONS),
                where('challengeId', '==', challengeId),
                orderBy('submittedAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => this.formatCompletion(doc.id, doc.data()));
        } catch (error) {
            console.error('Error getting completions:', error);
            return [];
        }
    }

    /**
     * Get completions by user
     */
    static async getCompletionsByUser(userId: string): Promise<Completion[]> {
        try {
            const q = query(
                collection(db, Collections.COMPLETIONS),
                where('userId', '==', userId),
                orderBy('submittedAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => this.formatCompletion(doc.id, doc.data()));
        } catch (error) {
            console.error('Error getting user completions:', error);
            return [];
        }
    }

    /**
     * Get challenge completion count
     */
    private static async getChallengeCompletionCount(
        challengeId: string
    ): Promise<number> {
        try {
            const q = query(
                collection(db, Collections.COMPLETIONS),
                where('challengeId', '==', challengeId),
                where('status', '==', 'paid')
            );
            const snapshot = await getDocs(q);
            return snapshot.size;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Format Firestore document to Completion type
     */
    private static formatCompletion(id: string, data: any): Completion {
        return {
            id,
            ...data,
            submittedAt: data.submittedAt?.toDate() || new Date(),
            verifiedAt: data.verifiedAt?.toDate() || undefined,
            paidAt: data.paidAt?.toDate() || undefined,
            aiVerification: data.aiVerification
                ? {
                    ...data.aiVerification,
                    verificationTimestamp:
                        data.aiVerification.verificationTimestamp?.toDate() || new Date(),
                }
                : null,
        } as Completion;
    }






}