
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import DCoinBalance from '../../components/token/DcoinBalance';
import Button from '../../components/common/Button';
import * as Haptics from 'expo-haptics';
import { formatDistanceToNow } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [scrollY] = useState(new Animated.Value(0));

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await signOut();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        },
      ]
    );
  };


  // Parallax effect for header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const getRoleEmoji = () => {
    switch (user?.role) {
      case 'challenger': return '🎨';
      case 'doer': return '🎯';
      case 'both': return '⚡';
      default: return '👤';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'challenger': return 'Challenger';
      case 'doer': return 'Doer';
      case 'both': return 'Creator & Doer';
      default: return 'User';
    }
  };

  const netProfit = (user?.dcoinsLifeTimeEarned || 0) - (user?.dcoinsLifeTimeEarned || 0);
  const isProfitable = netProfit >= 0;

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={['#0A0E27', '#1a1f3a', '#0A0E27']}
        style={styles.backgroundGradient}
      />

      {/* Floating orbs */}
      <View style={styles.orbContainer}>
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with Parallax */}
        <Animated.View 
          style={[
            styles.headerSection,
            {
              transform: [{ translateY: headerTranslateY }],
              opacity: headerOpacity,
            }
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Avatar with glow effect */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlow} />
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarEmoji}>{getRoleEmoji()}</Text>
              </LinearGradient>
              
              {/* Level badge */}
              <View style={styles.levelBadge}>
                <LinearGradient
                  colors={[Colors.accent, Colors.warning]}
                  style={styles.levelGradient}
                >
                  <Text style={styles.levelText}>Lvl 1</Text>
                </LinearGradient>
              </View>
            </View>

            {/* User Info */}
            <Text style={styles.displayName}>{user?.displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            
            {/* Role Badge */}
            <BlurView intensity={80} tint="light" style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{getRoleLabel()}</Text>
            </BlurView>

            {/* Reputation Bar */}
            <View style={styles.reputationContainer}>
              <View style={styles.reputationHeader}>
                <Text style={styles.reputationLabel}>Reputation</Text>
                <Text style={styles.reputationValue}>{user?.reputation || 0}/100</Text>
              </View>
              <View style={styles.reputationBarTrack}>
                <LinearGradient
                  colors={[Colors.success, Colors.primary]}
                  style={[styles.reputationBarFill, { width: `${user?.reputation || 0}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* DCoin Balance Card */}
        {user && (
          <View style={styles.section}>
            <BlurView intensity={60} tint="dark" style={styles.balanceBlur}>
              <LinearGradient
                colors={['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.2)']}
                style={styles.balanceCard}
              >
                <DCoinBalance balance={user.dcoins} size="large" />
              </LinearGradient>
            </BlurView>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="🎯"
              label="Completed"
              value={user?.challengesCompleted || 0}
              color={Colors.success}
              gradient={['#00FF88', '#00D9A0']}
            />
            <StatCard
              icon="🎨"
              label="Created"
              value={user?.challengesCreated || 0}
              color={Colors.primary}
              gradient={['#0080FF', '#00C9FF']}
            />
            <StatCard
              icon="⭐"
              label="Reputation"
              value={user?.reputation || 0}
              color={Colors.accent}
              gradient={['#FFD700', '#FFA500']}
            />
            <StatCard
              icon="📈"
              label="Success"
              value={`${user?.challengeSuccessRate || 0}%`}
              color={Colors.secondary}
              gradient={['#A020F0', '#E100FF']}
            />
          </View>
        </View>

        {/* Earnings Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Earnings</Text>
          <BlurView intensity={60} tint="dark" style={styles.earningsBlur}>
            <LinearGradient
              colors={['rgba(30, 33, 57, 0.8)', 'rgba(30, 33, 57, 0.4)']}
              style={styles.earningsCard}
            >
              <EarningRow
                label="Lifetime Earned"
                value={user?.dcoinsLifeTimeEarned || 0}
                icon="💰"
                color={Colors.success}
              />
              <View style={styles.earningDivider} />
              <EarningRow
                label="Lifetime Spent"
                value={user?.dcoinsLifeTimeEarned || 0}
                icon="💸"
                color={Colors.danger}
              />
              <View style={styles.earningDivider} />
              <View style={styles.netProfitRow}>
                <View style={styles.netProfitLeft}>
                  <Text style={styles.netProfitIcon}>📊</Text>
                  <Text style={styles.netProfitLabel}>Net Profit</Text>
                </View>
                <View style={styles.netProfitRight}>
                  <LinearGradient
                    colors={isProfitable 
                      ? [Colors.success, '#00D9A0'] 
                      : [Colors.danger, '#FF6B6B']}
                    style={styles.netProfitBadge}
                  >
                    <Text style={styles.netProfitValue}>
                      {isProfitable ? '+' : ''}{netProfit.toLocaleString()} DC
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </View>

        {/* Achievement Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesScroll}
          >
            <AchievementBadge 
              emoji="🎉" 
              name="First Steps" 
              description="Created your account"
              unlocked={true}
            />
            <AchievementBadge 
              emoji="💰" 
              name="First Earn" 
              description="Complete first challenge"
              unlocked={false}
            />
            <AchievementBadge 
              emoji="🎨" 
              name="Creator" 
              description="Create 10 challenges"
              unlocked={false}
            />
            <AchievementBadge 
              emoji="🔥" 
              name="On Fire" 
              description="7 day streak"
              unlocked={false}
            />
          </ScrollView>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="👤"
              label="Edit Profile"
              onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon!')}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="🔔"
              label="Notifications"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="🛡️"
              label="Privacy & Security"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="❓"
              label="Help & Support"
              onPress={() => Alert.alert('Coming Soon', 'Help center coming soon!')}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="danger"
            icon="🚪"
            fullWidth
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>DARE v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for challenge seekers</Text>
          <View style={styles.footerDivider} />
          <Text style={styles.footerSubtext}>
            You've earned {user?.dcoinsLifeTimeEarned || 0} DCoins total! Keep going! 🚀
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
}

function StatCard({ icon, label, value, color, gradient }: { 
  icon: string; 
  label: string; 
  value: number | string; 
  color: string;
  gradient: string[];
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.statCard,
        pressed && styles.statCardPressed,
      ]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <BlurView intensity={60} tint="dark" style={styles.statBlur}>
        <LinearGradient
          colors={[gradient[0] + '20', gradient[1] + '20']}
          style={styles.statGradient}
        >
          <Text style={styles.statIcon}>{icon}</Text>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </LinearGradient>
      </BlurView>
    </Pressable>
  );
}

function EarningRow({ label, value, icon, color }: { 
  label: string; 
  value: number; 
  icon: string; 
  color: string;
}) {
  return (
    <View style={styles.earningRow}>
      <View style={styles.earningLeft}>
        <Text style={styles.earningIcon}>{icon}</Text>
        <Text style={styles.earningLabel}>{label}</Text>
      </View>
      <Text style={[styles.earningValue, { color }]}>
        {value.toLocaleString()} DC
      </Text>
    </View>
  );
}

function AchievementBadge({ emoji, name, description, unlocked }: {
  emoji: string;
  name: string;
  description: string;
  unlocked: boolean;
}) {
  return (
    <View style={[styles.achievementBadge, !unlocked && styles.achievementLocked]}>
      <LinearGradient
        colors={unlocked 
          ? ['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.2)']
          : ['rgba(107, 114, 128, 0.2)', 'rgba(107, 114, 128, 0.1)']}
        style={styles.achievementGradient}
      >
        <Text style={[styles.achievementEmoji, !unlocked && styles.achievementEmojiLocked]}>
          {unlocked ? emoji : '🔒'}
        </Text>
        <Text style={[styles.achievementName, !unlocked && styles.achievementTextLocked]}>
          {name}
        </Text>
        <Text style={[styles.achievementDescription, !unlocked && styles.achievementTextLocked]}>
          {description}
        </Text>
      </LinearGradient>
    </View>
  );
}

function SettingItem({ icon, label, onPress }: { 
  icon: string; 
  label: string; 
  onPress: () => void;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed,
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Text style={styles.settingArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orbContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  orb1: {
    width: 400,
    height: 400,
    backgroundColor: Colors.primary,
    top: -200,
    right: -100,
  },
  orb2: {
    width: 300,
    height: 300,
    backgroundColor: Colors.secondary,
    bottom: -150,
    left: -100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  headerSection: {
    marginBottom: Spacing.lg,
  },
  headerGradient: {
    paddingTop: 80,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xl + 8,
    borderBottomRightRadius: BorderRadius.xl + 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatarGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    top: -5,
    left: -5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarEmoji: {
    fontSize: 56,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  levelGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.background,
  },
  displayName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.md,
  },
  roleBadge: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  reputationContainer: {
    width: '80%',
    marginTop: Spacing.lg,
  },
  reputationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  reputationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  reputationValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  reputationBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  reputationBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  balanceBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  balanceCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '48%',
  },
  statCardPressed: {
    transform: [{ scale: 0.95 }],
  },
  statBlur: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  statGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.lg,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  earningsBlur: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  earningsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  earningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  earningLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  earningValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  earningDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: Spacing.sm,
  },
  netProfitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  netProfitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  netProfitIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  netProfitLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  netProfitRight: {},
  netProfitBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  netProfitValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  badgesScroll: {
    paddingRight: Spacing.lg,
    gap: Spacing.md,
  },
  achievementBadge: {
    width: 140,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  achievementEmojiLocked: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  achievementTextLocked: {
    color: Colors.textMuted,
  },
  settingsCard: {
    backgroundColor: 'rgba(30, 33, 57, 0.6)',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 128, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 28,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: Spacing.md + 40 + Spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  footerDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    marginVertical: Spacing.md,
  },
  footerSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});


// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Pressable,
//   Alert,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';
// import { useAuth } from '../../contexts/AuthContext';
// import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
// import { Challenge} from '../../types/challenges';
// import { Transaction } from '../../types/transaction';
// import { ChallengeService } from '../../services/firebase/challenge.service';
// import { TokenService } from '../../services/firebase/token.service';
// import DCoinBalance from '../../components/token/DcoinBalance';
// import Button from '../../components/common/Button';
// import * as Haptics from 'expo-haptics';
// import { formatDistanceToNow } from 'date-fns';

// const { width } = Dimensions.get('window');

// export default function ProfileScreen() {
//   const { user, signOut, refreshUser } = useAuth();
//   const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTab, setSelectedTab] = useState<'created' | 'completed' | 'transactions'>('created');
//   const [scrollY] = useState(new Animated.Value(0));

//   useEffect(() => {
//     loadData();
//   }, [user]);

//   const loadData = async () => {
//     if (!user) return;
    
//     try {
//       setLoading(true);
//       const [challengesData, transactionsData] = await Promise.all([
//         ChallengeService.getChallengesByCreator(user.id, 10),
//         TokenService.getTransactionHistory(user.id, 10),
//       ]);
      
//       setMyChallenges(challengesData);
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error loading profile data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignOut = () => {
//     Alert.alert(
//       'Sign Out',
//       'Are you sure you want to sign out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Sign Out', 
//           style: 'destructive', 
//           onPress: async () => {
//             await signOut();
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//           }
//         },
//       ]
//     );
//   };

//   if (!user) return null;

//   const netProfit = user.dcoinsLifeTimeEarned - user.dcoinsLifeTimeEarned;
//   const successRate = user.challengesCompleted > 0 
//     ? Math.round((user.challengesCompleted / (user.challengesCompleted + user.challengesCreated)) * 100)
//     : 0;

//   // Header parallax effect
//   const headerScale = scrollY.interpolate({
//     inputRange: [-100, 0],
//     outputRange: [1.3, 1],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       {/* Animated Header with Gradient */}
//       <Animated.View style={[styles.headerContainer, { transform: [{ scale: headerScale }] }]}>
//         <LinearGradient
//           colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
//           style={styles.headerGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           {/* Floating Circles */}
//           <View style={styles.floatingCircle1} />
//           <View style={styles.floatingCircle2} />
//           <View style={styles.floatingCircle3} />

//           {/* Sign Out Button (Top Right) */}
//           <Pressable onPress={handleSignOut} style={styles.signOutHeaderButton}>
//             <BlurView intensity={40} style={styles.signOutBlur}>
//               <Text style={styles.signOutIcon}>🚪</Text>
//             </BlurView>
//           </Pressable>

//           <View style={styles.headerContent}>
//             {/* Avatar */}
//             <View style={styles.avatarContainer}>
//               <LinearGradient
//                 colors={['#FFD700', '#FFA500', '#FF6347']}
//                 style={styles.avatarGradient}
//               >
//                 <Text style={styles.avatarEmoji}>
//                   {user.role === 'doer' ? '🎯' : user.role === 'challenger' ? '🎨' : '⚡'}
//                 </Text>
//               </LinearGradient>
              
//               {/* Reputation Ring */}
//               <View style={styles.reputationRing}>
//                 <Text style={styles.reputationText}>{user.reputation}</Text>
//               </View>
//             </View>

//             {/* User Info */}
//             <Text style={styles.displayName}>{user.displayName}</Text>
//             <Text style={styles.email}>{user.email}</Text>

//             {/* Role Badge */}
//             <BlurView intensity={40} style={styles.roleBadge}>
//               <Text style={styles.roleBadgeText}>
//                 {user.role === 'both' ? '⚡ Creator & Doer' : user.role === 'doer' ? '🎯 Challenge Doer' : '🎨 Challenge Creator'}
//               </Text>
//             </BlurView>
//           </View>
//         </LinearGradient>
//       </Animated.View>

//       <Animated.ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}
//       >
//         {/* DCoin Balance Card */}
//         <View style={styles.balanceContainer}>
//           <BlurView intensity={60} style={styles.balanceBlur}>
//             <LinearGradient
//               colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
//               style={styles.balanceGradient}
//             >
//               <DCoinBalance balance={user.dcoins} size="large" />
//             </LinearGradient>
//           </BlurView>
//         </View>

//         {/* Stats Grid */}
//         <View style={styles.statsGrid}>
//           <StatCard
//             icon="🎯"
//             value={user.challengesCompleted}
//             label="Completed"
//             gradient={['#00FF88', '#00CC6A']}
//           />
//           <StatCard
//             icon="🎨"
//             value={user.challengesCreated}
//             label="Created"
//             gradient={['#0080FF', '#0066CC']}
//           />
//           <StatCard
//             icon="⭐"
//             value={user.reputation}
//             label="Reputation"
//             gradient={['#FFD700', '#FFA500']}
//           />
//           <StatCard
//             icon="📈"
//             value={successRate}
//             label="Success Rate"
//             suffix="%"
//             gradient={['#A020F0', '#8A2BE2']}
//           />
//         </View>

//         {/* Earnings Summary */}
//         <View style={styles.earningsSection}>
//           <Text style={styles.sectionTitle}>💰 Earnings Overview</Text>
          
//           <BlurView intensity={40} style={styles.earningsCard}>
//             <LinearGradient
//               colors={['rgba(0, 255, 136, 0.1)', 'rgba(0, 204, 106, 0.1)']}
//               style={styles.earningsGradient}
//             >
//               <EarningRow
//                 label="Lifetime Earned"
//                 value={user.dcoinsLifeTimeEarned}
//                 icon="💰"
//                 color={Colors.success}
//               />
//               <View style={styles.divider} />
//               <EarningRow
//                 label="Lifetime Spent"
//                 value={user.dcoinsLifeTimeEarned}
//                 icon="💸"
//                 color={Colors.danger}
//               />
//               <View style={styles.divider} />
//               <EarningRow
//                 label="Net Profit"
//                 value={netProfit}
//                 icon="📊"
//                 color={netProfit >= 0 ? Colors.success : Colors.danger}
//                 highlight
//               />
//             </LinearGradient>
//           </BlurView>
//         </View>

//         {/* Tab Navigation */}
//         <View style={styles.tabContainer}>
//           {['created', 'completed', 'transactions'].map((tab) => (
//             <Pressable
//               key={tab}
//               onPress={() => {
//                 setSelectedTab(tab as any);
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               }}
//             >
//               {selectedTab === tab ? (
//                 <LinearGradient
//                   colors={['#667eea', '#764ba2']}
//                   style={styles.tabActive}
//                 >
//                   <Text style={styles.tabTextActive}>
//                     {tab === 'created' ? '🎨 Created' : tab === 'completed' ? '🎯 Completed' : '💳 Transactions'}
//                   </Text>
//                 </LinearGradient>
//               ) : (
//                 <View style={styles.tab}>
//                   <Text style={styles.tabText}>
//                     {tab === 'created' ? '🎨 Created' : tab === 'completed' ? '🎯 Completed' : '💳 Transactions'}
//                   </Text>
//                 </View>
//               )}
//             </Pressable>
//           ))}
//         </View>

//         {/* Tab Content */}
//         <View style={styles.tabContent}>
//           {selectedTab === 'created' && (
//             <View>
//               {myChallenges.length === 0 ? (
//                 <EmptyState
//                   icon="🎨"
//                   title="No Challenges Created"
//                   description="Create your first challenge and watch others complete it!"
//                 />
//               ) : (
//                 myChallenges.map((challenge) => (
//                   <ChallengeItem key={challenge.id} challenge={challenge} />
//                 ))
//               )}
//             </View>
//           )}

//           {selectedTab === 'completed' && (
//             <EmptyState
//               icon="🎯"
//               title="No Challenges Completed"
//               description="Accept a challenge and become a doer!"
//             />
//           )}

//           {selectedTab === 'transactions' && (
//             <View>
//               {transactions.length === 0 ? (
//                 <EmptyState
//                   icon="💳"
//                   title="No Transactions"
//                   description="Your transaction history will appear here"
//                 />
//               ) : (
//                 transactions.map((transaction) => (
//                   <TransactionItem key={transaction.id} transaction={transaction} />
//                 ))
//               )}
//             </View>
//           )}
//         </View>

//         {/* Settings Section */}
//         <View style={styles.settingsSection}>
//           <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          
//           <BlurView intensity={40} style={styles.settingsCard}>
//             <SettingItem
//               icon="👤"
//               label="Edit Profile"
//               onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon!')}
//             />
//             <View style={styles.divider} />
//             <SettingItem
//               icon="🔔"
//               label="Notifications"
//               onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
//             />
//             <View style={styles.divider} />
//             <SettingItem
//               icon="🛡️"
//               label="Privacy & Security"
//               onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
//             />
//             <View style={styles.divider} />
//             <SettingItem
//               icon="❓"
//               label="Help & Support"
//               onPress={() => Alert.alert('Coming Soon', 'Help center coming soon!')}
//             />
//           </BlurView>
//         </View>

//         {/* Sign Out Button */}
//         <View style={styles.signOutSection}>
//           <Button
//             title="Sign Out"
//             onPress={handleSignOut}
//             variant="danger"
//             icon="🚪"
//             fullWidth
//           />
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>DARE v1.0.0</Text>
//           <Text style={styles.footerText}>Challenge Accepted, Safely 🎯</Text>
//         </View>
//       </Animated.ScrollView>
//     </View>
//   );
// }

// // Stat Card Component
// function StatCard({ 
//   icon, 
//   value, 
//   label, 
//   suffix = '', 
//   gradient 
// }: { 
//   icon: string; 
//   value: number; 
//   label: string; 
//   suffix?: string;
//   gradient: string[];
// }) {
//   return (
//     <BlurView intensity={40} style={styles.statCardContainer}>
//       <LinearGradient
//         colors={[...gradient.map(c => c + '20')]}
//         style={styles.statCardGradient}
//       >
//         <Text style={styles.statCardIcon}>{icon}</Text>
//         <Text style={[styles.statCardValue, { color: gradient[0] }]}>
//           {value}{suffix}
//         </Text>
//         <Text style={styles.statCardLabel}>{label}</Text>
//       </LinearGradient>
//     </BlurView>
//   );
// }

// // Earning Row Component
// function EarningRow({ 
//   label, 
//   value, 
//   icon, 
//   color, 
//   highlight = false 
// }: { 
//   label: string; 
//   value: number; 
//   icon: string; 
//   color: string;
//   highlight?: boolean;
// }) {
//   return (
//     <View style={[styles.earningRow, highlight && styles.earningRowHighlight]}>
//       <View style={styles.earningLeft}>
//         <Text style={styles.earningIcon}>{icon}</Text>
//         <Text style={[styles.earningLabel, highlight && styles.earningLabelHighlight]}>
//           {label}
//         </Text>
//       </View>
//       <Text style={[styles.earningValue, { color }, highlight && styles.earningValueHighlight]}>
//         {value >= 0 ? '+' : ''}{value.toLocaleString()} DC
//       </Text>
//     </View>
//   );
// }

// // Challenge Item Component
// function ChallengeItem({ challenge }: { challenge: Challenge }) {
//   return (
//     <BlurView intensity={40} style={styles.challengeItem}>
//       <View style={styles.challengeItemContent}>
//         <View style={styles.challengeItemHeader}>
//           <Text style={styles.challengeItemTitle} numberOfLines={1}>
//             {challenge.title}
//           </Text>
//           <View style={[styles.challengeItemStatus, { 
//             backgroundColor: challenge.status === 'active' ? Colors.success + '30' : Colors.textMuted + '30'
//           }]}>
//             <Text style={styles.challengeItemStatusText}>
//               {challenge.status}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.challengeItemFooter}>
//           <Text style={styles.challengeItemStat}>🪙 {challenge.prizePool} DC</Text>
//           <Text style={styles.challengeItemStat}>👁️ {challenge.views}</Text>
//           <Text style={styles.challengeItemStat}>🎯 {challenge.completions}</Text>
//         </View>
//       </View>
//     </BlurView>
//   );
// }

// // Transaction Item Component
// function TransactionItem({ transaction }: { transaction: Transaction }) {
//   const getIcon = () => {
//     switch (transaction.type) {
//       case 'purchase': return '💳';
//       case 'challenge_stake': return '🎨';
//       case 'prize_won': return '🏆';
//       case 'bonus': return '🎁';
//       default: return '💰';
//     }
//   };

//   const isPositive = transaction.amount > 0;

//   return (
//     <BlurView intensity={40} style={styles.transactionItem}>
//       <View style={styles.transactionIcon}>
//         <Text style={styles.transactionEmoji}>{getIcon()}</Text>
//       </View>
//       <View style={styles.transactionContent}>
//         <Text style={styles.transactionDescription} numberOfLines={1}>
//           {transaction.description}
//         </Text>
//         <Text style={styles.transactionTime}>
//           {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
//         </Text>
//       </View>
//       <Text style={[
//         styles.transactionAmount,
//         { color: isPositive ? Colors.success : Colors.danger }
//       ]}>
//         {isPositive ? '+' : ''}{transaction.amount} DC
//       </Text>
//     </BlurView>
//   );
// }

// // Setting Item Component
// function SettingItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
//   return (
//     <Pressable style={styles.settingItem} onPress={onPress}>
//       <View style={styles.settingLeft}>
//         <Text style={styles.settingIcon}>{icon}</Text>
//         <Text style={styles.settingLabel}>{label}</Text>
//       </View>
//       <Text style={styles.settingArrow}>›</Text>
//     </Pressable>
//   );
// }

// // Empty State Component
// function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
//   return (
//     <BlurView intensity={40} style={styles.emptyState}>
//       <LinearGradient
//         colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
//         style={styles.emptyGradient}
//       >
//         <Text style={styles.emptyIcon}>{icon}</Text>
//         <Text style={styles.emptyTitle}>{title}</Text>
//         <Text style={styles.emptyDescription}>{description}</Text>
//       </LinearGradient>
//     </BlurView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   signOutHeaderButton: {
//     position: 'absolute',
//     top: Spacing.md,
//     right: Spacing.md,
//     zIndex: 10,
//   },
//   headerContainer: {
//     height: 320,
//     overflow: 'hidden',
//   },
//   headerGradient: {
//     flex: 1,
//     position: 'relative',
//   },
//   floatingCircle1: {
//     position: 'absolute',
//     width: 250,
//     height: 250,
//     borderRadius: 125,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     top: -100,
//     right: -80,
//   },
//   floatingCircle2: {
//     position: 'absolute',
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     bottom: -60,
//     left: -50,
//   },
//   floatingCircle3: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.06)',
//     top: 100,
//     left: width * 0.7,
//   },
//   headerContent: {
//     flex: 1,
//     paddingTop: 70,
//     alignItems: 'center',
//     paddingHorizontal: Spacing.lg,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: Spacing.md,
//   },
//   avatarGradient: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   avatarEmoji: {
//     fontSize: 48,
//   },
//   reputationRing: {
//     position: 'absolute',
//     bottom: -8,
//     right: -8,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: Colors.accent,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 3,
//     borderColor: '#667eea',
//   },
//   reputationText: {
//     fontSize: 14,
//     fontWeight: '800',
//     color: Colors.background,
//   },
//   displayName: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: 4,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   email: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.7)',
//     marginBottom: Spacing.md,
//   },
//   roleBadge: {
//     paddingHorizontal: Spacing.md + 4,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.full,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   roleBadgeText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   content: {
//     flex: 1,
//     marginTop: -60,
//   },
//   balanceContainer: {
//     marginHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//     borderRadius: BorderRadius.xl,
//     overflow: 'hidden',
//   },
//   balanceBlur: {
//     borderRadius: BorderRadius.xl,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   balanceGradient: {
//     padding: Spacing.md,
//     borderRadius: BorderRadius.xl,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: Spacing.lg,
//     gap: Spacing.md,
//     marginBottom: Spacing.lg,
//   },
//   statCardContainer: {
//     width: (width - Spacing.lg * 2 - Spacing.md) / 2,
//     borderRadius: BorderRadius.lg,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   statCardGradient: {
//     padding: Spacing.md,
//     alignItems: 'center',
//   },
//   statCardIcon: {
//     fontSize: 32,
//     marginBottom: Spacing.xs,
//   },
//   statCardValue: {
//     fontSize: 28,
//     fontWeight: '800',
//     marginBottom: 4,
//   },
//   statCardLabel: {
//     fontSize: 11,
//     color: Colors.textSecondary,
//     fontWeight: '600',
//     textTransform: 'uppercase',
//   },
//   earningsSection: {
//     paddingHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   earningsCard: {
//     borderRadius: BorderRadius.lg,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   earningsGradient: {
//     padding: Spacing.lg,
//   },
//   earningRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//   },
//   earningRowHighlight: {
//     paddingVertical: Spacing.md,
//   },
//   earningLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   earningIcon: {
//     fontSize: 20,
//     marginRight: Spacing.md,
//   },
//   earningLabel: {
//     fontSize: 15,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   earningLabelHighlight: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   earningValue: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   earningValueHighlight: {
//     fontSize: 20,
//     fontWeight: '800',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     marginVertical: Spacing.xs,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: Spacing.lg,
//     gap: Spacing.sm,
//     marginBottom: Spacing.lg,
//   },
//   tab: {
//     paddingHorizontal: Spacing.md + 4,
//     paddingVertical: Spacing.sm + 2,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   tabActive: {
//     paddingHorizontal: Spacing.md + 4,
//     paddingVertical: Spacing.sm + 2,
//     borderRadius: BorderRadius.full,
//   },
//   tabText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//   },
//   tabTextActive: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   tabContent: {
//     paddingHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   challengeItem: {
//     borderRadius: BorderRadius.md,
//     overflow: 'hidden',
//     marginBottom: Spacing.md,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   challengeItemContent: {
//     padding: Spacing.md,
//   },
//   challengeItemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: Spacing.sm,
//   },
//   challengeItemTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '700',
//     color: Colors.text,
//     marginRight: Spacing.md,
//   },
//   challengeItemStatus: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 4,
//     borderRadius: BorderRadius.sm,
//   },
//   challengeItemStatusText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: Colors.text,
//     textTransform: 'uppercase',
//   },
//   challengeItemFooter: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   challengeItemStat: {
//     fontSize: 13,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: Spacing.md,
//     borderRadius: BorderRadius.md,
//     marginBottom: Spacing.md,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   transactionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.surface,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: Spacing.md,
//   },
//   transactionEmoji: {
//     fontSize: 20,
//   },
//   transactionContent: {
//     flex: 1,
//   },
//   transactionDescription: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   transactionTime: {
//     fontSize: 12,
//     color: Colors.textMuted,
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   settingsSection: {
//     paddingHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   settingsCard: {
//     borderRadius: BorderRadius.lg,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   settingItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: Spacing.md,
//   },
//   settingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   settingIcon: {
//     fontSize: 20,
//     marginRight: Spacing.md,
//   },
//   settingLabel: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   settingArrow: {
//     fontSize: 24,
//     color: Colors.textMuted,
//   },
//   emptyState: {
//     borderRadius: BorderRadius.lg,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   emptyGradient: {
//     padding: Spacing.xxl,
//     alignItems: 'center',
//   },
//   emptyIcon: {
//     fontSize: 64,
//     marginBottom: Spacing.md,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   emptyDescription: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//   },
//   signOutSection: {
//     paddingHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xl,
//   },
//   footerText: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginBottom: 4,
//   },
//   signOutBlur: {
//     borderRadius: BorderRadius.full,
//     padding: Spacing.sm,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
// });