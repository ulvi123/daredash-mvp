// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Pressable,
//   Dimensions,
//   StatusBar,
//   RefreshControl,
//   Image,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from '../../contexts/AuthContext';
// import { useRouter } from 'expo-router';
// import { Colors } from '../../utils/constants/themes';
// import { Challenge, ChallengeCategory } from '../../types/challenges';
// import { ChallengeService } from '../../services/firebase/challenge.service';
// import { Ionicons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';
// import { formatDistanceToNow } from 'date-fns';

// const { width } = Dimensions.get('window');

// export default function InstagramFeed() {
//   const { user } = useAuth();
//   const router = useRouter();

//   const [challenges, setChallenges] = useState<Challenge[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     loadChallenges();
//   }, []);

//   const loadChallenges = async () => {
//     try {
//       const data = await ChallengeService.getActiveChallenges(undefined, 50);
//       setChallenges(data);
//     } catch (error) {
//       console.error('Error loading challenges:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadChallenges();
//     setRefreshing(false);
//   };

//   const openChallenge = (id: string) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     router.push(`/challenge/${id}`);
//   };

//   /** ---------------------------
//    *  CHALLENGE CARD
//    *  Instagram-style
//    ----------------------------*/
//   const renderChallenge = ({ item }: { item: Challenge }) => {
//     const timeAgo = formatDistanceToNow(item.createdAt, { addSuffix: true });

//     const isOwner = item.creatorId === user?.id;

//     return (
//       <View style={styles.card}>
//         {/* HEADER */}
//         <View style={styles.cardHeader}>
//           <View style={styles.userRow}>
//             {item.creatorAvatar ? (
//               <Image
//                 source={{ uri: item.creatorAvatar }}
//                 style={styles.avatar}
//               />
//             ) : (
//               <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatar}>
//                 <Text style={styles.avatarLetter}>
//                   {item.creatorName.charAt(0).toUpperCase()}
//                 </Text>
//               </LinearGradient>
//             )}

//             <View>
//               <Text style={styles.username}>{item.creatorName}</Text>
//               <Text style={styles.subText}>{item.category} • {timeAgo}</Text>
//             </View>
//           </View>

//           <Pressable hitSlop={8}>
//             <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text} />
//           </Pressable>
//         </View>

//         {/* CONTENT */}
//         <Pressable onPress={() => openChallenge(item.id)}>
//           <View style={styles.mediaWrapper}>
//             {item.thumbnail ? (
//               <Image
//                 source={{ uri: item.thumbnail }}
//                 style={styles.mediaImage}
//               />
//             ) : (
//               <LinearGradient
//                 colors={getCategoryGradient(item.category)}
//                 style={styles.mediaPlaceholder}
//               >
//                 <Text style={styles.mediaEmoji}>
//                   {getCategoryEmoji(item.category)}
//                 </Text>
//               </LinearGradient>
//             )}
//           </View>
//         </Pressable>

//         {/* TITLE + DESCRIPTION */}
//         <Pressable onPress={() => openChallenge(item.id)} style={styles.info}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.description} numberOfLines={2}>
//             {item.description}
//           </Text>

//           <View style={styles.statsRow}>
//             <View style={[styles.badge, styles.greenBadge]}>
//               <Ionicons name="cash-outline" size={14} color="#00FF88" />
//               <Text style={styles.badgeText}>{item.prizePool} DC</Text>
//             </View>
//             <View style={[styles.badge, styles.goldBadge]}>
//               <Ionicons name="star" size={14} color="#FFD700" />
//               <Text style={styles.badgeText}>Lvl {item.difficulty}</Text>
//             </View>
//             <View style={[styles.badge, styles.blueBadge]}>
//               <Ionicons name="eye-outline" size={14} color="#0080FF" />
//               <Text style={styles.badgeText}>{item.views}</Text>
//             </View>
//           </View>
//         </Pressable>

