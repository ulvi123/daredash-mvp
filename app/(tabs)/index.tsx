import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  StatusBar,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../utils/constants/themes';
import { Challenge, ChallengeCategory } from '../../types/challenges';
import { ChallengeService } from '../../services/firebase/challenge.service';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { formatDistanceToNow } from 'date-fns';

const { width } = Dimensions.get('window');

export default function InstagramFeed() {
  const { user } = useAuth();
  const router = useRouter();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const data = await ChallengeService.getActiveChallenges(undefined, 50);
      setChallenges(data);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  const openChallenge = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/challenge/${id}`);
  };

  /** ---------------------------
   *  CHALLENGE CARD
   *  Instagram-style
   ----------------------------*/
  const renderChallenge = ({ item }: { item: Challenge }) => {
    const timeAgo = formatDistanceToNow(item.createdAt, { addSuffix: true });

    const isOwner = item.creatorId === user?.id;

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <View style={styles.userRow}>
            {item.creatorAvatar ? (
              <Image
                source={{ uri: item.creatorAvatar }}
                style={styles.avatar}
              />
            ) : (
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {item.creatorName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            )}

            <View>
              <Text style={styles.username}>{item.creatorName}</Text>
              <Text style={styles.subText}>{item.category} • {timeAgo}</Text>
            </View>
          </View>

          <Pressable hitSlop={8}>
            <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text} />
          </Pressable>
        </View>

        {/* CONTENT */}
        <Pressable onPress={() => openChallenge(item.id)}>
          <View style={styles.mediaWrapper}>
            {item.thumbnail ? (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.mediaImage}
              />
            ) : (
              <LinearGradient
                colors={getCategoryGradient(item.category)}
                style={styles.mediaPlaceholder}
              >
                <Text style={styles.mediaEmoji}>
                  {getCategoryEmoji(item.category)}
                </Text>
              </LinearGradient>
            )}
          </View>
        </Pressable>

        {/* TITLE + DESCRIPTION */}
        <Pressable onPress={() => openChallenge(item.id)} style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.badge, styles.greenBadge]}>
              <Ionicons name="cash-outline" size={14} color="#00FF88" />
              <Text style={styles.badgeText}>{item.prizePool} DC</Text>
            </View>
            <View style={[styles.badge, styles.goldBadge]}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.badgeText}>Lvl {item.difficulty}</Text>
            </View>
            <View style={[styles.badge, styles.blueBadge]}>
              <Ionicons name="eye-outline" size={14} color="#0080FF" />
              <Text style={styles.badgeText}>{item.views}</Text>
            </View>
          </View>
        </Pressable>

        {/* FOOTER: Instagram-style actions */}
        <View style={styles.footerActions}>
          <View style={styles.actionsLeft}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="heart-outline" size={26} color={Colors.text} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color={Colors.text} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="paper-plane-outline" size={24} color={Colors.text} />
            </Pressable>
          </View>

          <Pressable style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.text} />
          </Pressable>
        </View>

        {/* TAKE CHALLENGE BUTTON */}
        {!isOwner && (
          <Pressable
            style={styles.takeButton}
            onPress={() => openChallenge(item.id)}
          >
            <Text style={styles.takeButtonText}>Take This Challenge</Text>
          </Pressable>
        )}

        {/* COMPLETIONS */}
        <View style={styles.footerInfo}>
          <Text style={styles.completions}>{item.completions} completions</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

/* UTILITIES */
function getCategoryEmoji(category: ChallengeCategory): string {
  const emojis: Record<ChallengeCategory, string> = {
    creative: '🎨',
    social: '🤝',
    fitness: '💪',
    skill: '🎯',
    adventure: '🏔️',
    random: '🎲',
    business: '💼',
  };
  return emojis[category] || '🎯';
}

function getCategoryGradient(category: ChallengeCategory): [string, string] {
  const gradients: Record<ChallengeCategory, [string, string]> = {
    creative: ['#A020F0', '#C850C0'],
    social: ['#0080FF', '#00D4FF'],
    fitness: ['#00FF88', '#00CC6A'],
    skill: ['#FFD700', '#FFA500'],
    adventure: ['#FF4444', '#FF6B6B'],
    random: ['#FFA500', '#FF6347'],
    business: ['#00CED1', '#1E90FF'],
  };
  return gradients[category] || ['#667eea', '#764ba2'];
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  card: {
    backgroundColor: Colors.surface,
    marginBottom: 22,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    alignItems: 'center',
  },

  userRow: { flexDirection: 'row', alignItems: 'center' },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  username: { fontSize: 15, fontWeight: '700', color: Colors.text },
  subText: { fontSize: 12, color: Colors.textSecondary },

  mediaWrapper: { width: '100%', aspectRatio: 1 },

  mediaImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mediaEmoji: { fontSize: 80, opacity: 0.9 },

  info: { padding: 14 },

  title: { fontSize: 16, fontWeight: '800', marginBottom: 4, color: Colors.text },
  description: { fontSize: 13, color: '#666', marginBottom: 10 },

  statsRow: { flexDirection: 'row', gap: 10 },

  badge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    alignItems: 'center',
  },

  greenBadge: { backgroundColor: 'rgba(0,255,136,0.12)' },
  goldBadge: { backgroundColor: 'rgba(255,215,0,0.15)' },
  blueBadge: { backgroundColor: 'rgba(0,128,255,0.15)' },

  badgeText: { fontSize: 12, fontWeight: '600', color: Colors.text },

  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  actionsLeft: { flexDirection: 'row', gap: 14 },

  actionButton: { padding: 4 },

  takeButton: {
    marginHorizontal: 14,
    marginTop: 6,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  takeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },

  footerInfo: { paddingHorizontal: 14, paddingBottom: 12 },
  completions: { fontSize: 13, color: Colors.textSecondary },
});
