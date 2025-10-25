import { User, UserRole } from ".";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (updates: Partial<User>) => Promise<void>;
  }