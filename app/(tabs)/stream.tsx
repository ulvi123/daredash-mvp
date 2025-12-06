// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from '../../contexts/AuthContext';
// import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
// import { Challenge } from '../../types/challenges';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../services/firebase/config';
// import { Collections } from '../../services/firebase/collections';
// import Button from '../../components/common/Button';
// import { useRouter } from 'expo-router';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// export default function StreamScreen() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [acceptedChallenges, setAcceptedChallenges] = useState<Challenge[]>([]);
//   const [loading, setLoading] = useState(true);

//   useFocusEffect(
//     useCallback(() => {
//       // Wait for user to be available
//       if (user?.id) {
//         loadAcceptedChallenges();
//       } else {
//         console.log('⏳ Waiting for user auth state...');
//         setLoading(false); // Don't show loading forever if no user
//       }
//     }, [user?.id]) // 👈 Depend on user.id specifically
//   );

//   const loadAcceptedChallenges = async () => {
//     if (!user) {
//       console.log('❌ No user found');
//       return;
//     }


//     try {
//       console.log('🔄 Loading accepted challenges for user:', user.id);
//       setLoading(true);

//       // Get challenges accepted by current user
//       const q = query(
//         collection(db, Collections.CHALLENGES),
//         where('acceptedBy', '==', user.id),
//         where('status', '==', 'in_progress')
//       );

//       console.log('📡 Executing Firestore query...');
//       const snapshot = await getDocs(q);
//       console.log('✅ Query successful, found:', snapshot.docs.length, 'challenges');

//       const data = snapshot.docs.map(doc => {
//         console.log('📄 Processing challenge:', doc.id);
//         return {
//           ...doc.data(),
//           id: doc.id,
//           createdAt: doc.data().createdAt?.toDate() || new Date(),
//           expiresAt: doc.data().expiresAt?.toDate() || new Date(),
//           acceptedAt: doc.data().acceptedAt?.toDate(),
//           aiAnalysis: {
//             ...doc.data().aianalysis,
//             analysisTimestamp: doc.data().aianalysis?.analysisTimestamp?.toDate() || new Date(),
//           },
//         };
//       }) as Challenge[];

//       console.log('✅ Processed challenges:', data.length);

//       setAcceptedChallenges(data);
//     } catch (error: any) {
//       console.error('❌ Error loading accepted challenges:', error);
//       console.error('Error code:', error.code);
//       console.error('Error message:', error.message);
//       console.error('Error loading accepted challenges:', error);

//       Alert.alert(
//         'Error Loading Challenges',
//         error.message || 'Failed to load your challenges. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={[Colors.surface, Colors.background]}
//         style={styles.header}
//       >
//         <Text style={styles.headerTitle}>Your Challenges</Text>
//         <Text style={styles.headerSubtitle}>
//           Complete and submit proof to earn rewards
//         </Text>
//       </LinearGradient>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {loading ? (
//           <View style={styles.loadingState}>
//             <Text style={styles.loadingText}>Loading your challenges...</Text>
//           </View>
//         ) : acceptedChallenges.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyEmoji}>🎯</Text>
//             <Text style={styles.emptyTitle}>No Active Challenges</Text>
//             <Text style={styles.emptyDescription}>
//               Accept a challenge from the Feed to get started!
//             </Text>
//             <Button
//               title="Browse Challenges"
//               onPress={() => router.push('/')}
//               icon="🏠"
//               style={styles.browseButton}
//             />
//           </View>
//         ) : (
//           <>
//             {acceptedChallenges.map((challenge) => (
//               <View key={challenge.id} style={styles.challengeCard}>
//                 <LinearGradient
//                   colors={['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.1)']}
//                   style={styles.cardGradient}
//                 >
//                   {/* Challenge Info */}
//                   <Text style={styles.challengeTitle}>{challenge.title}</Text>
//                   <Text style={styles.challengeDescription} numberOfLines={2}>
//                     {challenge.description}
//                   </Text>

//                   {/* Prize */}
//                   <View style={styles.prizeRow}>
//                     <Text style={styles.prizeLabel}>Prize:</Text>
//                     <View style={styles.prizeAmount}>
//                       <Text style={styles.prizeEmoji}>🪙</Text>
//                       <Text style={styles.prizeValue}>{challenge.prizePool}</Text>
//                       <Text style={styles.prizeCurrency}>DC</Text>
//                     </View>
//                   </View>

//                   {/* Difficulty */}
//                   <View style={styles.difficultyRow}>
//                     <Text style={styles.difficultyLabel}>Difficulty:</Text>
//                     <View style={styles.stars}>
//                       {[...Array(5)].map((_, i) => (
//                         <Text key={i} style={styles.star}>
//                           {i < challenge.difficulty ? '⭐' : '☆'}
//                         </Text>
//                       ))}
//                     </View>
//                   </View>

