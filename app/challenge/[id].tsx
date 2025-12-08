// import { format, formatDistanceToNow } from 'date-fns';
// import * as Haptics from 'expo-haptics';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import Button from '../../components/common/Button';
// import { useAuth } from '../../contexts/AuthContext';
// import { ChallengeService } from '../../services/firebase/challenge.service';
// import { Challenge } from '../../types/challenges';
// import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';
// import { navigate } from 'expo-router/build/global-state/routing';


// export default function ChallengeDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const { user } = useAuth();
//   const router = useRouter();
//   const navigate = useNavigation();
//   const [challenge, setChallenge] = useState<Challenge | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [accepting, setAccepting] = useState(false);

//   const isAlreadyAccepted = challenge && challenge.acceptedBy !== null && challenge.acceptedBy !== undefined;
//   const isAcceptedByCurrentUser = challenge && challenge.acceptedBy === user?.id;

  

//   useEffect(() => {
//     loadChallenge();
//   }, [id]);

//   const loadChallenge = async () => {
//     if (!id) return;

//     try {
//       setLoading(true);
//       await ChallengeService.incrementViews(id);
//       const updated = await ChallengeService.getChallengeById(id);
//       setChallenge(updated);

//     } catch (error) {
//       console.error('Error loading challenge:', error);
//       Alert.alert('Error', 'Failed to load challenge');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAcceptChallenge = async () => {
//     console.log('🔘 Accept button clicked!');
//     console.log('Challenge:', challenge?.id);
//     console.log('User:', user?.id);
    
//     if (!challenge || !user) {
//       console.log('❌ Missing challenge or user:', { challenge: !!challenge, user: !!user });
//       Alert.alert('Error', 'Missing challenge or user data');
//       return;
//     }
  
//     // Using window.confirm for web compatibility
//     const confirmed = window.confirm(
//       "Accept Challenge?\n\nYou're about to accept this challenge. You have 24 hours to complete it."
//     );
  
//     if (!confirmed) {
//       console.log('❌ User cancelled');
//       return;
//     }
  
//     try {
//       console.log('✅ User confirmed acceptance');
//       console.log('🚀 Starting challenge acceptance...');
//       setAccepting(true);
      
//       console.log('📞 Calling ChallengeService.acceptChallenge with:', {
//         challengeId: challenge.id,
//         userId: user.id
//       });
      
//       await ChallengeService.acceptChallenge(challenge.id, user.id);
//       console.log('✅ Challenge accepted successfully');
      
//       await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//       console.log('🎯 Navigating to stream tab...');
      
//       router.replace('/(tabs)/stream');
//       console.log('✅ Navigation called');
      
//     } catch (error: any) {
//       console.error('❌ Error accepting challenge:', error);
//       console.error('Error details:', {
//         message: error.message,
//         code: error.code,
//         name: error.name
//       });
      
//       await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert("Error", error.message || "Failed to accept challenge");
//     } finally {
//       console.log('🏁 Accept process finished');
//       setAccepting(false);
//     }
//   };



//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading challenge...</Text>
//       </View>
//     );
//   }

//   if (!challenge) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorEmoji}>😕</Text>
//         <Text style={styles.errorTitle}>Challenge Not Found</Text>
//         <Text style={styles.errorDescription}>
//           This challenge may have been removed or expired.
//         </Text>
//         <Button title="Go Back" onPress={() => router.back()} />
//       </View>
//     );
//   }

//   const getCategoryColor = (category: string): string => {
//     const colors: Record<string, string> = {
//       creative: Colors.secondary,
//       social: Colors.primary,
//       fitness: Colors.success,
//       skill: Colors.accent,
//       adventure: Colors.danger,
//       random: Colors.warning,
//     };
//     return colors[category] || Colors.primary;
//   };

//   const isCreator = user?.id === challenge.creatorId;
//   const isExpired = new Date(challenge.expiresAt) < new Date();
//   const canAccept = challenge.status === 'active' && !isCreator && !isExpired;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={[getCategoryColor(challenge.category), Colors.background]}
//         style={styles.header}
//       >
//         <Pressable onPress={() => router.back()} style={styles.backButton}>
//           <Text style={styles.backButtonText}>← Back</Text>
//         </Pressable>

