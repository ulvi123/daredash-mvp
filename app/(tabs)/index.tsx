import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Challenge, ChallengeCategory } from '../../types/challenges';
import { ChallengeService } from '../../services/firebase/challenge.service';
import DCoinBalance from '../../components/token/DcoinBalance';
import ChallengeCard from '../../components/challenge/ChallengeCard';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function FeedScreen() {
  const { user } = useAuth();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [scrollY] = useState(new Animated.Value(0));

  const categories: { value: ChallengeCategory | 'all'; emoji: string; label: string; gradient: string[] }[] = [
    { value: 'all', emoji: '✨', label: 'All', gradient: ['#667eea', '#764ba2'] },
    { value: 'creative', emoji: '🎨', label: 'Creative', gradient: ['#A020F0', '#E100FF'] },
    { value: 'social', emoji: '🤝', label: 'Social', gradient: ['#0080FF', '#00C9FF'] },
    { value: 'fitness', emoji: '💪', label: 'Fitness', gradient: ['#00FF88', '#00D9A0'] },
    { value: 'skill', emoji: '🎯', label: 'Skill', gradient: ['#FFD700', '#FFA500'] },
    { value: 'adventure', emoji: '🏔️', label: 'Adventure', gradient: ['#FF4444', '#FF6B6B'] },
    { value: 'random', emoji: '🎲', label: 'Random', gradient: ['#FFA500', '#FF6347'] },
  ];

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const filter = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await ChallengeService.getActiveChallenges(filter, 20);
      setChallenges(data);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  useEffect(() => {
    loadChallenges();
  }, [selectedCategory]);

  // Animated header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Gradients */}
      <LinearGradient
        colors={['#0A0E27', '#1a1f3a', '#0A0E27']}
        style={styles.backgroundGradient}
      />
      
      {/* Floating orbs for depth */}
      <View style={styles.orbContainer}>
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        <View style={[styles.orb, styles.orb3]} />
      </View>

      {/* Header with glassmorphism */}
      <Animated.View style={[styles.headerWrapper, { opacity: headerOpacity, transform: [{ scale: headerScale }] }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <LinearGradient
            colors={['rgba(30, 33, 57, 0.8)', 'rgba(30, 33, 57, 0.4)']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.greetingSection}>
                <Text style={styles.greeting}>
                  Hey, <Text style={styles.userName}>{user?.displayName}</Text>! 👋
                </Text>
                <Text style={styles.subgreeting}>Ready to earn some DCoins?</Text>
              </View>
              
              {user && (
                <View style={styles.balanceWrapper}>
                  <DCoinBalance balance={user.dcoins} size="small" />
                </View>
              )}
            </View>

            {/* Quick Stats Bar */}
            {user && (
              <View style={styles.quickStats}>
                <QuickStat icon="🎯" value={user.challengesCompleted} label="Done" color={Colors.success} />
                <QuickStat icon="🎨" value={user.challengesCreated} label="Created" color={Colors.primary} />
                <QuickStat icon="⭐" value={user.reputation} label="Rep" color={Colors.accent} />
                <QuickStat icon="🔥" value="7" label="Streak" color={Colors.danger} />
              </View>
            )}
          </LinearGradient>
        </BlurView>
      </Animated.View>

      {/* Category Filter with glassmorphism */}
      <BlurView intensity={60} tint="dark" style={styles.categoryBlur}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat.value}
              onPress={() => {
                setSelectedCategory(cat.value);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              {selectedCategory === cat.value ? (
                <LinearGradient
                  colors={cat.gradient as [string, string]}
                  style={styles.categoryChipActive}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={styles.categoryLabelActive}>{cat.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryEmojiInactive}>{cat.emoji}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </BlurView>

      {/* Challenges List */}
      <Animated.ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Finding amazing challenges...</Text>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!loading && challenges.length === 0 && (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['rgba(0, 128, 255, 0.1)', 'rgba(160, 32, 240, 0.1)']}
              style={styles.emptyCard}
            >
              <Text style={styles.emptyEmoji}>🎯</Text>
              <Text style={styles.emptyTitle}>No challenges yet</Text>
              <Text style={styles.emptyDescription}>
                {selectedCategory === 'all' 
                  ? 'Be the first to create a challenge!'
                  : `No ${selectedCategory} challenges available right now.`}
              </Text>
              <View style={styles.emptyDivider} />
              <Text style={styles.emptyHint}>💡 Try a different category or create one!</Text>
            </LinearGradient>
          </View>
        )}

        {/* Challenge Cards with stagger animation */}
        {!loading && challenges.map((challenge, index) => (
          <Animated.View
            key={challenge.id}
            style={{
              opacity: scrollY.interpolate({
                inputRange: [-1, 0, index * 100, (index + 2) * 100],
                outputRange: [1, 1, 1, 0],
              }),
            }}
          >
            <ChallengeCard challenge={challenge} />
          </Animated.View>
        ))}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
}

function QuickStat({ icon, value, label, color }: { icon: string; value: number | string; label: string; color: string }) {
  return (
    <View style={styles.quickStatItem}>
      <Text style={styles.quickStatIcon}>{icon}</Text>
      <Text style={[styles.quickStatValue, { color }]}>{value}</Text>
      <Text style={styles.quickStatLabel}>{label}</Text>
    </View>
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
    width: 300,
    height: 300,
    backgroundColor: Colors.primary,
    top: -100,
    right: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: Colors.secondary,
    bottom: 100,
    left: -50,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: Colors.success,
    top: 200,
    left: width / 2,
  },
  headerWrapper: {
    paddingTop: 50,
    zIndex: 10,
  },
  headerBlur: {
    overflow: 'hidden',
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerGradient: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  userName: {
    color: Colors.primary,
  },
  subgreeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  balanceWrapper: {
    marginTop: -4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  categoryBlur: {
    marginTop: -Spacing.md,
    zIndex: 9,
  },
  categoryScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: 'rgba(30, 33, 57, 0.6)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.xs,
  },
  categoryChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryEmojiInactive: {
    fontSize: 16,
    opacity: 0.7,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  loadingContainer: {
    paddingVertical: Spacing.xxl,
  },
  loadingCard: {
    backgroundColor: 'rgba(30, 33, 57, 0.6)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontWeight: '500',
  },
  emptyState: {
    marginTop: Spacing.xxl,
  },
  emptyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  emptyDivider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginVertical: Spacing.md,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: Spacing.xxl + 40,
  },
});