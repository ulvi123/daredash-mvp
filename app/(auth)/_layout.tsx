import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase/config"; // your config.ts path
import { User } from "../../types";

export default function AuthLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const mappedUser: User = {
            id: currentUser.uid,
            role: "challenger", 
            accountTier: "free", 
            dcoins: 0, 
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            phoneNumber: currentUser.phoneNumber || "",
            dcoinsLifeTimeEarned: 0,
            dcoinsLifeTimeSpent: 0,
            challengesCreated: 0,
            challengesCompleted: 0,
            challengeSuccessRate: 0,
            reputation: 0,
            isVerified: false,
            createdAt: currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime) : new Date(),
            lastActiveAt: new Date(),
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
  
    const inAuthGroup = segments[0] === "(auth)";
    const currentScreen = segments[1];
  
    if (user) {
      // ✅ Logged in
      if (inAuthGroup) {
        router.replace("/login");
      }
    } else {
      // 🚫 Not logged in → only redirect if outside auth group
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, user, segments]);
  

  if (isLoading) {
    // Show a minimal loading indicator while Firebase checks session
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#FF4D67" />
      </View>
    );
  }

  // Render nested auth pages (splash, login, signup)
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Slot />
    </View>
  );
}
