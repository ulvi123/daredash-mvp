import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Completion } from '../../types/completion';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Collections } from '../../services/firebase/collections';
import { formatDistanceToNow } from 'date-fns';

const { width, height } = Dimensions.get('window');

export default function WatchScreen() {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadCompletions();
  }, []);

  const loadCompletions = async () => {
    try {
      setLoading(true);
      
      // Get verified completions with proof
      const q = query(
        collection(db, Collections.COMPLETIONS),
        where('status', '==', 'verified'),
        orderBy('submittedAt', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
        verifiedAt: doc.data().verifiedAt?.toDate(),
        paidAt: doc.data().paidAt?.toDate(),
      })) as Completion[];

      setCompletions(data);
    } catch (error) {
      console.error('Error loading completions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: Completion; index: number }) => (
    <CompletionCard completion={item} isActive={index === currentIndex} />
  );

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading completions...</Text>
      </View>
    );
  }

  if (completions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📺</Text>
        <Text style={styles.emptyTitle}>No Completions Yet</Text>
        <Text style={styles.emptyDescription}>
          Be the first to complete a challenge and share your proof!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={completions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </View>
  );
}

function CompletionCard({ completion, isActive }: { completion: Completion; isActive: boolean }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  return (
    <View style={styles.card}>
      {/* Background - Would show video/image here */}
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={styles.cardBackground}
      >
        {/* Placeholder for video/image */}
        <View style={styles.mediaPlaceholder}>
          <Text style={styles.mediaIcon}>🎥</Text>
          <Text style={styles.mediaText}>Video proof will display here</Text>
          <Text style={styles.mediaSubtext}>
            {completion.proofType === 'video' ? 'Video' : 'Photo'} proof submitted
          </Text>
        </View>
      </LinearGradient>

      {/* Bottom Info Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
        style={styles.bottomOverlay}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {completion.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{completion.userName}</Text>
            <Text style={styles.timeAgo}>
              {formatDistanceToNow(completion.submittedAt, { addSuffix: true })}
            </Text>
          </View>
        </View>

        {/* Caption */}
        {completion.caption && (
          <Text style={styles.caption} numberOfLines={3}>
            {completion.caption}
          </Text>
        )}

        {/* Reward Badge */}
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardEmoji}>🪙</Text>
          <Text style={styles.rewardText}>
            Won {completion.rewardAmount} DC
          </Text>
        </View>

        {/* Verification Badge */}
        <View style={styles.verificationBadge}>
          <Text style={styles.verificationText}>
            ✓ AI Verified ({completion.aiVerification.confidence}% confidence)
          </Text>
        </View>
      </LinearGradient>

      {/* Right Side Actions */}
      <View style={styles.actions}>
        {/* Like */}
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
          }}
        >
          <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionText}>{likes}</Text>
        </Pressable>

        {/* Comment */}
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>0</Text>
        </Pressable>

        {/* Share */}
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
        </Pressable>

        {/* Tip */}
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Tip</Text>
        </Pressable>
      </View>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
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
    lineHeight: 24,
  },
  card: {
    width: width,
    height: height,
    position: 'relative',
  },
  cardBackground: {
    flex: 1,
  },
  mediaPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  mediaText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  mediaSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl + 20, // Account for tab bar
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  rewardEmoji: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  verificationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 128, 255, 0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  actions: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.xxl + 80, // Account for bottom overlay + tab bar
    gap: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    minWidth: 56,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
});