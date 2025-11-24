import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Add this import
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Collections } from '../../services/firebase/collections';
import { db } from '../../services/firebase/config';
import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';


const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, signOut } = useAuth();  // Add signOut here
  const router = useRouter();  // Add router
  const [userCompletions, setUserCompletions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);



  useEffect(() => {
    loadUserCompletions();
  });

  const loadUserCompletions = async () => {
    if (!user?.id) return;  // Changed from user?.uid to user?.id

    try {
      const q = query(
        collection(db, Collections.COMPLETIONS),
        where('userId', '==', user.id)  // Changed from user.uid to user.id
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      }));
      setUserCompletions(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add logout handler
  const handleLogout = () => {
    console.log("⚠️ LOGOUT MODAL OPENED");
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    console.log("🟡 Logout pressed");

    try {
      await signOut();
      console.log("🟢 Firebase signed out");

      router.replace("/login");
      console.log("🔵 Redirected");
    } catch (err) {
      console.error("🔴 Logout error:", err);
    }
  };



  const totalRewards = userCompletions.reduce((sum, c) => sum + (c.rewardAmount || 0), 0);

  return (
    <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.container}>

      {/* --- LOGOUT MODAL (Step 4) --- */}
      {showLogoutModal && (
        <View style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          zIndex: 999,
        }}>
          <View style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 16,
            width: "90%",
            maxWidth: 350,
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Log Out
            </Text>

            <Text style={{ marginBottom: 20 }}>
              Are you sure you want to log out?
            </Text>

            <TouchableOpacity
              onPress={confirmLogout}
              style={{
                backgroundColor: "red",
                padding: 12,
                alignItems: "center",
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              style={{
                backgroundColor: "#ddd",
                padding: 12,
                alignItems: "center",
                borderRadius: 10,
              }}>
              <Text style={{ fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* --- END MODAL --- */}


      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.avatarBorder}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.displayName || 'Anonymous User'}</Text>
          <Text style={styles.userSince}>
            Joined {format(user?.createdAt || new Date(), 'MMM yyyy')}
          </Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user?.challengesCompleted || 0}</Text>
          <Text style={styles.statLabel}>Completions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user?.dcoinsLifeTimeEarned || 0}</Text>
          <Text style={styles.statLabel}>DC Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user?.reputation || 0}</Text>
          <Text style={styles.statLabel}>Reputation</Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceEmoji}>🪙</Text>
          <Text style={styles.balanceValue}>{user?.dcoins || 0} DC</Text>
        </View>
        <Pressable
          style={styles.addFundsButton}
          onPress={() => router.push('/purchase-tokens')}
        >
          <Text style={styles.addFundsText}>+ Add DCoins</Text>
        </Pressable>
      </View>

      {/* Recent Completions */}
      <Text style={styles.sectionTitle}>Recent Completions</Text>

      {userCompletions.length > 0 ? (
        <FlatList
          data={userCompletions}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
          renderItem={({ item }) => (
            <View style={styles.completionCard}>
              <LinearGradient
                colors={[Colors.surface, Colors.background]}
                style={styles.completionGradient}
              >
                <View style={styles.completionIconContainer}>
                  <Text style={styles.completionIcon}>🎥</Text>
                </View>
                <Text style={styles.completionTitle} numberOfLines={1}>
                  {item.caption || 'Untitled Completion'}
                </Text>
                <Text style={styles.completionDate}>
                  {format(item.submittedAt, 'MMM d, yyyy')}
                </Text>
                <View style={styles.completionReward}>
                  <Text style={styles.rewardEmoji}>🪙</Text>
                  <Text style={styles.rewardText}>{item.rewardAmount || 0} DC</Text>
                </View>
              </LinearGradient>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No completions yet</Text>
          <Text style={styles.emptySubtext}>
            Start completing challenges to see them here!
          </Text>
        </View>
      )}

      {/* Edit Profile / Settings */}
      <View style={styles.bottomButtons}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleLogout}
        >
          <Text style={styles.secondaryButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );

};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingTop: 60,  // Add top padding for status bar
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.primary,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  userSince: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  balanceEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
  },
  addFundsButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  addFundsText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  completionCard: {
    width: width * 0.55,
    height: 180,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  completionGradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  completionIconContainer: {
    alignItems: 'center',
  },
  completionIcon: {
    fontSize: 50,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  completionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  completionReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  bottomButtons: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.danger,
  },
});