//                   {/* Action Button */}
//                   <Button
//                     title="Complete Challenge"
//                     onPress={() => router.push({
//                       pathname: '/complete/[id]',
//                       params: { id: challenge.id }
//                     } as any)}
//                     icon="📸"
//                     fullWidth
//                     style={styles.completeButton}
//                   />
//                 </LinearGradient>
//               </View>
//             ))}
//           </>
//         )}

//         {/* Info Section */}
//         <View style={styles.infoSection}>
//           <Text style={styles.infoTitle}>💡 How to Complete</Text>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoNumber}>1</Text>
//             <Text style={styles.infoText}>
//               Tap "Complete Challenge" on any active challenge
//             </Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoNumber}>2</Text>
//             <Text style={styles.infoText}>
//               Record a video or take a photo as proof
//             </Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoNumber}>3</Text>
//             <Text style={styles.infoText}>
//               AI verifies your submission automatically
//             </Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoNumber}>4</Text>
//             <Text style={styles.infoText}>
//               Get paid instantly when verified!
//             </Text>
//           </View>
//         </View>

//         <View style={styles.bottomPadding} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   header: {
//     paddingTop: 60,
//     paddingBottom: Spacing.lg,
//     paddingHorizontal: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   content: {
//     flex: 1,
//   },
//   loadingState: {
//     padding: Spacing.xxl,
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//   },
//   emptyState: {
//     padding: Spacing.xxl,
//     alignItems: 'center',
//     marginTop: Spacing.xxl,
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
//     marginBottom: Spacing.xl,
//     lineHeight: 24,
//   },
//   browseButton: {
//     minWidth: 200,
//   },
//   challengeCard: {
//     margin: Spacing.lg,
//     marginBottom: Spacing.md,
//   },
//   cardGradient: {
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   challengeTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   challengeDescription: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.md,
//     lineHeight: 20,
//   },
//   prizeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.md,
//   },
//   prizeLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   prizeAmount: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   prizeEmoji: {
//     fontSize: 20,
//     marginRight: 4,
//   },
//   prizeValue: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: Colors.success,
//   },
//   prizeCurrency: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//     marginLeft: 4,
//   },
//   difficultyRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   difficultyLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginRight: Spacing.sm,
//   },
//   stars: {
//     flexDirection: 'row',
//   },
//   star: {
//     fontSize: 14,
//   },
//   completeButton: {
//     marginTop: Spacing.sm,
//   },
//   infoSection: {
//     margin: Spacing.lg,
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   infoTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: Spacing.md,
//   },
//   infoNumber: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: Colors.primary,
//     color: Colors.text,
//     fontSize: 14,
//     fontWeight: '700',
//     textAlign: 'center',
//     lineHeight: 28,
//     marginRight: Spacing.md,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },
//   bottomPadding: {
//     height: Spacing.xxl,
//   },
// });


import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Pressable,
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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Zap, Trophy, Clock, Flame } from 'lucide-react-native';

