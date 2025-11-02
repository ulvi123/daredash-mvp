import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Challenge } from '../../types/challenges';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { formatDistanceToNow } from 'date-fns';
import * as Haptics from 'expo-haptics';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const router = useRouter();

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      creative: Colors.secondary,
      social: Colors.primary,
      fitness: Colors.success,
      skill: Colors.accent,
      adventure: Colors.danger,
      random: Colors.warning,
      business: '#00CED1',
    };
    return colors[category] || Colors.primary;
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/challenge/${challenge.id}`);
  };

  const timeAgo = formatDistanceToNow(challenge.createdAt, { addSuffix: true });
  const timeRemaining = formatDistanceToNow(challenge.expiresAt, { addSuffix: false });

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={['rgba(30, 33, 57, 0.8)', 'rgba(30, 33, 57, 0.6)']}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(challenge.category) + '20' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(challenge.category) }]}>
              {challenge.category}
            </Text>
          </View>
          
          <View style={styles.difficultyContainer}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={styles.star}>
                {i < challenge.difficulty ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {challenge.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>

        {/* Creator */}
        <View style={styles.creatorRow}>
          <View style={styles.creatorAvatar}>
            <Text style={styles.creatorAvatarText}>
              {challenge.creatorName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.creatorName}>{challenge.creatorName}</Text>
          <Text style={styles.timeAgo}>• {timeAgo}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.prizeContainer}>
            <Text style={styles.prizeLabel}>Prize</Text>
            <View style={styles.prizeAmount}>
              <Text style={styles.prizeEmoji}>🪙</Text>
              <Text style={styles.prizeValue}>{challenge.prizePool}</Text>
              <Text style={styles.prizeCurrency}>DC</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statValue}>{challenge.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{challenge.completions}</Text>
            </View>
          </View>
        </View>

        {/* Time Remaining Badge */}
        <View style={styles.timeRemainingBadge}>
          <Text style={styles.timeRemainingText}>⏱️ {timeRemaining} left</Text>
        </View>

        {/* Risk Score Indicator (if high) */}
        {challenge.riskScore > 30 && (
          <View style={[styles.riskBadge, { 
            backgroundColor: challenge.riskScore > 60 ? Colors.danger : Colors.warning 
          }]}>
            <Text style={styles.riskBadgeText}>
              {challenge.riskScore > 60 ? '⚠️ High Risk' : '⚠️ Moderate'}
            </Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 12,
    marginLeft: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  creatorAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeContainer: {
    flex: 1,
  },
  prizeLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  prizeAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  prizeValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.success,
  },
  prizeCurrency: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeRemainingBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  timeRemainingText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '600',
  },
  riskBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  riskBadgeText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '700',
  },
});