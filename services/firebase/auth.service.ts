import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as firebaseUser,
    updateProfile,
} from 'firebase/auth';

import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from "../firebase/config";
import { Collections } from './collections';
import { User, UserRole } from "../../types/index";


export class AuthService {
    static async signUp(
        email: string,
        password: string,
        displayName: string,
        role: UserRole
    ): Promise<User> {
        try {
            //creating firebase user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            //update display name
            if (auth.currentUser) {
                await updateProfile(userCredential.user, { displayName })
            }

            //creating new user document in firestor
            const newUser: User = {
                id: userCredential.user.uid,
                email: email.toLowerCase(),
                displayName,
                role,
                accountTier: 'free',


                //Initializing the token balance
                dcoins: 0,
                dcoinsLifeTimeEarned: 0,
                dcoinsLifeTimeSpent: 0,


                //Initializing stats
                challengesCreated: 0,
                challengesCompleted: 0,
                challengeSuccessRate: 0,
                reputation: 0,

                isVerified: false,

                //Timestamps
                createdAt: new Date(),
                lastActiveAt: new Date(),
            };

            await setDoc(doc(db, Collections.USERS, userCredential.user.uid), {
                ...newUser,
                createdAt: serverTimestamp(),
                lastActiveAt: serverTimestamp(),
            })


            return newUser;
        } catch (error: any) {
            console.error('error signing up:', error);
            throw {
                message: error.message || 'Error signing up',
                status: error.status || 500,
            }
        }
    }

    static async signIn(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            //Getting user data from Firestore
            const userDoc = await getDoc(
                doc(db, Collections.USERS, userCredential.user.uid)
            )

            if (!userDoc.exists()) {
                throw new Error('User data not found');
            }

            //Update last active
            await updateDoc(
                doc(db, Collections.USERS, userCredential.user.uid), {
                lastActiveAt: serverTimestamp()
            }
            )

            return {
                ...userDoc.data(),
                createdAt: userDoc.data().createdAt.toDate(),
                lastActiveAt: new Date(),
            } as User;
        } catch (error: any) {
            console.error('error signing in:', error);
            throw {
                message: error.message || 'Error signing in',
                status: error.status || 500,

            }
        }
    }


    static async signOut(): Promise<void> {
        try {
            await firebaseSignOut(auth)
        } catch (error: any) {
            console.error('error signing out:', error);
            throw new Error('Error signing out');
        }
    }


    /**
   * Get current user data
   */
    static async getCurrentUser(): Promise<User | null> {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;

        const userDoc = await getDoc(doc(db, Collections.USERS, firebaseUser.uid));

        if (!userDoc.exists()) return null;

        const data = userDoc.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastActiveAt: data.lastActiveAt?.toDate() || new Date(),
            premiumUntil: data.premiumUntil?.toDate(),
        } as User;
    }

    /**
     * Listen to auth state changes
     */
    static onAuthStateChange(callback: (user: firebaseUser | null) => void) {
        return onAuthStateChanged(auth, callback);
    }

    /**
     * Update user profile
     */
    static async updateUserProfile(
        userId: string,
        updates: Partial<User>
    ): Promise<void> {
        try {
            await updateDoc(doc(db, Collections.USERS, userId), {
                ...updates,
                lastActiveAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Update profile error:', error);
            throw new Error('Failed to update profile');
        }
    }


    /**
   * Convert Firebase error codes to user-friendly messages
   */
  private static getAuthErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'Authentication error. Please try again';
    }
}

}