//         <View style={styles.headerBadges}>
//           <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(challenge.category) }]}>
//             <Text style={styles.categoryText}>{challenge.category}</Text>
//           </View>

//           {challenge.riskScore > 30 && (
//             <View style={[
//               styles.riskBadge,
//               { backgroundColor: challenge.riskScore > 60 ? Colors.danger : Colors.warning }
//             ]}>
//               <Text style={styles.riskBadgeText}>
//                 {challenge.riskScore > 60 ? 'High Risk' : 'Moderate'}
//               </Text>
//             </View>
//           )}
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Title & Difficulty */}
//         <View style={styles.titleSection}>
//           <Text style={styles.title}>{challenge.title}</Text>
//           <View style={styles.difficultyRow}>
//             <Text style={styles.difficultyLabel}>Difficulty:</Text>
//             {[...Array(5)].map((_, i) => (
//               <Text key={i} style={styles.star}>
//                 {i < challenge.difficulty ? '⭐' : '☆'}
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Challenge Description</Text>
//           <Text style={styles.description}>{challenge.description}</Text>
//         </View>

//         {/* Prize Pool */}
//         <View style={styles.prizeSection}>
//           <LinearGradient
//             colors={['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.05)']}
//             style={styles.prizeCard}
//           >
//             <Text style={styles.prizeLabel}>Prize Pool</Text>
//             <View style={styles.prizeAmountRow}>
//               <Text style={styles.prizeEmoji}>🪙</Text>
//               <Text style={styles.prizeAmount}>{challenge.prizePool}</Text>
//               <Text style={styles.prizeCurrency}>DCoins</Text>
//             </View>
//             <Text style={styles.prizeUSD}>
//               ≈ ${(challenge.prizePool * 0.01).toFixed(2)} USD
//             </Text>
//           </LinearGradient>
//         </View>

//         {/* Challenge Info */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Challenge Info</Text>
//           <View style={styles.infoGrid}>
//             <InfoItem
//               icon="👤"
//               label="Creator"
//               value={challenge.creatorName}
//             />
//             <InfoItem
//               icon="⏱️"
//               label="Expires"
//               value={formatDistanceToNow(challenge.expiresAt, { addSuffix: true })}
//             />
//             <InfoItem
//               icon="👁️"
//               label="Views"
//               value={challenge.views.toString()}
//             />
//             <InfoItem
//               icon="🎯"
//               label="Completions"
//               value={challenge.completions.toString()}
//             />
//             <InfoItem
//               icon="📅"
//               label="Created"
//               value={format(challenge.createdAt, 'MMM d, yyyy')}
//             />
//             <InfoItem
//               icon="🏆"
//               label="Model"
//               value={challenge.prizeModel.replace('_', ' ')}
//             />
//           </View>
//         </View>

//         {/* AI Analysis */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Safety Analysis</Text>
//           <View style={styles.aiAnalysisCard}>
//             <View style={styles.aiHeader}>
//               <Text style={styles.aiEmoji}>
//                 {challenge.aiAnalysis.approved ? '✅' : '⚠️'}
//               </Text>
//               <View style={styles.aiHeaderText}>
//                 <Text style={styles.aiTitle}>
//                   {challenge.aiAnalysis.approved ? 'AI Approved' : 'Flagged by AI'}
//                 </Text>
//                 <Text style={styles.aiSubtitle}>
//                   Risk Score: {challenge.riskScore}/100
//                 </Text>
//               </View>
//             </View>

//             {/* Risk Breakdown */}
//             <View style={styles.riskBreakdown}>
//               <RiskBar
//                 label="Physical Safety"
//                 score={challenge.aiAnalysis.physicalSafetyScore}
//               />
//               <RiskBar
//                 label="Legal Compliance"
//                 score={challenge.aiAnalysis.legalComplianceScore}
//               />
//               <RiskBar
//                 label="Social Appropriate"
//                 score={challenge.aiAnalysis.socialAppropriatenessScore}
//               />
//               <RiskBar
//                 label="Privacy"
//                 score={challenge.aiAnalysis.privacyConcernsScore}
//               />
//             </View>

