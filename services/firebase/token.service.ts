import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    increment,
    runTransaction
} from 'firebase/firestore'
import { db } from './config'
import { Collections } from './collections'
import { Config } from '../../utils/constants/config';
import { Transaction } from '@google-cloud/firestore';
import { PurchasePackage } from '../../types/transaction';
import { TransactionType } from '../../types/transaction';
// import {Transaction, TransactionType, User} from "../../types"

export class TokenService {
    //add Dcoins to user balance

    static async addDCoins(
        userId: string,
        amount: number,
        type: TransactionType,
        description: string,
        metadata: Record<string, any>
    ): Promise<void> {
        try {
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, Collections.USERS, userId);
                const userDoc = await transaction.get(userRef)

                if (!userDoc.exists()) {
                    throw new Error("User not found")
                }


                const currentBalanace = userDoc.data().dcoins || 0;
                const newBalance = currentBalanace + amount;

                //update user balance
                transaction.update(userRef, {
                    dcoins: newBalance,
                    dcoinsLifeTimeEarned: increment(amount)

                })


                //creating transaction record

                const transactionRef = doc(collection(db, Collections.TRANSACTIONS));
                transaction.set(transactionRef, {
                    id: transactionRef.id,
                    userId,
                    type,
                    amount,
                    balanceAfter: newBalance,
                    description,
                    metadata: metadata || {},
                    createdat: serverTimestamp()
                })

            })
        } catch (error) {
            console.error('Error addind Dcoins: ', error)
            throw new Error("Failed to add Dcoins")
        }
    }

    //DEDUCTING Dcoins
    static async deductDCoins(
        userId: string,
        amount: number,
        type: TransactionType,
        description: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, Collections.USERS, userId);
                const userDoc = await transaction.get(userRef)

                if (!userDoc.exists()) {
                    throw new Error("User not found")
                }


                const currentBalanace = userDoc.data().dcoins || 0;

                if (currentBalanace < amount) {
                    throw new Error("Insifficient funds")
                }

                const newBalance = currentBalanace - amount;

                //update user balance

                transaction.update(userRef, {
                    dcoins: newBalance,
                    dcoinslifeTimeSpent: increment(amount)
                })

                //creating transaction record
                const transactionRef = doc(collection(db, Collections.TRANSACTIONS))
                transaction.set(transactionRef, {
                    id: transactionRef.id,
                    userId,
                    type,
                    amount: -amount,
                    balanceAfter: newBalance,
                    description,
                    metadata: metadata || {},
                    createdAt: serverTimestamp()

                })
            })
        } catch (error: any) {
            console.error("Error deducting DCoins: ", error);
            throw new Error(error.message || 'Failed to deduct DCoins')
        }
    }


    //Purchasing Dcoins(simulation for mvp)

    static async purchaseDcoins(
        userId: string,
        packageId: string
    ): Promise<void> {
        const pkg = Config.PURCHASE_PACKAGES.find(p => p.id == packageId)

        if (!pkg) {
            throw new Error('Invalid package')
        }

        //Calculating Dcoins with bonus
        const totalDCoins = pkg.dcoins + Math.floor(pkg.dcoins * pkg.bonusPercentage / 100)

        await this.addDCoins(
            userId,
            totalDCoins,
            'purchase',
            `Purchased ${pkg.name} package`,
            {
                packageId,
                baseAmount: pkg.dcoins,
                bonusAmount: totalDCoins - pkg.dcoins,
                priceEUR: pkg.price
            }
        )
    }



    /**
       * Transfer DCoins between users (for challenge rewards)
    */

    static async transferDCoins(
        fromUserId: string,
        toUserId: string,
        amount: number,
        challengeId: string,
        description: string
    ): Promise<void> {
        try {
            await runTransaction(db, async (transaction) => {
                const fromUserRef = doc(db, Collections.USERS, fromUserId)
                const toUserRef = doc(db, Collections.USERS, toUserId)

                const fromUserDoc = await transaction.get(fromUserRef);
                const toUserDoc = await transaction.get(toUserRef);


                if (!fromUserDoc.exists() || !toUserDoc.exists()) {
                    throw new Error("User not found!")
                }

                const fromBalanace = fromUserDoc.data().dcoins || 0;
                if (fromBalanace < 0) {
                    throw new Error('Insifficient funds')
                }

                const toBalance = toUserDoc.data().dcoins || 0;


                //Deducting from sender
                transaction.update(fromUserRef, {
                    dcoins: fromBalanace - amount,
                    dcoinsLifeTimeSpent: increment(amount)
                })

                transaction.update(toUserRef, {
                    dcoins: toBalance + amount,
                    dcoinsLifeTimeEarned: increment(amount)
                })


                //creating transaciton records
                const fromTransactionRef = doc(collection(db, Collections.TRANSACTIONS))
                transaction.set(fromTransactionRef, {
                    id: fromTransactionRef.id,
                    userId: fromUserId,
                    type: 'challenge_stake' as TransactionType,
                    amount: -amount,
                    balanceAfter: fromBalanace - amount,
                    challengeId,
                    description: `${description} (sent)`,
                    createdAt: serverTimestamp()
                })


                const toTransactionRef = doc(collection(db, Collections.TRANSACTIONS))
                transaction.set(toTransactionRef, {
                    id: toTransactionRef.id,
                    userId: toUserId,
                    type: 'prize_won',
                    amount: amount,
                    balanceAfter: toBalance + amount,
                    challengeId,
                    description: `${description} (received)`,
                    createdAt: serverTimestamp()
                })
            })
        } catch (error: any) {
            console.error('Error transferring the Dcoins: ', error);
            throw new Error(error.message || 'Failed to transfer DCoins')
        }
    }

    static async getTransactionHistory(
        userId: string,
        limitCount: number = 50
    ): Promise<Transaction[]> {
        try {
            const q = query(
                collection(db, Collections.TRANSACTIONS),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            } as unknown as Transaction));
        } catch (error) {
            console.error('Error getting transaction history:', error);
            throw new Error('Failed to get transaction history');
        }
    }

    /**
   * Calculate platform fee
   */

    static claculatePlatformFee(stakeAmount: number): number {
        return Math.floor(stakeAmount * Config.PLATFORM_FEE_PERCENTAGE / 100)
    }

    /**
     * Calculate prize pool
   */

    static calculatePrizePool(stakeAmount: number): number {
        return Math.floor(stakeAmount * Config.PRIZE_POOL_PERCENTAGE / 100)
    }

    /**
  * Check if user has enough DCoins
  */

    static async hasEnoughBalance(userId: string, amount: number): Promise<boolean> {
        try {
            const userDoc = await getDoc(doc(db, Collections.USERS, userId))

            if (!userDoc.exists()) {
                return false
            }

            const balance = userDoc.data().dcoins || 0;
            return balance >= amount;

        } catch (error: any) {
            console.error('Error checking balance: ', error)
            return false;
        }
    }


    static async getUserCurrentBalance(userId: string): Promise<number> {
        try {
            const userdoc = await getDoc(doc(db, Collections.USERS, userId))
            if (!userdoc.exists()) {
                throw new Error("User not found")
            }

            return userdoc.data().dcoins || 0;
        } catch (error: any) {
            console.error('Error getting the balance', error)
            return 0;
        }
    }



    /**
      * Calculate withdrawal fee based on time held
    */


    static calculateWithfdrawalFee(amount: number, daysHeld: number): number {
        let feePercentage: number;

        if (daysHeld < 7) {
            feePercentage = Config.WITHDRAWAL_FEE.UNDER_7_DAYS;
        } else if (daysHeld < 30) {
            feePercentage = Config.WITHDRAWAL_FEE.UNDER_30_DAYS;
        } else if (daysHeld < 90) {
            feePercentage = Config.WITHDRAWAL_FEE.UNDER_90_DAYS;
        } else {
            feePercentage = Config.WITHDRAWAL_FEE.OVER_90_DAYS;
        }

        return Math.floor(amount * feePercentage / 100);
    }

















}