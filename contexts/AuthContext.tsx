import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/firebase/auth.service';
import { auth } from '../services/firebase/config';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (!firebaseUser) {
        console.log("Auth state: logged out");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await AuthService.getCurrentUser();

        // ⛔ Prevent restoring user during logout race condition
        if (!auth.currentUser) {
          console.log("Ignored stale user after logout");
          setUser(null);
          setLoading(false);
          return;
        }

        console.log("Auth state: logged in");
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      }

      setLoading(false); // ← YOU WERE MISSING THIS
    });

    return unsubscribe;
  }, []);


  const signIn = async (email: string, password: string) => {
    const userData = await AuthService.signIn(email, password);
    setUser(userData);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => {
    const userData = await AuthService.signUp(email, password, displayName, role);
    setUser(userData);
    //Refresh to get custom claims
    await refreshUser();
  };

  const signOut = async () => {
    setUser(null);
    await AuthService.signOut();
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}