//             {challenge.aiAnalysis?.flags?.length > 0 && (
//               <View style={styles.flagsSection}>
//                 <Text style={styles.flagsTitle}>Flags:</Text>
//                 {challenge.aiAnalysis.flags.map((flag, index) => (
//                   <View key={index} style={styles.flagItem}>
//                     <Text style={styles.flagEmoji}>
//                       {flag.type === 'danger' ? '🚨' : flag.type === 'warning' ? '⚠️' : 'ℹ️'}
//                     </Text>
//                     <Text style={styles.flagText}>{flag.message}</Text>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Status Badge */}
//         {challenge.status !== 'active' && (
//           <View style={styles.statusBanner}>
//             <Text style={styles.statusText}>
//               Status: {challenge.status.replace('_', ' ').toUpperCase()}
//             </Text>
//           </View>
//         )}

//         {/* Bottom Padding */}
//         <View style={{ height: 120 }} />
//       </ScrollView>

//       {/* Bottom Action Bar */}
//       {canAccept && (
//         <View style={styles.bottomBar}>
//           <LinearGradient
//             colors={[Colors.background, 'rgba(10, 14, 39, 0.95)']}
//             style={styles.bottomBarGradient}
//           >
//             <View style={styles.bottomBarContent}>
//               <View style={styles.bottomBarInfo}>
//                 <Text style={styles.bottomBarLabel}>You will Win</Text>
//                 <Text style={styles.bottomBarValue}>{challenge.prizePool} DC</Text>
//               </View>
//               <Button
//                 title={accepting ? "Accepting..." : "Accept Challenge"}
//                 onPress={handleAcceptChallenge}
//                 loading={accepting}
//                 icon="🎯"
//                 style={styles.acceptButton}
//               />
//             </View>
//           </LinearGradient>
//         </View>
//       )}

      

//       {/* Show if already accepted by someone else */}
//       {isAlreadyAccepted && !isAcceptedByCurrentUser && (
//         <View style={styles.bottomBar}>
//           <View style={[styles.bottomBarContent, styles.acceptedBar]}>
//             <Text style={styles.acceptedText}>
//               ⏳ Challenge already accepted by someone else
//             </Text>
//           </View>
//         </View>
//       )}


//       {isCreator && (
//         <View style={styles.bottomBar}>
//           <View style={styles.bottomBarContent}>
//             <Text style={styles.creatorText}>This is your challenge</Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
//   return (
//     <View style={styles.infoItem}>
//       <Text style={styles.infoIcon}>{icon}</Text>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   );
// }

// function RiskBar({ label, score }: { label: string; score: number }) {
//   const getColor = (score: number) => {
//     if (score <= 30) return Colors.success;
//     if (score <= 60) return Colors.warning;
//     return Colors.danger;
//   };