//         {/* FOOTER: Instagram-style actions */}
//         <View style={styles.footerActions}>
//           <View style={styles.actionsLeft}>
//             <Pressable style={styles.actionButton}>
//               <Ionicons name="heart-outline" size={26} color={Colors.text} />
//             </Pressable>
//             <Pressable style={styles.actionButton}>
//               <Ionicons name="chatbubble-outline" size={24} color={Colors.text} />
//             </Pressable>
//             <Pressable style={styles.actionButton}>
//               <Ionicons name="paper-plane-outline" size={24} color={Colors.text} />
//             </Pressable>
//           </View>

//           <Pressable style={styles.actionButton}>
//             <Ionicons name="bookmark-outline" size={24} color={Colors.text} />
//           </Pressable>
//         </View>

//         {/* TAKE CHALLENGE BUTTON */}
//         {!isOwner && (
//           <Pressable
//             style={styles.takeButton}
//             onPress={() => openChallenge(item.id)}
//           >
//             <Text style={styles.takeButtonText}>Take This Challenge</Text>
//           </Pressable>
//         )}

//         {/* COMPLETIONS */}
//         <View style={styles.footerInfo}>
//           <Text style={styles.completions}>{item.completions} completions</Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <FlatList
//         data={challenges}
//         renderItem={renderChallenge}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       />
//     </View>
//   );
// }

// /* UTILITIES */
// function getCategoryEmoji(category: ChallengeCategory): string {
//   const emojis: Record<ChallengeCategory, string> = {
//     creative: '🎨',
//     social: '🤝',
//     fitness: '💪',
//     skill: '🎯',
//     adventure: '🏔️',
//     random: '🎲',
//     business: '💼',
//   };
//   return emojis[category] || '🎯';
// }

// function getCategoryGradient(category: ChallengeCategory): [string, string] {
//   const gradients: Record<ChallengeCategory, [string, string]> = {
//     creative: ['#A020F0', '#C850C0'],
//     social: ['#0080FF', '#00D4FF'],
//     fitness: ['#00FF88', '#00CC6A'],
//     skill: ['#FFD700', '#FFA500'],
//     adventure: ['#FF4444', '#FF6B6B'],
//     random: ['#FFA500', '#FF6347'],
//     business: ['#00CED1', '#1E90FF'],
//   };
//   return gradients[category] || ['#667eea', '#764ba2'];
// }

// /* STYLES */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },

//   card: {
//     backgroundColor: Colors.surface,
//     marginBottom: 22,
//   },

//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 14,
//     alignItems: 'center',
//   },

//   userRow: { flexDirection: 'row', alignItems: 'center' },

//   avatar: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   avatarLetter: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },

//   username: { fontSize: 15, fontWeight: '700', color: Colors.text },
//   subText: { fontSize: 12, color: Colors.textSecondary },

//   mediaWrapper: { width: '100%', aspectRatio: 1 },

//   mediaImage: { width: '100%', height: '100%', resizeMode: 'cover' },

//   mediaPlaceholder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   mediaEmoji: { fontSize: 80, opacity: 0.9 },

//   info: { padding: 14 },

//   title: { fontSize: 16, fontWeight: '800', marginBottom: 4, color: Colors.text },
//   description: { fontSize: 13, color: '#666', marginBottom: 10 },

//   statsRow: { flexDirection: 'row', gap: 10 },

//   badge: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 10,
//     gap: 4,
//     alignItems: 'center',
//   },

//   greenBadge: { backgroundColor: 'rgba(0,255,136,0.12)' },
//   goldBadge: { backgroundColor: 'rgba(255,215,0,0.15)' },
//   blueBadge: { backgroundColor: 'rgba(0,128,255,0.15)' },

//   badgeText: { fontSize: 12, fontWeight: '600', color: Colors.text },

//   footerActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },

//   actionsLeft: { flexDirection: 'row', gap: 14 },

//   actionButton: { padding: 4 },