export default function StreamScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [acceptedChallenges, setAcceptedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadAcceptedChallenges();
      } else {
        console.log('⏳ Waiting for user auth state...');
        setLoading(false);
      }
    }, [user?.id])
  );

  const loadAcceptedChallenges = async () => {
    if (!user) {
      console.log('❌ No user found');
      return;
    }

    try {
      console.log('🔄 Loading accepted challenges for user:', user.id);
      setLoading(true);

      const q = query(
        collection(db, Collections.CHALLENGES),
        where('acceptedBy', '==', user.id),
        where('status', '==', 'in_progress')
      );

      console.log('📡 Executing Firestore query...');
      const snapshot = await getDocs(q);
      console.log('✅ Query successful, found:', snapshot.docs.length, 'challenges');

      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
        acceptedAt: doc.data().acceptedAt?.toDate(),
        aiAnalysis: {
          ...doc.data().aianalysis,
          analysisTimestamp: doc.data().aianalysis?.analysisTimestamp?.toDate() || new Date(),
        },
      })) as Challenge[];

      console.log('✅ Processed challenges:', data.length);
      setAcceptedChallenges(data);
    } catch (error: any) {
      console.error('❌ Error loading accepted challenges:', error);
      Alert.alert(
        'Error Loading Challenges',
        error.message || 'Failed to load your challenges. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    
    if (diff < 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }
    return `${hours}h ${minutes}m left`;
  };

  return (
    <View style={styles.container}>
      {/* Animated Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary, Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Your Stream</Text>
              <Text style={styles.headerSubtitle}>
                {acceptedChallenges.length} active {acceptedChallenges.length === 1 ? 'challenge' : 'challenges'}
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Flame size={20} color={Colors.warning} />
              <Text style={styles.streakText}>🔥 3</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Zap size={16} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Trophy size={16} color={Colors.success} />
              <Text style={styles.statValue}>450</Text>
              <Text style={styles.statLabel}>DC Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={16} color={Colors.warning} />
              <Text style={styles.statValue}>8h</Text>
              <Text style={styles.statLabel}>Avg Time</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingState}>
            <View style={styles.loadingSpinner}>
              <Zap size={40} color={Colors.primary} />
            </View>
            <Text style={styles.loadingText}>Loading your challenges...</Text>
          </View>
        ) : acceptedChallenges.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[Colors.primary + '20', Colors.secondary + '10']}
              style={styles.emptyGradient}
            >
              <View style={styles.emptyIconWrapper}>
                <Zap size={64} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.emptyTitle}>Ready to Take Action?</Text>
              <Text style={styles.emptyDescription}>
                Your challenge stream is empty. Browse the feed and accept challenges to get started!
              </Text>
              <Button
                title="Explore Challenges"
                onPress={() => router.push('/')}
                icon="🏠"
                style={styles.browseButton}
              />
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.challengesContainer}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {acceptedChallenges.map((challenge, index) => (
              <Pressable 
                key={challenge.id}
                onPress={() => router.push({
                  pathname: '/complete/[id]',
                  params: { id: challenge.id }
                } as any)}
              >
                <View style={styles.challengeCard}>
                  <LinearGradient
                    colors={[
                      Colors.surface,
                      Colors.surface + 'dd',
                    ]}
                    style={styles.cardGradient}
                  >
                    {/* Top Section - Status & Time */}
                    <View style={styles.cardHeader}>
                      <View style={styles.statusBadge}>
                        <View style={styles.pulseIndicator} />
                        <Text style={styles.statusText}>IN PROGRESS</Text>
                      </View>
                      <View style={styles.timeBadge}>
                        <Clock size={14} color={Colors.warning} />
                        <Text style={styles.timeText}>{getTimeRemaining(challenge.expiresAt)}</Text>
                      </View>
                    </View>

                    {/* Challenge Content */}
                    <View style={styles.cardContent}>
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                      <Text style={styles.challengeDescription} numberOfLines={2}>
                        {challenge.description}
                      </Text>

                      {/* Prize & Difficulty Row */}
                      <View style={styles.metaRow}>
                        <View style={styles.prizeContainer}>
                          <LinearGradient
                            colors={[Colors.success + '30', Colors.success + '10']}
                            style={styles.prizeGradient}
                          >
                            <Trophy size={16} color={Colors.success} />
                            <Text style={styles.prizeValue}>{challenge.prizePool}</Text>
                            <Text style={styles.prizeCurrency}>DC</Text>
                          </LinearGradient>
                        </View>

                        <View style={styles.difficultyContainer}>
                          {[...Array(5)].map((_, i) => (
                            <View
                              key={i}
                              style={[
                                styles.difficultyDot,
                                i < challenge.difficulty && styles.difficultyDotActive
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                    </View>

                    {/* Action Button */}
                    <View style={styles.cardFooter}>
                      <LinearGradient
                        colors={[Colors.primary, Colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionButton}
                      >
                        <Zap size={20} color={Colors.text} fill={Colors.text} />
                        <Text style={styles.actionButtonText}>Complete Now</Text>
                      </LinearGradient>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '60%' }]} />
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <LinearGradient
            colors={[Colors.primary + '15', Colors.secondary + '10']}
            style={styles.tipsGradient}
          >
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <View style={styles.tipsList}>
              <TipItem 
                icon="⚡" 
                text="Complete challenges quickly for bonus points"
              />
              <TipItem 
                icon="📸" 
                text="Clear photos get verified faster"
              />
              <TipItem 
                icon="🎯" 
                text="Build a streak to unlock multipliers"
              />
              <TipItem 
                icon="🏆" 
                text="Complete 5 challenges to unlock premium features"
              />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function TipItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.tipItem}>
      <Text style={styles.tipIcon}>{icon}</Text>
      <Text style={styles.tipText}>{text}</Text>
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
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerContent: {
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background + 'cc',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background + 'cc',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  loadingState: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  loadingSpinner: {
    marginBottom: Spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    margin: Spacing.lg,
  },
  emptyGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  browseButton: {
    minWidth: 220,
  },
  challengesContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
  challengeCard: {
    marginBottom: Spacing.lg,
  },
  cardGradient: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
  },
  cardContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeContainer: {
    flex: 1,
  },
  prizeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
    alignSelf: 'flex-start',
  },
  prizeValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.success,
  },
  prizeCurrency: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  difficultyDotActive: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardFooter: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  progressBarContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  tipsSection: {
    margin: Spacing.lg,
    marginTop: Spacing.xl,
  },
  tipsGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  tipsList: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});