// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Dimensions,
//   Pressable,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from '../../contexts/AuthContext';
// import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
// import { Completion } from '../../types/completion';
// import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
// import { db } from '../../services/firebase/config';
// import { Collections } from '../../services/firebase/collections';
// import { formatDistanceToNow } from 'date-fns';

// const { width, height } = Dimensions.get('window');

// export default function WatchScreen() {
//   const { user } = useAuth();
//   const [completions, setCompletions] = useState<Completion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     loadCompletions();
//   }, []);

//   const loadCompletions = async () => {
//     try {
//       setLoading(true);
      
//       // Get verified completions with proof
//       const q = query(
//         collection(db, Collections.COMPLETIONS),
//         where('status', '==', 'verified'),
//         orderBy('submittedAt', 'desc'),
//         limit(20)
//       );

//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map(doc => ({
//         ...doc.data(),
//         id: doc.id,
//         submittedAt: doc.data().submittedAt?.toDate() || new Date(),
//         verifiedAt: doc.data().verifiedAt?.toDate(),
//         paidAt: doc.data().paidAt?.toDate(),
//       })) as Completion[];

//       setCompletions(data);
//     } catch (error) {
//       console.error('Error loading completions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item, index }: { item: Completion; index: number }) => (
//     <CompletionCard completion={item} isActive={index === currentIndex} />
//   );

//   const onViewableItemsChanged = ({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       setCurrentIndex(viewableItems[0].index || 0);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading completions...</Text>
//       </View>
//     );
//   }

