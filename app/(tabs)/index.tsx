import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../services/firebase/config";
import { Challenge } from "../../types/challenges";

const { width } = Dimensions.get("window");

export default function Index() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "challenges"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Challenge[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          ...(data as Omit<Challenge, "id">),
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          expiresAt: data.expiresAt?.toDate?.() ?? new Date(),
        });
      });
      setChallenges(list);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderChallengeCard = ({ item }: { item: Challenge }) => (
    <View
      style={{
        width: width * 0.9,
        alignSelf: "center",
        marginVertical: 10,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <View style={{
          width: 40, height: 40, borderRadius: 20, backgroundColor: "#ddd", marginRight: 10
        }}>
          {item.creatorAvatar && <Image source={{ uri: item.creatorAvatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 14 }}>{item.creatorName}</Text>
          <Text style={{ fontSize: 12, color: "#888" }}>{item.category.toUpperCase()}</Text>
        </View>
      </View>

      {/* Body */}
      <LinearGradient
        colors={["#f5f5f5", "#fff"]}
        style={{ padding: 16 }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: "#555" }} numberOfLines={3}>
          {item.description}
        </Text>
      </LinearGradient>

      {/* Stats Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 12, borderTopWidth: 1, borderColor: "#eee" }}>
        <Text style={{ fontWeight: "600" }}>💰 {item.prizePool} DC</Text>
        <Text style={{ fontWeight: "600" }}>⭐ {item.difficulty}</Text>
        <Text style={{ fontWeight: "600" }}>👀 {item.views}</Text>
        <Text style={{ fontWeight: "600" }}>✅ {item.completions}</Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#4f46e5",
          paddingVertical: 12,
          alignItems: "center",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
        onPress={() => console.log("Challenge clicked", item.id)}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>View Challenge</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: "#f0f0f0" }}
      data={challenges}
      keyExtractor={(item) => item.id}
      renderItem={renderChallengeCard}
      showsVerticalScrollIndicator={false}
    />
  );
}
