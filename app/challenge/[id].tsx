import { format, formatDistanceToNow } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ChallengeService } from '../../services/firebase/challenge.service';
import { Challenge } from '../../types/challenges';
import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await ChallengeService.getChallengeById(id);
      setChallenge(data);

      // Increment view count
      if (data) {
        await ChallengeService.incrementViews(id);
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
      Alert.alert('Error', 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = async () => {
    if (!challenge || !user) return;

    if (challenge.creatorId === user.id) {
      Alert.alert('Oops!', 'You cannot accept your own challenge');
      return;
    }

    Alert.alert(
      'Accept Challenge?',
      `You're about to accept this challenge. You'll have 24 hours to complete it and submit proof.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              setAccepting(true);
              await ChallengeService.acceptChallenge(challenge.id, user.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                'Challenge Accepted! 🎯',
                'Good luck! Submit your proof when ready.',
                [{ 
                  text: 'OK', 
                  onPress: () => router.push({
                    pathname: '/complete/[id]',
                    params: { id: challenge.id }
                  } as any)
                }]
              );
            } catch (error: any) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Error', error.message || 'Failed to accept challenge');
            } finally {
              setAccepting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading challenge...</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Challenge Not Found</Text>
        <Text style={styles.errorDescription}>
          This challenge may have been removed or expired.
        </Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      creative: Colors.secondary,
      social: Colors.primary,
      fitness: Colors.success,
      skill: Colors.accent,
      adventure: Colors.danger,
      random: Colors.warning,
    };
    return colors[category] || Colors.primary;
  };

  const isCreator = user?.id === challenge.creatorId;
  const isExpired = new Date(challenge.expiresAt) < new Date();
  const canAccept = challenge.status === 'active' && !isCreator && !isExpired;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[getCategoryColor(challenge.category), Colors.background]}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.headerBadges}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(challenge.category) }]}>
            <Text style={styles.categoryText}>{challenge.category}</Text>
          </View>

          {challenge.riskScore > 30 && (
            <View style={[
              styles.riskBadge,
              { backgroundColor: challenge.riskScore > 60 ? Colors.danger : Colors.warning }
            ]}>
              <Text style={styles.riskBadgeText}>
                {challenge.riskScore > 60 ? 'High Risk' : 'Moderate'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title & Difficulty */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{challenge.title}</Text>
          <View style={styles.difficultyRow}>
            <Text style={styles.difficultyLabel}>Difficulty:</Text>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={styles.star}>
                {i < challenge.difficulty ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Description</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        {/* Prize Pool */}
        <View style={styles.prizeSection}>
          <LinearGradient
            colors={['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.05)']}
            style={styles.prizeCard}
          >
            <Text style={styles.prizeLabel}>Prize Pool</Text>
            <View style={styles.prizeAmountRow}>
              <Text style={styles.prizeEmoji}>🪙</Text>
              <Text style={styles.prizeAmount}>{challenge.prizePool}</Text>
              <Text style={styles.prizeCurrency}>DCoins</Text>
            </View>
            <Text style={styles.prizeUSD}>
              ≈ ${(challenge.prizePool * 0.01).toFixed(2)} USD
            </Text>
          </LinearGradient>
        </View>

        {/* Challenge Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Info</Text>
          <View style={styles.infoGrid}>
            <InfoItem
              icon="👤"
              label="Creator"
              value={challenge.creatorName}
            />
            <InfoItem
              icon="⏱️"
              label="Expires"
              value={formatDistanceToNow(challenge.expiresAt, { addSuffix: true })}
            />
            <InfoItem
              icon="👁️"
              label="Views"
              value={challenge.views.toString()}
            />
            <InfoItem
              icon="🎯"
              label="Completions"
              value={challenge.completions.toString()}
            />
            <InfoItem
              icon="📅"
              label="Created"
              value={format(challenge.createdAt, 'MMM d, yyyy')}
            />
            <InfoItem
              icon="🏆"
              label="Model"
              value={challenge.prizeModel.replace('_', ' ')}
            />
          </View>
        </View>

        {/* AI Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Analysis</Text>
          <View style={styles.aiAnalysisCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiEmoji}>
                {challenge.aiAnalysis.approved ? '✅' : '⚠️'}
              </Text>
              <View style={styles.aiHeaderText}>
                <Text style={styles.aiTitle}>
                  {challenge.aiAnalysis.approved ? 'AI Approved' : 'Flagged by AI'}
                </Text>
                <Text style={styles.aiSubtitle}>
                  Risk Score: {challenge.riskScore}/100
                </Text>
              </View>
            </View>

            {/* Risk Breakdown */}
            <View style={styles.riskBreakdown}>
              <RiskBar
                label="Physical Safety"
                score={challenge.aiAnalysis.physicalSafetyScore}
              />
              <RiskBar
                label="Legal Compliance"
                score={challenge.aiAnalysis.legalComplianceScore}
              />
              <RiskBar
                label="Social Appropriate"
                score={challenge.aiAnalysis.socialAppropriatenessScore}
              />
              <RiskBar
                label="Privacy"
                score={challenge.aiAnalysis.privacyConcernsScore}
              />
            </View>

            {challenge.aiAnalysis.flags.length > 0 && (
              <View style={styles.flagsSection}>
                <Text style={styles.flagsTitle}>Flags:</Text>
                {challenge.aiAnalysis.flags.map((flag, index) => (
                  <View key={index} style={styles.flagItem}>
                    <Text style={styles.flagEmoji}>
                      {flag.type === 'danger' ? '🚨' : flag.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </Text>
                    <Text style={styles.flagText}>{flag.message}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Status Badge */}
        {challenge.status !== 'active' && (
          <View style={styles.statusBanner}>
            <Text style={styles.statusText}>
              Status: {challenge.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      {canAccept && (
        <View style={styles.bottomBar}>
          <LinearGradient
            colors={[Colors.background, 'rgba(10, 14, 39, 0.95)']}
            style={styles.bottomBarGradient}
          >
            <View style={styles.bottomBarContent}>
              <View style={styles.bottomBarInfo}>
                <Text style={styles.bottomBarLabel}>You will Win</Text>
                <Text style={styles.bottomBarValue}>{challenge.prizePool} DC</Text>
              </View>
              <Button
                title="Accept Challenge"
                onPress={handleAcceptChallenge}
                loading={accepting}
                icon="🎯"
                style={styles.acceptButton}
              />
            </View>
          </LinearGradient>
        </View>
      )}

      {isCreator && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarContent}>
            <Text style={styles.creatorText}>This is your challenge</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function RiskBar({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score <= 30) return Colors.success;
    if (score <= 60) return Colors.warning;
    return Colors.danger;
  };

  return (
    <View style={styles.riskBarContainer}>
      <Text style={styles.riskBarLabel}>{label}</Text>
      <View style={styles.riskBarTrack}>
        <View
          style={[
            styles.riskBarFill,
            { width: `${score}%`, backgroundColor: getColor(score) },
          ]}
        />
      </View>
      <Text style={styles.riskBarValue}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
  },
  riskBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 36,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  prizeSection: {
    padding: Spacing.lg,
  },
  prizeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  prizeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  prizeAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  prizeEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  prizeAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.success,
  },
  prizeCurrency: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  prizeUSD: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoItem: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  aiAnalysisCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  aiEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  aiHeaderText: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  riskBreakdown: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  riskBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  riskBarLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 100,
  },
  riskBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  riskBarValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    width: 30,
    textAlign: 'right',
  },
  flagsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  flagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  flagText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  statusBanner: {
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.warning + '20',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarGradient: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  bottomBarValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.success,
  },
  acceptButton: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  creatorText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});