//   if (completions.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyEmoji}>📺</Text>
//         <Text style={styles.emptyTitle}>No Completions Yet</Text>
//         <Text style={styles.emptyDescription}>
//           Be the first to complete a challenge and share your proof!
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={completions}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         snapToInterval={height}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={{
//           itemVisiblePercentThreshold: 50,
//         }}
//       />
//     </View>
//   );
// }

// function CompletionCard({ completion, isActive }: { completion: Completion; isActive: boolean }) {
//   const [liked, setLiked] = useState(false);
//   const [likes, setLikes] = useState(0);

//   return (
//     <View style={styles.card}>
//       {/* Background - Would show video/image here */}
//       <LinearGradient
//         colors={[Colors.background, Colors.surface]}
//         style={styles.cardBackground}
//       >
//         {/* Placeholder for video/image */}
//         <View style={styles.mediaPlaceholder}>
//           <Text style={styles.mediaIcon}>🎥</Text>
//           <Text style={styles.mediaText}>Video proof will display here</Text>
//           <Text style={styles.mediaSubtext}>
//             {completion.proofType === 'video' ? 'Video' : 'Photo'} proof submitted
//           </Text>
//         </View>
//       </LinearGradient>

//       {/* Bottom Info Overlay */}
//       <LinearGradient
//         colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
//         style={styles.bottomOverlay}
//       >
//         {/* User Info */}
//         <View style={styles.userInfo}>
//           <View style={styles.userAvatar}>
//             <Text style={styles.userAvatarText}>
//               {completion.userName.charAt(0).toUpperCase()}
//             </Text>
//           </View>
//           <View style={styles.userDetails}>
//             <Text style={styles.userName}>{completion.userName}</Text>
//             <Text style={styles.timeAgo}>
//               {formatDistanceToNow(completion.submittedAt, { addSuffix: true })}
//             </Text>
//           </View>
//         </View>

//         {/* Caption */}
//         {completion.caption && (
//           <Text style={styles.caption} numberOfLines={3}>
//             {completion.caption}
//           </Text>
//         )}

//         {/* Reward Badge */}
//         <View style={styles.rewardBadge}>
//           <Text style={styles.rewardEmoji}>🪙</Text>
//           <Text style={styles.rewardText}>
//             Won {completion.rewardAmount} DC
//           </Text>
//         </View>

//         {/* Verification Badge */}
//         <View style={styles.verificationBadge}>
//           <Text style={styles.verificationText}>
//             ✓ AI Verified ({completion.aiVerification.confidence}% confidence)
//           </Text>
//         </View>
//       </LinearGradient>

//       {/* Right Side Actions */}
//       <View style={styles.actions}>
//         {/* Like */}
//         <Pressable
//           style={styles.actionButton}
//           onPress={() => {
//             setLiked(!liked);
//             setLikes(prev => liked ? prev - 1 : prev + 1);
//           }}
//         >
//           <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
//           <Text style={styles.actionText}>{likes}</Text>
//         </Pressable>

//         {/* Comment */}
//         <Pressable style={styles.actionButton}>
//           <Text style={styles.actionIcon}>💬</Text>
//           <Text style={styles.actionText}>0</Text>
//         </Pressable>

//         {/* Share */}
//         <Pressable style={styles.actionButton}>
//           <Text style={styles.actionIcon}>📤</Text>
//         </Pressable>

//         {/* Tip */}
//         <Pressable style={styles.actionButton}>
//           <Text style={styles.actionIcon}>💰</Text>
//           <Text style={styles.actionText}>Tip</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginTop: Spacing.md,
//   },
//   emptyContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: Spacing.xl,
//   },
//   emptyEmoji: {
//     fontSize: 80,
//     marginBottom: Spacing.lg,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   emptyDescription: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   card: {
//     width: width,
//     height: height,
//     position: 'relative',
//   },
//   cardBackground: {
//     flex: 1,
//   },
//   mediaPlaceholder: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   mediaIcon: {
//     fontSize: 80,
//     marginBottom: Spacing.lg,
//   },
//   mediaText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   mediaSubtext: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   bottomOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: Spacing.lg,
//     paddingBottom: Spacing.xxl + 20, // Account for tab bar
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//   },
//   userAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: Spacing.md,
//   },
//   userAvatarText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   userDetails: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: 2,
//   },
//   timeAgo: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//   },
//   caption: {
//     fontSize: 14,
//     color: Colors.text,
//     lineHeight: 20,
//     marginBottom: Spacing.md,
//   },
//   rewardBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: Colors.success + '30',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.full,
//     marginBottom: Spacing.sm,
//   },
//   rewardEmoji: {
//     fontSize: 16,
//     marginRight: Spacing.xs,
//   },
//   rewardText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: Colors.success,
//   },
//   verificationBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(0, 128, 255, 0.3)',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.full,
//   },
//   verificationText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: Colors.primary,
//   },
//   actions: {
//     position: 'absolute',
//     right: Spacing.md,
//     bottom: Spacing.xxl + 80, // Account for bottom overlay + tab bar
//     gap: Spacing.lg,
//   },
//   actionButton: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     borderRadius: BorderRadius.full,
//     padding: Spacing.sm,
//     minWidth: 56,
//   },
//   actionIcon: {
//     fontSize: 28,
//     marginBottom: 4,
//   },
//   actionText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: Colors.text,
//   },
// });


import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Completion } from '../../types/completion';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Collections } from '../../services/firebase/collections';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  DollarSign, 
  Play, 
  CheckCircle,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react-native';

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
        aiVerification: doc.data().aiVerification || {
          verified: true,
          confidence: 95,
          explanation: 'Verified'
        }
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
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.loadingGradient}
        >
          <Zap size={60} color={Colors.text} strokeWidth={2} />
          <Text style={styles.loadingText}>Loading epic completions...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (completions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={[Colors.background, Colors.surface]}
          style={styles.emptyGradient}
        >
          <View style={styles.emptyIconWrapper}>
            <Play size={80} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No Completions Yet</Text>
          <Text style={styles.emptyDescription}>
            Be the first to complete a challenge and share your epic moment!
          </Text>
          <View style={styles.emptyBadges}>
            <View style={styles.emptyBadge}>
              <Trophy size={16} color={Colors.warning} />
              <Text style={styles.emptyBadgeText}>Win Rewards</Text>
            </View>
            <View style={styles.emptyBadge}>
              <Sparkles size={16} color={Colors.primary} />
              <Text style={styles.emptyBadgeText}>Get Famous</Text>
            </View>
          </View>
        </LinearGradient>
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
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));

  return (
    <View style={styles.card}>
      {/* Background Media */}
      <View style={styles.mediaContainer}>
        {completion.proofUrl ? (
          <Image 
            source={{ uri: completion.proofUrl }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={[Colors.primary + '40', Colors.secondary + '20', Colors.background]}
            style={styles.mediaPlaceholder}
          >
            <View style={styles.placeholderIconWrapper}>
              {completion.proofType === 'video' ? (
                <Play size={80} color={Colors.primary} strokeWidth={1.5} />
              ) : (
                <Sparkles size={80} color={Colors.primary} strokeWidth={1.5} />
              )}
            </View>
            <Text style={styles.placeholderText}>
              {completion.proofType === 'video' ? 'Video' : 'Photo'} Proof
            </Text>
            <View style={styles.verifiedBadgeTop}>
              <CheckCircle size={16} color={Colors.success} fill={Colors.success} />
              <Text style={styles.verifiedTextTop}>Verified</Text>
            </View>
          </LinearGradient>
        )}

        {/* Dark overlay for readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.9)']}
          locations={[0.4, 0.7, 1]}
          style={styles.darkOverlay}
        />
      </View>

      {/* Top Gradient Bar */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.6)', 'transparent']}
        style={styles.topGradient}
      >
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Challenge Completions</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Bottom Content Overlay */}
      <View style={styles.bottomContent}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.userRow}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.userAvatar}
            >
              <Text style={styles.userAvatarText}>
                {completion.userName.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
            
            <View style={styles.userInfo}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>@{completion.userName.toLowerCase().replace(/\s/g, '')}</Text>
                <CheckCircle size={16} color={Colors.primary} fill={Colors.primary} />
              </View>
              <Text style={styles.timeAgo}>
                {formatDistanceToNow(completion.submittedAt, { addSuffix: true })}
              </Text>
            </View>

            <Pressable style={styles.followButton}>
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.followGradient}
              >
                <Text style={styles.followText}>Follow</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Caption */}
          {completion.caption && (
            <Text style={styles.caption} numberOfLines={2}>
              {completion.caption}
            </Text>
          )}

          {/* Info Badges */}
          <View style={styles.badgesRow}>
            {/* Reward Badge */}
            <View style={styles.rewardBadge}>
              <Trophy size={16} color={Colors.warning} />
              <Text style={styles.rewardAmount}>{completion.rewardAmount}</Text>
              <Text style={styles.rewardCurrency}>DC</Text>
            </View>

            {/* Confidence Badge */}
            <View style={styles.confidenceBadge}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.confidenceText}>
                {completion.aiVerification?.confidence || 95}% Match
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Side Actions */}
      <View style={styles.actionsColumn}>
        {/* Like Button */}
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
          }}
        >
          <View style={[styles.actionIconWrapper, liked && styles.actionIconWrapperActive]}>
            <Heart 
              size={28} 
              color={liked ? Colors.danger : Colors.text}
              fill={liked ? Colors.danger : 'none'}
              strokeWidth={2}
            />
          </View>
          <Text style={styles.actionCount}>
            {likes > 999 ? `${(likes / 1000).toFixed(1)}k` : likes}
          </Text>
        </Pressable>

        {/* Comment Button */}
        <Pressable style={styles.actionButton}>
          <View style={styles.actionIconWrapper}>
            <MessageCircle size={28} color={Colors.text} strokeWidth={2} />
          </View>
          <Text style={styles.actionCount}>
            {Math.floor(Math.random() * 50)}
          </Text>
        </Pressable>

        {/* Share Button */}
        <Pressable style={styles.actionButton}>
          <View style={styles.actionIconWrapper}>
            <Share2 size={26} color={Colors.text} strokeWidth={2} />
          </View>
          <Text style={styles.actionCount}>Share</Text>
        </Pressable>

        {/* Tip Button */}
        <Pressable style={styles.actionButton}>
          <LinearGradient
            colors={[Colors.success, Colors.success + 'cc']}
            style={styles.tipButtonGradient}
          >
            <DollarSign size={26} color={Colors.text} strokeWidth={2.5} />
          </LinearGradient>
          <Text style={styles.actionCount}>Tip</Text>
        </Pressable>

        {/* Creator Avatar at Bottom */}
        <View style={styles.creatorAvatarWrapper}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.creatorAvatar}
          >
            <Text style={styles.creatorAvatarText}>
              {completion.userName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.plusIcon}>
            <Text style={styles.plusIconText}>+</Text>
          </View>
        </View>
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
  },
  loadingGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 3,
    borderColor: Colors.primary + '40',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyBadges: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  emptyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  card: {
    width: width,
    height: height,
    position: 'relative',
    backgroundColor: Colors.background,
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIconWrapper: {
    marginBottom: Spacing.xl,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  verifiedBadgeTop: {
    position: 'absolute',
    top: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '30',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  verifiedTextTop: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  darkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.danger + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.danger,
    letterSpacing: 0.5,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  userSection: {
    gap: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  timeAgo: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  followButton: {
    marginLeft: Spacing.sm,
  },
  followGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  followText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  caption: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.warning,
  },
  rewardCurrency: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warning,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  confidenceText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionsColumn: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 120,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionIconWrapperActive: {
    backgroundColor: 'rgba(255, 59, 92, 0.3)',
    borderColor: Colors.danger,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tipButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorAvatarWrapper: {
    marginTop: Spacing.md,
    position: 'relative',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
  },
  creatorAvatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  plusIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
  },
});