//   return (
//     <View style={styles.riskBarContainer}>
//       <Text style={styles.riskBarLabel}>{label}</Text>
//       <View style={styles.riskBarTrack}>
//         <View
//           style={[
//             styles.riskBarFill,
//             { width: `${score}%`, backgroundColor: getColor(score) },
//           ]}
//         />
//       </View>
//       <Text style={styles.riskBarValue}>{score}</Text>
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
//   errorContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: Spacing.xl,
//   },
//   errorEmoji: {
//     fontSize: 80,
//     marginBottom: Spacing.lg,
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   errorDescription: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: Spacing.xl,
//   },
//   header: {
//     paddingTop: 60,
//     paddingBottom: Spacing.xl,
//     paddingHorizontal: Spacing.lg,
//   },
//   backButton: {
//     marginBottom: Spacing.lg,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '600',
//   },
//   headerBadges: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   categoryBadge: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.full,
//   },
//   categoryText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: Colors.text,
//     textTransform: 'uppercase',
//   },
//   riskBadge: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.full,
//   },
//   riskBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   content: {
//     flex: 1,
//   },
//   titleSection: {
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//     lineHeight: 36,
//   },
//   difficultyRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   difficultyLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginRight: Spacing.sm,
//   },
//   star: {
//     fontSize: 16,
//     marginRight: 2,
//   },
//   section: {
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   description: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     lineHeight: 24,
//   },
//   prizeSection: {
//     padding: Spacing.lg,
//   },
//   prizeCard: {
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.xl,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.success + '40',
//   },
//   prizeLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.sm,
//   },
//   prizeAmountRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.xs,
//   },
//   prizeEmoji: {
//     fontSize: 32,
//     marginRight: Spacing.sm,
//   },
//   prizeAmount: {
//     fontSize: 48,
//     fontWeight: '800',
//     color: Colors.success,
//   },
//   prizeCurrency: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//     marginLeft: Spacing.sm,
//   },
//   prizeUSD: {
//     fontSize: 14,
//     color: Colors.textMuted,
//   },
//   infoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: Spacing.md,
//   },
//   infoItem: {
//     width: '47%',
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   infoIcon: {
//     fontSize: 24,
//     marginBottom: Spacing.xs,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//   },
//   aiAnalysisCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   aiHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   aiEmoji: {
//     fontSize: 32,
//     marginRight: Spacing.md,
//   },
//   aiHeaderText: {
//     flex: 1,
//   },
//   aiTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   aiSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   riskBreakdown: {
//     gap: Spacing.md,
//     marginBottom: Spacing.lg,
//   },
//   riskBarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   riskBarLabel: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     width: 100,
//   },
//   riskBarTrack: {
//     flex: 1,
//     height: 8,
//     backgroundColor: Colors.border,
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   riskBarFill: {
//     height: '100%',
//     borderRadius: 4,
//   },
//   riskBarValue: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: Colors.text,
//     width: 30,
//     textAlign: 'right',
//   },
//   flagsSection: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingTop: Spacing.md,
//   },
//   flagsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   flagItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: Spacing.sm,
//   },
//   flagEmoji: {
//     fontSize: 16,
//     marginRight: Spacing.sm,
//   },
//   flagText: {
//     flex: 1,
//     fontSize: 13,
//     color: Colors.textSecondary,
//     lineHeight: 18,
//   },
//   statusBanner: {
//     margin: Spacing.lg,
//     padding: Spacing.md,
//     backgroundColor: Colors.warning + '20',
//     borderRadius: BorderRadius.md,
//     borderWidth: 1,
//     borderColor: Colors.warning,
//     alignItems: 'center',
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.warning,
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   bottomBarGradient: {
//     paddingTop: Spacing.lg,
//     paddingBottom: Spacing.xl,
//     paddingHorizontal: Spacing.lg,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   bottomBarContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   bottomBarInfo: {
//     flex: 1,
//   },
//   bottomBarLabel: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginBottom: 4,
//   },
//   bottomBarValue: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: Colors.success,
//   },
//   acceptButton: {
//     flex: 1,
//     marginLeft: Spacing.md,
//   },
//   creatorText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//     textAlign: 'center',
//   },
//   acceptedBar: {
//     backgroundColor: Colors.warning + '20',
//     padding: Spacing.lg,
//     justifyContent: 'center',
//     borderTopWidth: 1,
//     borderTopColor: Colors.warning,
//   },
//   acceptedText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.warning,
//     textAlign: 'center',
//   },
//   yourChallengeBar: {
//     backgroundColor: Colors.success + '20',
//     padding: Spacing.lg,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderTopWidth: 1,
//     borderTopColor: Colors.success,
//   },
//   yourChallengeText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.success,
//   },
//   expiredBar: {
//     backgroundColor: Colors.danger + '20',
//     padding: Spacing.lg,
//     justifyContent: 'center',
//     borderTopWidth: 1,
//     borderTopColor: Colors.danger,
//   },
//   expiredText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.danger,
//     textAlign: 'center',
//   },
// });

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
import { 
  ChevronLeft, 
  Trophy, 
  Eye, 
  Target, 
  Calendar, 
  User, 
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
  Award
} from 'lucide-react-native';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  const isAlreadyAccepted = challenge && challenge.acceptedBy !== null && challenge.acceptedBy !== undefined;
  const isAcceptedByCurrentUser = challenge && challenge.acceptedBy === user?.id;

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await ChallengeService.incrementViews(id);
      const updated = await ChallengeService.getChallengeById(id);
      setChallenge(updated);
    } catch (error) {
      console.error('Error loading challenge:', error);
      Alert.alert('Error', 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = async () => {
    if (!challenge || !user) {
      Alert.alert('Error', 'Missing challenge or user data');
      return;
    }

    const confirmed = window.confirm(
      "Accept Challenge?\n\nYou're about to accept this challenge. You have 24 hours to complete it."
    );

    if (!confirmed) return;

    try {
      setAccepting(true);
      await ChallengeService.acceptChallenge(challenge.id, user.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/stream');
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to accept challenge");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.loadingGradient}>
          <Zap size={60} color={Colors.text} />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconWrapper}>
          <AlertTriangle size={80} color={Colors.danger} strokeWidth={1.5} />
        </View>
        <Text style={styles.errorTitle}>Challenge Not Found</Text>
        <Text style={styles.errorDescription}>
          This challenge may have been removed or expired.
        </Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const getCategoryColor = (category: string): [string, string] => {
    const colors: Record<string, [string, string]> = {
      creative: ['#A020F0', '#C850C0'],
      social: ['#0080FF', '#00D4FF'],
      fitness: ['#00FF88', '#00CC6A'],
      skill: ['#FFD700', '#FFA500'],
      adventure: ['#FF4444', '#FF6B6B'],
      random: ['#FFA500', '#FF6347'],
    };
    return colors[category] || [Colors.primary, Colors.secondary];
  };

  const isCreator = user?.id === challenge.creatorId;
  const isExpired = new Date(challenge.expiresAt) < new Date();
  const canAccept = challenge.status === 'active' && !isCreator && !isExpired && !isAlreadyAccepted;

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <LinearGradient
        colors={[...getCategoryColor(challenge.category), Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backButtonInner}>
            <ChevronLeft size={24} color={Colors.text} strokeWidth={2.5} />
          </View>
        </Pressable>

        <View style={styles.headerBadges}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{challenge.category}</Text>
          </View>
          {challenge.riskScore > 30 && (
            <View style={[styles.riskBadge, challenge.riskScore > 60 && styles.riskBadgeHigh]}>
              <AlertTriangle size={12} color={Colors.text} />
              <Text style={styles.riskBadgeText}>
                {challenge.riskScore > 60 ? 'High Risk' : 'Moderate'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{challenge.title}</Text>
          <View style={styles.difficultyRow}>
            {[...Array(5)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.difficultyDot,
                  i < challenge.difficulty && styles.difficultyDotActive
                ]}
              />
            ))}
            <Text style={styles.difficultyText}>Level {challenge.difficulty}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Description Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Challenge Description</Text>
          </View>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        {/* Prize Card */}
        <LinearGradient
          colors={[Colors.success + '30', Colors.success + '10']}
          style={styles.prizeCard}
        >
          <View style={styles.prizeIconWrapper}>
            <Trophy size={40} color={Colors.success} />
          </View>
          <Text style={styles.prizeLabel}>Prize Pool</Text>
          <View style={styles.prizeAmountRow}>
            <Text style={styles.prizeAmount}>{challenge.prizePool}</Text>
            <Text style={styles.prizeCurrency}>DC</Text>
          </View>
          <Text style={styles.prizeUSD}>≈ ${(challenge.prizePool * 0.01).toFixed(2)} USD</Text>
        </LinearGradient>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <InfoCard icon={<User size={20} color={Colors.primary} />} label="Creator" value={challenge.creatorName} />
          <InfoCard icon={<Clock size={20} color={Colors.warning} />} label="Expires" value={formatDistanceToNow(challenge.expiresAt, { addSuffix: true })} />
          <InfoCard icon={<Eye size={20} color={Colors.secondary} />} label="Views" value={challenge.views.toString()} />
          <InfoCard icon={<Target size={20} color={Colors.success} />} label="Completions" value={challenge.completions.toString()} />
        </View>

        {/* Safety Analysis Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Shield size={20} color={challenge.aiAnalysis.approved ? Colors.success : Colors.warning} />
            <Text style={styles.cardTitle}>Safety Analysis</Text>
          </View>

          <View style={styles.aiStatusRow}>
            {challenge.aiAnalysis.approved ? (
              <CheckCircle size={24} color={Colors.success} fill={Colors.success} />
            ) : (
              <AlertTriangle size={24} color={Colors.warning} />
            )}
            <View style={styles.aiStatusText}>
              <Text style={styles.aiStatusTitle}>
                {challenge.aiAnalysis.approved ? 'AI Approved' : 'Flagged by AI'}
              </Text>
              <Text style={styles.aiStatusSubtitle}>
                Risk Score: {challenge.riskScore}/100
              </Text>
            </View>
          </View>

          <View style={styles.riskBars}>
            <RiskBar label="Physical Safety" score={challenge.aiAnalysis.physicalSafetyScore} />
            <RiskBar label="Legal Compliance" score={challenge.aiAnalysis.legalComplianceScore} />
            <RiskBar label="Social Appropriate" score={challenge.aiAnalysis.socialAppropriatenessScore} />
            <RiskBar label="Privacy" score={challenge.aiAnalysis.privacyConcernsScore} />
          </View>

          {challenge.aiAnalysis?.flags?.length > 0 && (
            <View style={styles.flagsSection}>
              <Text style={styles.flagsTitle}>⚠️ Flags</Text>
              {challenge.aiAnalysis.flags.map((flag, index) => (
                <View key={index} style={styles.flagItem}>
                  <View style={[styles.flagDot, flag.type === 'danger' && styles.flagDotDanger]} />
                  <Text style={styles.flagText}>{flag.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {challenge.status !== 'active' && (
          <View style={styles.statusCard}>
            <AlertTriangle size={20} color={Colors.warning} />
            <Text style={styles.statusText}>
              Status: {challenge.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Action Bar */}
      {canAccept && (
        <View style={styles.floatingBar}>
          <LinearGradient
            colors={['rgba(10, 14, 39, 0.95)', 'rgba(10, 14, 39, 0.98)']}
            style={styles.floatingBarInner}
          >
            <View style={styles.floatingBarLeft}>
              <Text style={styles.floatingBarLabel}>Prize Pool</Text>
              <View style={styles.floatingBarAmountRow}>
                <Trophy size={20} color={Colors.success} />
                <Text style={styles.floatingBarAmount}>{challenge.prizePool}</Text>
                <Text style={styles.floatingBarCurrency}>DC</Text>
              </View>
            </View>
            <Pressable
              style={styles.acceptButtonWrapper}
              onPress={handleAcceptChallenge}
              disabled={accepting}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.acceptButtonGradient}
              >
                {accepting ? (
                  <ActivityIndicator color={Colors.text} />
                ) : (
                  <>
                    <Zap size={20} color={Colors.text} fill={Colors.text} />
                    <Text style={styles.acceptButtonText}>Accept Challenge</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </View>
      )}

      {isAlreadyAccepted && !isAcceptedByCurrentUser && (
        <View style={styles.floatingBar}>
          <View style={[styles.floatingBarInner, styles.acceptedBar]}>
            <Clock size={20} color={Colors.warning} />
            <Text style={styles.acceptedText}>Challenge already accepted</Text>
          </View>
        </View>
      )}

      {isCreator && (
        <View style={styles.floatingBar}>
          <View style={[styles.floatingBarInner, styles.creatorBar]}>
            <Award size={20} color={Colors.primary} />
            <Text style={styles.creatorText}>This is your challenge</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIconWrapper}>{icon}</View>
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
        <LinearGradient
          colors={[getColor(score), getColor(score) + 'cc']}
          style={[styles.riskBarFill, { width: `${score}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <Text style={styles.riskBarValue}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingGradient: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  loadingText: { fontSize: 16, fontWeight: '700', color: Colors.text, marginTop: Spacing.md },
  errorContainer: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  errorIconWrapper: { marginBottom: Spacing.xl },
  errorTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, marginBottom: Spacing.sm, textAlign: 'center' },
  errorDescription: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 24 },
  heroHeader: { paddingTop: 60, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.lg, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl },
  backButton: { marginBottom: Spacing.lg },
  backButtonInner: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center' },
  headerBadges: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  categoryBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  categoryText: { fontSize: 12, fontWeight: '800', color: Colors.text, textTransform: 'uppercase', letterSpacing: 0.5 },
  riskBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.warning + '40', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, gap: 4 },
  riskBadgeHigh: { backgroundColor: Colors.danger + '40' },
  riskBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.text, textTransform: 'uppercase' },
  titleSection: { marginTop: Spacing.md },
  title: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: Spacing.md, lineHeight: 40, letterSpacing: -0.5 },
  difficultyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  difficultyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  difficultyDotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.text },
  difficultyText: { fontSize: 13, fontWeight: '700', color: Colors.text, marginLeft: Spacing.sm },
  content: { flex: 1 },
  card: { margin: Spacing.lg, padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
  prizeCard: { margin: Spacing.lg, marginTop: 0, padding: Spacing.xl, borderRadius: BorderRadius.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.success + '40' },
  prizeIconWrapper: { marginBottom: Spacing.md },
  prizeLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: Spacing.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  prizeAmountRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.xs },
  prizeAmount: { fontSize: 48, fontWeight: '900', color: Colors.success },
  prizeCurrency: { fontSize: 20, fontWeight: '700', color: Colors.textSecondary, marginLeft: Spacing.sm },
  prizeUSD: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, paddingHorizontal: Spacing.lg },
  infoCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  infoIconWrapper: { marginBottom: Spacing.sm },
  infoLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 16, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  aiStatusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg, padding: Spacing.md, backgroundColor: Colors.background, borderRadius: BorderRadius.lg },
  aiStatusText: { flex: 1 },
  aiStatusTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  aiStatusSubtitle: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  riskBars: { gap: Spacing.md },
  riskBarContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  riskBarLabel: { fontSize: 12, color: Colors.textSecondary, width: 110, fontWeight: '600' },
  riskBarTrack: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  riskBarFill: { height: '100%', borderRadius: 4 },
  riskBarValue: { fontSize: 13, fontWeight: '800', color: Colors.text, width: 35, textAlign: 'right' },
  flagsSection: { marginTop: Spacing.lg, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border },
  flagsTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  flagItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm, gap: Spacing.sm },
  flagDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warning, marginTop: 6 },
  flagDotDanger: { backgroundColor: Colors.danger },
  flagText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  statusCard: { margin: Spacing.lg, padding: Spacing.md, backgroundColor: Colors.warning + '20', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.warning, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  statusText: { fontSize: 14, fontWeight: '700', color: Colors.warning, textTransform: 'uppercase' },
  floatingBar: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  floatingBarInner: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: Colors.border },
  floatingBarLeft: { flex: 1 },
  floatingBarLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4, fontWeight: '600' },
  floatingBarAmountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  floatingBarAmount: { fontSize: 24, fontWeight: '900', color: Colors.success },
  floatingBarCurrency: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  acceptButtonWrapper: { marginLeft: Spacing.md },
  acceptButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.sm, minWidth: 180 },
  acceptButtonText: { fontSize: 15, fontWeight: '800', color: Colors.text, letterSpacing: 0.3 },
  acceptedBar: { backgroundColor: Colors.warning + '20', borderColor: Colors.warning, justifyContent: 'center' },
  acceptedText: { fontSize: 15, fontWeight: '700', color: Colors.warning, textAlign: 'center', flex: 1 },
  creatorBar: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary, justifyContent: 'center' },
  creatorText: { fontSize: 15, fontWeight: '700', color: Colors.primary, textAlign: 'center', flex: 1 },
});