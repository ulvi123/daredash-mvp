import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Fade and scale animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000", // dark sleek background
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      {/* App Logo / Title */}
      <Animated.Text
        style={{
          fontSize: 42,
          fontWeight: "800",
          color: "#fff",
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          marginBottom: 60,
          letterSpacing: 1.5,
        }}
      >
        Dare
        <Text style={{ color: "#FF4D67" }}>Dash</Text>
      </Animated.Text>

      {/* Animated buttons */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          width: "100%",
          alignItems: "center",
          gap: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#FF4D67",
            width: "80%",
            paddingVertical: 14,
            borderRadius: 30,
            alignItems: "center",
            shadowColor: "#FF4D67",
            shadowOpacity: 0.5,
            shadowRadius: 10,
          }}
          onPress={() => router.push("/login")}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            borderColor: "#FF4D67",
            borderWidth: 2,
            width: "80%",
            paddingVertical: 14,
            borderRadius: 30,
            alignItems: "center",
          }}
          onPress={() => router.push("/signup")}
        >
          <Text style={{ color: "#FF4D67", fontSize: 18, fontWeight: "600" }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
