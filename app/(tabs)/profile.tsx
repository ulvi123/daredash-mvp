import { View, Text, StyleSheet, Image, FlatList, Dimensions, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { format } from 'date-fns';
import { db } from '../../services/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Collections } from '../../services/firebase/collections';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user } = useAuth();
  const [userCompletions, setUserCompletions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserCompletions();
  }, []);

  const loadUserCompletions = async () => {
    if (!user?.uid) return;

    try {
      const q = query(
        collection(db, Collections.COMPLETIONS),
        where('userId', '==', user.uid)
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

  const totalRewards = userCompletions.reduce((sum, c) => sum + (c.rewardAmount || 0), 0);

  return (
    <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            style={styles.avatarBorder}
          >
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
            Joined {format(user?.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(), 'MMM yyyy')}
          </Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userCompletions.length}</Text>
          <Text style={styles.statLabel}>Completions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalRewards}</Text>
          <Text style={styles.statLabel}>DC Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Verification Rate</Text>
        </View>
      </View>

      {/* Recent Completions */}
      <Text style={styles.sectionTitle}>Recent Completions</Text>

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

      {/* Edit Profile / Settings */}
      <View style={styles.bottomButtons}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>Log Out</Text>
        </Pressable>
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
  bottomButtons: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
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
    borderColor: Colors.textSecondary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