//   takeButton: {
//     marginHorizontal: 14,
//     marginTop: 6,
//     backgroundColor: '#6C5CE7',
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },

//   takeButtonText: {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 14,
//   },

//   footerInfo: { paddingHorizontal: 14, paddingBottom: 12 },
//   completions: { fontSize: 13, color: Colors.textSecondary },
// });


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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Challenge, ChallengeCategory } from '../../types/challenges';
import { ChallengeService } from '../../services/firebase/challenge.service';
import * as Haptics from 'expo-haptics';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Trophy,
  Eye,
  Star,
  Zap,
  TrendingUp,
  Clock,
  Users,
  Award
} from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';


const { width } = Dimensions.get('window');

export default function HypnoticFeed() {
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
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadChallenges();
    setRefreshing(false);
  };

  const openChallenge = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/challenge/${id}`);
  };

  const renderChallenge = ({ item, index }: { item: Challenge; index: number }) => {
    return <ChallengeCard challenge={item} index={index} onPress={() => openChallenge(item.id)} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Floating Header */}
      <LinearGradient
        colors={[Colors.background, Colors.background + 'dd', 'transparent']}
        style={styles.floatingHeader}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>Challenge yourself daily</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statPill}>
              <TrendingUp size={16} color={Colors.success} />
              <Text style={styles.statText}>Hot</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />
    </View>
  );
}

function ChallengeCard({ challenge, index, onPress }: { 
  challenge: Challenge; 
  index: number;
  onPress: () => void;
}) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 200) + 50);

  const isOwner = challenge.creatorId === user?.id;
  const timeAgo = formatDistanceToNow(challenge.createdAt, { addSuffix: true });

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBookmarked(!bookmarked);
  };

  return (
    <View style={styles.card}>
      {/* Header with User Info */}
      <View style={styles.cardHeader}>
        <Pressable style={styles.userRow} onPress={onPress}>
          {challenge.creatorAvatar ? (
            <Image
              source={{ uri: challenge.creatorAvatar }}
              style={styles.avatar}
            />
          ) : (
            <LinearGradient 
              colors={getCategoryGradient(challenge.category)} 
              style={styles.avatar}
            >
              <Text style={styles.avatarLetter}>
                {challenge.creatorName.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}

          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.username}>{challenge.creatorName}</Text>
              {challenge.completions > 10 && (
                <Award size={14} color={Colors.warning} fill={Colors.warning} />
              )}
            </View>
            <View style={styles.metaRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryEmoji}>{getCategoryEmoji(challenge.category)}</Text>
                <Text style={styles.categoryText}>{challenge.category}</Text>
              </View>
              <Text style={styles.timeText}>• {timeAgo}</Text>
            </View>
          </View>
        </Pressable>

        <Pressable style={styles.moreButton} hitSlop={8}>
          <MoreHorizontal size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* Media/Image Section */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        <View style={styles.mediaContainer}>
          {challenge.thumbnail ? (
            <Image
              source={{ uri: challenge.thumbnail }}
              style={styles.mediaImage}
            />
          ) : (
            <LinearGradient
              colors={getCategoryGradient(challenge.category)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mediaPlaceholder}
            >
              {/* Decorative circles */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              
              <Text style={styles.mediaEmoji}>
                {getCategoryEmoji(challenge.category)}
              </Text>
              
              {/* Floating stats on image */}
              <View style={styles.floatingStats}>
                <View style={styles.floatingStat}>
                  <Trophy size={14} color={Colors.text} />
                  <Text style={styles.floatingStatText}>{challenge.prizePool} DC</Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* Overlay badges */}
          <View style={styles.overlayBadges}>
            {challenge.difficulty >= 4 && (
              <View style={styles.hardBadge}>
                <Zap size={12} color={Colors.danger} fill={Colors.danger} />
                <Text style={styles.hardBadgeText}>Hard</Text>
              </View>
            )}
            {challenge.views > 100 && (
              <View style={styles.trendingBadge}>
                <TrendingUp size={12} color={Colors.text} />
                <Text style={styles.trendingBadgeText}>Trending</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Row (Instagram-style) */}
      <View style={styles.actionRow}>
        <View style={styles.actionsLeft}>
          <Pressable style={styles.actionButton} onPress={handleLike}>
            <Heart 
              size={26} 
              color={liked ? Colors.danger : Colors.text}
              fill={liked ? Colors.danger : 'none'}
              strokeWidth={2}
            />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onPress}>
            <MessageCircle size={24} color={Colors.text} strokeWidth={2} />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Share2 size={23} color={Colors.text} strokeWidth={2} />
          </Pressable>
        </View>

        <Pressable style={styles.actionButton} onPress={handleBookmark}>
          <Bookmark 
            size={24} 
            color={bookmarked ? Colors.warning : Colors.text}
            fill={bookmarked ? Colors.warning : 'none'}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      {/* Likes Count */}
      <View style={styles.likesSection}>
        <Text style={styles.likesText}>
          {likeCount.toLocaleString()} likes
        </Text>
      </View>

      {/* Content Section */}
      <Pressable onPress={onPress} style={styles.contentSection}>
        <Text style={styles.title} numberOfLines={2}>
          {challenge.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>
      </Pressable>

      {/* Info Pills */}
      <View style={styles.pillsRow}>
        <LinearGradient
          colors={[Colors.success + '30', Colors.success + '15']}
          style={styles.infoPill}
        >
          <Trophy size={14} color={Colors.success} />
          <Text style={styles.pillText}>{challenge.prizePool} DC</Text>
        </LinearGradient>

        <View style={[styles.infoPill, { backgroundColor: Colors.warning + '20' }]}>
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              size={10} 
              color={i < challenge.difficulty ? Colors.warning : Colors.border}
              fill={i < challenge.difficulty ? Colors.warning : 'none'}
            />
          ))}
        </View>

        <View style={[styles.infoPill, { backgroundColor: Colors.primary + '20' }]}>
          <Eye size={14} color={Colors.primary} />
          <Text style={styles.pillText}>{challenge.views}</Text>
        </View>

        <View style={[styles.infoPill, { backgroundColor: Colors.secondary + '20' }]}>
          <Users size={14} color={Colors.secondary} />
          <Text style={styles.pillText}>{challenge.completions}</Text>
        </View>
      </View>

      {/* Time Remaining */}
      <View style={styles.timeRemainingRow}>
        <Clock size={12} color={Colors.textMuted} />
        <Text style={styles.timeRemainingText}>
          Expires {formatDistanceToNow(challenge.expiresAt, { addSuffix: true })}
        </Text>
      </View>

      {/* CTA Button */}
      {!isOwner && (
        <Pressable onPress={onPress}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Zap size={18} color={Colors.text} fill={Colors.text} />
            <Text style={styles.ctaButtonText}>Accept Challenge</Text>
          </LinearGradient>
        </Pressable>
      )}

      {isOwner && (
        <View style={styles.ownerBadge}>
          <Text style={styles.ownerBadgeText}>Your Challenge</Text>
        </View>
      )}
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
  return gradients[category] || [Colors.primary, Colors.secondary];
}

/* STYLES */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  headerStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.success,
  },
  listContent: {
    paddingTop: 120,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  moreButton: {
    padding: Spacing.sm,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -30,
    left: -30,
  },
  mediaEmoji: {
    fontSize: 100,
    opacity: 0.9,
  },
  floatingStats: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
  },
  floatingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  floatingStatText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  overlayBadges: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    gap: Spacing.sm,
  },
  hardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.danger + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  hardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.danger,
    textTransform: 'uppercase',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  trendingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  likesSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  contentSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  timeRemainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: 4,
  },
  timeRemainingText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  ownerBadge: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.warning + '20',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  ownerBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});