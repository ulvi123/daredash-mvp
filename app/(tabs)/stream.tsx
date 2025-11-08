import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Challenge } from '../../types/challenges';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Collections } from '../../services/firebase/collections';
import Button from '../../components/common/Button';
import { useRouter } from 'expo-router';

export default function StreamScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [acceptedChallenges, setAcceptedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAcceptedChallenges();
  }, [user]);

  const loadAcceptedChallenges = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get challenges accepted by current user
      const q = query(
        collection(db, Collections.CHALLENGES),
        where('acceptedBy', '==', user.id),
        where('status', '==', 'in_progress')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
        acceptedAt: doc.data().acceptedAt?.toDate(),
        aiAnalysis: {
          ...doc.data().aiAnalysis,
          analysisTimestamp: doc.data().aiAnalysis?.analysisTimestamp?.toDate() || new Date(),
        },
      })) as Challenge[];

      setAcceptedChallenges(data);
    } catch (error) {
      console.error('Error loading accepted challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your Challenges</Text>
        <Text style={styles.headerSubtitle}>
          Complete and submit proof to earn rewards
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Loading your challenges...</Text>
          </View>
        ) : acceptedChallenges.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>No Active Challenges</Text>
            <Text style={styles.emptyDescription}>
              Accept a challenge from the Feed to get started!
            </Text>
            <Button
              title="Browse Challenges"
              onPress={() => router.push('/')}
              icon="🏠"
              style={styles.browseButton}
            />
          </View>
        ) : (
          <>
            {acceptedChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeCard}>
                <LinearGradient
                  colors={['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.1)']}
                  style={styles.cardGradient}
                >
                  {/* Challenge Info */}
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeDescription} numberOfLines={2}>
                    {challenge.description}
                  </Text>

                  {/* Prize */}
                  <View style={styles.prizeRow}>
                    <Text style={styles.prizeLabel}>Prize:</Text>
                    <View style={styles.prizeAmount}>
                      <Text style={styles.prizeEmoji}>🪙</Text>
                      <Text style={styles.prizeValue}>{challenge.prizePool}</Text>
                      <Text style={styles.prizeCurrency}>DC</Text>
                    </View>
                  </View>

                  {/* Difficulty */}
                  <View style={styles.difficultyRow}>
                    <Text style={styles.difficultyLabel}>Difficulty:</Text>
                    <View style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i} style={styles.star}>
                          {i < challenge.difficulty ? '⭐' : '☆'}
                        </Text>
                      ))}
                    </View>
                  </View>

                  {/* Action Button */}
                  <Button
                    title="Complete Challenge"
                    onPress={() => router.push({
                      pathname: '/complete/[id]',
                      params: { id: challenge.id }
                    } as any)}
                    icon="📸"
                    fullWidth
                    style={styles.completeButton}
                  />
                </LinearGradient>
              </View>
            ))}
          </>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 How to Complete</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>
              Tap "Complete Challenge" on any active challenge
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>
              Record a video or take a photo as proof
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>
              AI verifies your submission automatically
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>4</Text>
            <Text style={styles.infoText}>
              Get paid instantly when verified!
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  loadingState: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyState: {
    padding: Spacing.xxl,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  browseButton: {
    minWidth: 200,
  },
  challengeCard: {
    margin: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardGradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  prizeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  prizeAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeEmoji: {
    fontSize: 20,
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
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  difficultyLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
  },
  completeButton: {
    marginTop: Spacing.sm,
  },
  infoSection: {
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  infoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});