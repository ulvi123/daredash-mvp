// import * as Haptics from 'expo-haptics';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import Button from '../../components/common/Button';
// import DCoinBalance from '../../components/token/DcoinBalance';
// import { useAuth } from '../../contexts/AuthContext';
// import { ModerationService } from '../../services/ai/moderations.service';
// import { ChallengeService } from '../../services/firebase/challenge.service';
// import { AIAnalysis } from '../../types/aianalysis';
// import { ChallengeCategory, ChallengeDifficulty, PrizeModel } from '../../types/challenges';
// import { Config } from '../../utils/constants/config';
// import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';








// type Step = 'category' | 'details' | 'economics' | 'moderation' | 'success';

// export default function CreateChallengeScreen() {
//   const { user, refreshUser } = useAuth();
//   const router = useRouter()

//   // Form state
//   const [currentStep, setCurrentStep] = useState<Step>('category');
//   const [category, setCategory] = useState<ChallengeCategory | null>(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(3);
//   const [stakeAmount, setStakeAmount] = useState('50');
//   const [prizeModel, setPrizeModel] = useState<PrizeModel>('single_winner');

//   // AI Moderation state
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysis, setAnalysis] = useState<any>(null);

//   // Creation state
//   const [isCreating, setIsCreating] = useState(false);
//   const [createdChallengeId, setCreatedChallengeId] = useState<string | null>(null);

//   const categories: { value: ChallengeCategory; label: string; emoji: string; color: string }[] = [
//     { value: 'creative', label: 'Creative', emoji: '🎨', color: Colors.secondary },
//     { value: 'social', label: 'Social', emoji: '🤝', color: Colors.primary },
//     { value: 'fitness', label: 'Fitness', emoji: '💪', color: Colors.success },
//     { value: 'skill', label: 'Skill', emoji: '🎯', color: Colors.accent },
//     { value: 'adventure', label: 'Adventure', emoji: '🏔️', color: Colors.danger },
//     { value: 'random', label: 'Random', emoji: '🎲', color: Colors.warning },
//   ];

//   const handleAnalyze = async () => {
//     if (!category || !title.trim() || !description.trim()) {
//       Alert.alert('Missing Info', 'Please fill in all required fields');
//       return;
//     }

//     setIsAnalyzing(true);
//     setCurrentStep('moderation');

//     try {
//       const result = await ModerationService.analyzeChallenge(description, category);
//       setAnalysis(result);
//       Haptics.notificationAsync(
//         result.approved
//           ? Haptics.NotificationFeedbackType.Success
//           : Haptics.NotificationFeedbackType.Warning
//       );
//     } catch (error) {
//       Alert.alert('Error', 'Failed to analyze challenge. Please try again.');
//       console.error('Moderation analysis error:', error);
//       setCurrentStep('economics');
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   // !analysis has been removed fro now
//   const handleCreate = async () => {
//     console.log('🚀 handleCreate called');

//     if (!user || !category) {
//       console.log('❌ Missing user or category:', { hasUser: !!user, category });
//       Alert.alert('Error', 'Missing user or category');
//       setCurrentStep('economics');
//       setIsCreating(false);
//       return;
//     }

//     console.log('✅ User and category OK');

//     const stake = parseInt(stakeAmount);
//     console.log('💰 Stake validation:', {
//       stake,
//       min: Config.MIN_CHALLENGE_STAKE,
//       userBalance: user.dcoins,
//       hasEnough: user.dcoins >= stake
//     });

//     if (isNaN(stake) || stake < Config.MIN_CHALLENGE_STAKE) {
//       console.log('❌ Invalid stake amount');
//       Alert.alert('Invalid Stake', `Minimum stake is ${Config.MIN_CHALLENGE_STAKE} DCoins`);
//       setCurrentStep('economics');
//       setIsCreating(false);
//       return;
//     }

//     if (user.dcoins < stake) {
//       console.log('❌ Insufficient balance');
//       Alert.alert(
//         'Insufficient DCoins',
//         `You need ${stake} DCoins but only have ${user.dcoins} DCoins.\n\nPlease purchase more DCoins or reduce your stake amount.`
//       );
//       setCurrentStep('economics');
//       setIsCreating(false);
//       return;
//     }

//     console.log('✅ Stake validation passed - proceeding with creation');

//     setIsCreating(true);
//     console.log('🔄 setIsCreating(true) called');

//     const finalAnalysis: AIAnalysis = analysis || {
//       approved: true,
//       overallRiskScore: 29,
//       physicalSafetyScore: 100,
//       legalComplianceScore: 100,
//       socialAppropriatenessScore: 100,
//       privacyConcernsScore: 100,
//       flags: [{
//         type: 'danger',
//         category: 'other',
//         message: 'Challenge created without AI moderation.',
//         severity: 10
//       }],
//       suggestions: ['Challenge pending manual review.'],
//       modelUsed: 'fallback',
//       analysisTimestamp: new Date(),
//       processingTimeMs: 0
//     };

//     try {
//       console.log('📝 Calling ChallengeService.createChallenge...');

//       const challengeId = await ChallengeService.createChallenge(
//         user.id,
//         user.displayName,
//         user.avatarUrl,
//         title,
//         description,
//         category,
//         difficulty,
//         stake,
//         prizeModel,
//         finalAnalysis,
//         168
//       );

//       console.log('✅ Challenge created successfully! ID:', challengeId);

//       setCreatedChallengeId(challengeId);
//       setCurrentStep('success');

//       console.log('🔄 Refreshing user...');
//       await refreshUser();
//       console.log('✅ User refreshed');

//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     } catch (error: any) {
//       console.error('❌ Challenge creation error:', error);
//       console.error('Error message:', error.message);
//       console.error('Error stack:', error.stack);
//       Alert.alert('Error', error.message || 'Failed to create challenge');
//       setCurrentStep('economics');
//     } finally {
//       console.log('🏁 setIsCreating(false) called');
//       setIsCreating(false);
//     }
//   };
//   const resetForm = () => {
//     setCurrentStep('category');
//     setCategory(null);
//     setTitle('');
//     setDescription('');
//     setDifficulty(3);
//     setStakeAmount('1000');
//     setAnalysis(null);
//     setCreatedChallengeId(null);
//   };

//   const handleGoToFeed = () => {
//     router.push('/(tabs)');  // Navigate to home/feed
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient colors={[Colors.surface, Colors.background]} style={styles.header}>
//         <Text style={styles.headerTitle}>Create Challenge</Text>
//         {user && <DCoinBalance balance={user.dcoins} size="small" />}
//       </LinearGradient>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Step 1: Category Selection */}
//         {currentStep === 'category' && (
//           <View style={styles.step}>
//             <Text style={styles.stepTitle}>Choose Category</Text>
//             <Text style={styles.stepDescription}>What type of challenge is this?</Text>

//             <View style={styles.categoryGrid}>
//               {categories.map((cat) => (
//                 <Pressable
//                   key={cat.value}
//                   style={[
//                     styles.categoryCard,
//                     category === cat.value && styles.categoryCardSelected,
//                   ]}
//                   onPress={() => {
//                     setCategory(cat.value);
//                     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                   }}
//                 >
//                   <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
//                   <Text style={styles.categoryLabel}>{cat.label}</Text>
//                   {category === cat.value && (
//                     <View style={[styles.checkmark, { backgroundColor: cat.color }]}>
//                       <Text style={styles.checkmarkText}>✓</Text>
//                     </View>
//                   )}
//                 </Pressable>
//               ))}
//             </View>

//             <Button
//               title="Next"
//               onPress={() => {
//                 if (!category) {
//                   Alert.alert('Select Category', 'Please choose a category first');
//                   return;
//                 }
//                 setCurrentStep('details');
//               }}
//               disabled={!category}
//               fullWidth
//             />
//           </View>
//         )}

//         {/* Step 2: Challenge Details */}
//         {currentStep === 'details' && (
//           <View style={styles.step}>
//             <Text style={styles.stepTitle}>Challenge Details</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Title *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Give your challenge a catchy title"
//                 placeholderTextColor={Colors.textMuted}
//                 value={title}
//                 onChangeText={setTitle}
//                 maxLength={60}
//               />
//               <Text style={styles.charCount}>{title.length}/60</Text>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Description *</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Describe the challenge in detail..."
//                 placeholderTextColor={Colors.textMuted}
//                 value={description}
//                 onChangeText={setDescription}
//                 multiline
//                 numberOfLines={6}
//                 maxLength={500}
//                 textAlignVertical="top"
//               />
//               <Text style={styles.charCount}>{description.length}/500</Text>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Difficulty</Text>
//               <View style={styles.difficultySelector}>
//                 {[1, 2, 3, 4, 5].map((level) => (
//                   <Pressable
//                     key={level}
//                     style={[
//                       styles.difficultyButton,
//                       difficulty === level && styles.difficultyButtonSelected,
//                     ]}
//                     onPress={() => {
//                       setDifficulty(level as ChallengeDifficulty);
//                       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                     }}
//                   >
//                     <Text style={styles.difficultyEmoji}>
//                       {level <= 2 ? '😊' : level === 3 ? '😐' : level === 4 ? '😰' : '🔥'}
//                     </Text>
//                     <Text style={styles.difficultyLevel}>{level}</Text>
//                   </Pressable>
//                 ))}
//               </View>
//             </View>

//             <View style={styles.buttonRow}>
//               <Button title="Back" onPress={() => setCurrentStep('category')} variant="outline" />
//               <Button
//                 title="Next"
//                 onPress={() => {
//                   if (!title.trim() || !description.trim()) {
//                     Alert.alert('Missing Info', 'Please fill in all fields');
//                     return;
//                   }
//                   setCurrentStep('economics');
//                 }}
//               />
//             </View>
//           </View>
//         )}

//         {/* Step 3: Economics */}
//         {/* Step 3: Economics */}
//         {currentStep === 'economics' && (
//           <View style={styles.step}>
//             <Text style={styles.stepTitle}>Set Rewards</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Stake Amount (DCoins)</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder={`Min: ${Config.MIN_CHALLENGE_STAKE}`}
//                 placeholderTextColor={Colors.textMuted}
//                 value={stakeAmount}
//                 onChangeText={setStakeAmount}
//                 keyboardType="numeric"
//               />
//               <View style={styles.economicsBreakdown}>
//                 <View style={styles.breakdownRow}>
//                   <Text style={styles.breakdownLabel}>Your Stake:</Text>
//                   <Text style={styles.breakdownValue}>{stakeAmount} DC</Text>
//                 </View>
//                 <View style={styles.breakdownRow}>
//                   <Text style={styles.breakdownLabel}>Platform Fee (15%):</Text>
//                   <Text style={[styles.breakdownValue, { color: Colors.danger }]}>
//                     -{Math.floor(parseInt(stakeAmount || '0') * 0.15)} DC
//                   </Text>
//                 </View>
//                 <View style={[styles.breakdownRow, styles.breakdownTotal]}>
//                   <Text style={styles.breakdownLabel}>Prize Pool:</Text>
//                   <Text style={[styles.breakdownValue, { color: Colors.success, fontWeight: '700' }]}>
//                     {Math.floor(parseInt(stakeAmount || '0') * 0.85)} DC
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.buttonRow}>
//               <Button title="Back" onPress={() => setCurrentStep('details')} variant="outline" />
//               <Button
//                 title="Create Challenge"
//                 onPress={() => {
//                   setAnalysis(null);
//                   setCurrentStep('moderation');
//                   // Small delay to ensure state updates before calling handleCreate
//                   setTimeout(() => handleCreate(), 50);
//                 }}
//                 loading={isCreating}
//               />
//             </View>
//           </View>
//         )}

//         {/* Step 4: AI Moderation */}
//         {currentStep === 'moderation' && (
//           <View style={styles.step}>
//             {isAnalyzing ? (
//               <View style={styles.analyzing}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//                 <Text style={styles.analyzingText}>AI analyzing challenge safety...</Text>
//               </View>
//             ) : isCreating ? (
//               <View style={styles.analyzing}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//                 <Text style={styles.analyzingText}>Creating your challenge...</Text>
//               </View>
//             ) : analysis ? (
//               <View>
//                 <View style={[
//                   styles.resultCard,
//                   { borderColor: analysis.approved ? Colors.success : Colors.danger }
//                 ]}>
//                   <Text style={styles.resultEmoji}>
//                     {analysis.approved ? '✅' : '⚠️'}
//                   </Text>
//                   <Text style={styles.resultTitle}>
//                     {analysis.approved ? 'Challenge Approved!' : 'Safety Concerns Detected'}
//                   </Text>
//                   <View style={styles.riskScore}>
//                     <Text style={styles.riskScoreLabel}>Risk Score:</Text>
//                     <Text style={[
//                       styles.riskScoreValue,
//                       { color: ModerationService.getRiskLevelColor(analysis.overallRiskScore) }
//                     ]}>
//                       {analysis.overallRiskScore}/100
//                     </Text>
//                   </View>
//                 </View>

//                 {analysis.flags.length > 0 && (
//                   <View style={styles.flagsSection}>
//                     <Text style={styles.sectionTitle}>Issues Found:</Text>
//                     {analysis.flags.map((flag: any, index: number) => (
//                       <View key={index} style={styles.flagItem}>
//                         <Text style={styles.flagEmoji}>
//                           {flag.type === 'danger' ? '🚨' : flag.type === 'warning' ? '⚠️' : 'ℹ️'}
//                         </Text>
//                         <Text style={styles.flagText}>{flag.message}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 )}

//                 {analysis.suggestions.length > 0 && (
//                   <View style={styles.suggestionsSection}>
//                     <Text style={styles.sectionTitle}>Suggestions:</Text>
//                     {analysis.suggestions.map((suggestion: string, index: number) => (
//                       <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
//                     ))}
//                   </View>
//                 )}

//                 <View style={styles.buttonRow}>
//                   <Button title="Edit" onPress={() => setCurrentStep('details')} variant="outline" />
//                   <Button
//                     title={analysis.approved ? "Create Challenge" : "Create Anyway"}
//                     onPress={handleCreate}
//                     loading={isCreating}
//                     variant={analysis.approved ? 'primary' : 'danger'}
//                   />
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.analyzing}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//                 <Text style={styles.analyzingText}>Preparing challenge...</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Step 5: Success */}
//         {currentStep === 'success' && (
//           <View style={styles.step}>
//             <View style={styles.successCard}>
//               <Text style={styles.successEmoji}>🎉</Text>
//               <Text style={styles.successTitle}>Challenge Created!</Text>
//               <Text style={styles.successDescription}>
//                 Your challenge is now live and others can start completing it.
//               </Text>
//               <View style={styles.successStats}>
//                 <View style={styles.successStat}>
//                   <Text style={styles.successStatValue}>{stakeAmount}</Text>
//                   <Text style={styles.successStatLabel}>DCoins Staked</Text>
//                 </View>
//                 <View style={styles.successStat}>
//                   <Text style={styles.successStatValue}>{Math.floor(parseInt(stakeAmount) * 0.85)}</Text>
//                   <Text style={styles.successStatLabel}>Prize Pool</Text>
//                 </View>
//               </View>

//               {/* Replace this single button: */}
//               {/* <Button title="Create Another" onPress={resetForm} fullWidth /> */}

//               {/* With these two buttons: */}
//               <View style={styles.successButtons}>
//                 <Button
//                   title="View in Feed"
//                   onPress={handleGoToFeed}
//                   fullWidth
//                 />
//                 <Button
//                   title="Create Another"
//                   onPress={resetForm}
//                   variant="outline"
//                   fullWidth
//                 />
//               </View>
//             </View>
//           </View>
//         )}
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
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   content: {
//     flex: 1,
//   },
//   step: {
//     padding: Spacing.lg,
//   },
//   stepTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   stepDescription: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.xl,
//   },
//   categoryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: Spacing.md,
//     marginBottom: Spacing.xl,
//   },
//   categoryCard: {
//     width: '30%',
//     aspectRatio: 1,
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.md,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   categoryCardSelected: {
//     borderColor: Colors.primary,
//     backgroundColor: 'rgba(0, 128, 255, 0.1)',
//   },
//   categoryEmoji: {
//     fontSize: 40,
//     marginBottom: Spacing.sm,
//   },
//   categoryLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: Colors.text,
//   },
//   checkmark: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkmarkText: {
//     color: Colors.text,
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   inputGroup: {
//     marginBottom: Spacing.lg,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   input: {
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//   },
//   textArea: {
//     minHeight: 120,
//     paddingTop: Spacing.md,
//   },
//   charCount: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     textAlign: 'right',
//     marginTop: 4,
//   },
//   difficultySelector: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   difficultyButton: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     alignItems: 'center',
//   },
//   difficultyButtonSelected: {
//     borderColor: Colors.primary,
//     backgroundColor: 'rgba(0, 128, 255, 0.1)',
//   },
//   difficultyEmoji: {
//     fontSize: 24,
//     marginBottom: 4,
//   },
//   difficultyLevel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   economicsBreakdown: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   breakdownRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.sm,
//   },
//   breakdownLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   breakdownValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//   },
//   breakdownTotal: {
//     paddingTop: Spacing.sm,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   analyzing: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xxl,
//   },
//   analyzingText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginTop: Spacing.md,
//   },
//   resultCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.xl,
//     alignItems: 'center',
//     borderWidth: 2,
//     marginBottom: Spacing.lg,
//   },
//   resultEmoji: {
//     fontSize: 64,
//     marginBottom: Spacing.md,
//   },
//   resultTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//     textAlign: 'center',
//   },
//   riskScore: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   riskScoreLabel: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//   },
//   riskScoreValue: {
//     fontSize: 24,
//     fontWeight: '800',
//   },
//   flagsSection: {
//     marginBottom: Spacing.lg,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   flagItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: Colors.surface,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.md,
//     marginBottom: Spacing.sm,
//   },
//   flagEmoji: {
//     fontSize: 20,
//     marginRight: Spacing.md,
//   },
//   flagText: {
//     flex: 1,
//     fontSize: 14,
//     color: Colors.text,
//     lineHeight: 20,
//   },
//   suggestionsSection: {
//     marginBottom: Spacing.lg,
//   },
//   suggestionText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 22,
//     marginBottom: Spacing.sm,
//   },
//   successCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.xxl,
//     alignItems: 'center',
//   },
//   successEmoji: {
//     fontSize: 80,
//     marginBottom: Spacing.lg,
//   },
//   successTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   successDescription: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: Spacing.xl,
//     lineHeight: 24,
//   },
//   successStats: {
//     flexDirection: 'row',
//     gap: Spacing.xl,
//     marginBottom: Spacing.xl,
//   },
//   successStat: {
//     alignItems: 'center',
//   },
//   successStatValue: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.primary,
//   },
//   successStatLabel: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 4,
//   },
//     successButtons: {
//     width: '100%',
//     gap: Spacing.md,
//     marginTop: Spacing.md,
//   }
// });


import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../../components/common/Button';
import DCoinBalance from '../../components/token/DcoinBalance';
import { useAuth } from '../../contexts/AuthContext';
import { ModerationService } from '../../services/ai/moderations.service';
import { ChallengeService } from '../../services/firebase/challenge.service';
import { AIAnalysis } from '../../types/aianalysis';
import { ChallengeCategory, ChallengeDifficulty, PrizeModel } from '../../types/challenges';
import { Config } from '../../utils/constants/config';
import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';
import { 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ChevronRight,
  Zap,
  Award,
  Target,
  Shield,
  Users
} from 'lucide-react-native';

type Step = 'category' | 'details' | 'economics' | 'moderation' | 'success';

export default function CreateChallengeScreen() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [category, setCategory] = useState<ChallengeCategory | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(3);
  const [stakeAmount, setStakeAmount] = useState('50');
  const [prizeModel, setPrizeModel] = useState<PrizeModel>('single_winner');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdChallengeId, setCreatedChallengeId] = useState<string | null>(null);

  const categories: { 
    value: ChallengeCategory; 
    label: string; 
    icon: any;
    color: [string, string];
    description: string;
  }[] = [
    { value: 'creative', label: 'Creative', icon: Sparkles, color: ['#A020F0', '#C850C0'], description: 'Art, design, music' },
    { value: 'social', label: 'Social', icon: Users, color: ['#0080FF', '#00D4FF'], description: 'Connect with people' },
    { value: 'fitness', label: 'Fitness', icon: Zap, color: ['#00FF88', '#00CC6A'], description: 'Physical activity' },
    { value: 'skill', label: 'Skill', icon: Target, color: ['#FFD700', '#FFA500'], description: 'Learn something new' },
    { value: 'adventure', label: 'Adventure', icon: TrendingUp, color: ['#FF4444', '#FF6B6B'], description: 'Exciting experiences' },
    { value: 'random', label: 'Random', icon: Sparkles, color: ['#FFA500', '#FF6347'], description: 'Surprise me!' },
  ];

  const handleCreate = async () => {
    if (!user || !category) {
      Alert.alert('Error', 'Missing user or category');
      setCurrentStep('economics');
      setIsCreating(false);
      return;
    }

    const stake = parseInt(stakeAmount);
    if (isNaN(stake) || stake < Config.MIN_CHALLENGE_STAKE) {
      Alert.alert('Invalid Stake', `Minimum stake is ${Config.MIN_CHALLENGE_STAKE} DCoins`);
      setCurrentStep('economics');
      setIsCreating(false);
      return;
    }

    if (user.dcoins < stake) {
      Alert.alert('Insufficient DCoins', `You need ${stake} DCoins but only have ${user.dcoins} DCoins.`);
      setCurrentStep('economics');
      setIsCreating(false);
      return;
    }

    setIsCreating(true);

    const finalAnalysis: AIAnalysis = analysis || {
      approved: true,
      overallRiskScore: 29,
      physicalSafetyScore: 100,
      legalComplianceScore: 100,
      socialAppropriatenessScore: 100,
      privacyConcernsScore: 100,
      flags: [],
      suggestions: [],
      modelUsed: 'fallback',
      analysisTimestamp: new Date(),
      processingTimeMs: 0
    };

    try {
      const challengeId = await ChallengeService.createChallenge(
        user.id, user.displayName, user.avatarUrl, title, description,
        category, difficulty, stake, prizeModel, finalAnalysis, 168
      );
      setCreatedChallengeId(challengeId);
      setCurrentStep('success');
      await refreshUser();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create challenge');
      setCurrentStep('economics');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('category');
    setCategory(null);
    setTitle('');
    setDescription('');
    setDifficulty(3);
    setStakeAmount('50');
    setAnalysis(null);
    setCreatedChallengeId(null);
  };

  const getStepProgress = () => {
    const steps = ['category', 'details', 'economics', 'moderation', 'success'];
    return (steps.indexOf(currentStep) + 1) / steps.length;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.secondary, Colors.background]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Create Challenge</Text>
            <Text style={styles.headerSubtitle}>
              {currentStep === 'category' && 'Choose your style'}
              {currentStep === 'details' && 'Add the details'}
              {currentStep === 'economics' && 'Set the stakes'}
              {currentStep === 'moderation' && 'AI Safety Check'}
              {currentStep === 'success' && 'All done! 🎉'}
            </Text>
          </View>
          {user && <DCoinBalance balance={user.dcoins} size="small" />}
        </View>
        {currentStep !== 'success' && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <LinearGradient colors={[Colors.success, Colors.success + 'cc']} style={[styles.progressBarFill, { width: `${getStepProgress() * 100}%` }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'category' && (
          <View style={styles.step}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconWrapper}>
                <Sparkles size={24} color={Colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Choose Your Category</Text>
              <Text style={styles.stepDescription}>What type of challenge will you create?</Text>
            </View>

            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Pressable key={cat.value} style={[styles.categoryCard, category === cat.value && styles.categoryCardSelected]} onPress={() => { setCategory(cat.value); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
                    <LinearGradient colors={category === cat.value ? cat.color : [Colors.surface, Colors.surface]} style={styles.categoryGradient}>
                      <View style={styles.categoryIconWrapper}>
                        <IconComponent size={32} color={category === cat.value ? Colors.text : Colors.primary} strokeWidth={2} />
                      </View>
                      <Text style={[styles.categoryLabel, category === cat.value && styles.categoryLabelSelected]}>{cat.label}</Text>
                      <Text style={[styles.categoryDescription, category === cat.value && styles.categoryDescriptionSelected]}>{cat.description}</Text>
                      {category === cat.value && (
                        <View style={styles.selectedBadge}>
                          <CheckCircle size={20} color={Colors.text} fill={Colors.text} />
                        </View>
                      )}
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>

            <Button title="Continue" onPress={() => { if (!category) { Alert.alert('Select Category', 'Please choose a category first'); return; } Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentStep('details'); }} disabled={!category} fullWidth />
          </View>
        )}

        {currentStep === 'details' && (
          <View style={styles.step}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconWrapper}>
                <Target size={24} color={Colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Challenge Details</Text>
              <Text style={styles.stepDescription}>Make it clear and exciting!</Text>
            </View>

            <View style={styles.modernInputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.modernInputLabel}>Title</Text>
                <Text style={styles.charCount}>{title.length}/60</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.modernInput} placeholder="e.g., Do 50 pushups in 2 minutes" placeholderTextColor={Colors.textMuted} value={title} onChangeText={setTitle} maxLength={60} />
              </View>
            </View>

            <View style={styles.modernInputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.modernInputLabel}>Description</Text>
                <Text style={styles.charCount}>{description.length}/500</Text>
              </View>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput style={[styles.modernInput, styles.textArea]} placeholder="Describe what needs to be done..." placeholderTextColor={Colors.textMuted} value={description} onChangeText={setDescription} multiline numberOfLines={6} maxLength={500} textAlignVertical="top" />
              </View>
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernInputLabel}>Difficulty Level</Text>
              <View style={styles.difficultyGrid}>
                {[{ level: 1, label: 'Easy', emoji: '😊' }, { level: 2, label: 'Medium', emoji: '😐' }, { level: 3, label: 'Hard', emoji: '😰' }, { level: 4, label: 'Expert', emoji: '🔥' }, { level: 5, label: 'Insane', emoji: '💀' }].map((item) => (
                  <Pressable key={item.level} style={[styles.difficultyCard, difficulty === item.level && styles.difficultyCardSelected]} onPress={() => { setDifficulty(item.level as ChallengeDifficulty); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                    <Text style={styles.difficultyEmoji}>{item.emoji}</Text>
                    <Text style={styles.difficultyLabel}>{item.label}</Text>
                    {difficulty === item.level && <View style={styles.difficultyIndicator} />}
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep('category')} variant="outline" style={{ flex: 1 }} />
              <Button title="Continue" onPress={() => { if (!title.trim() || !description.trim()) { Alert.alert('Missing Info', 'Please fill in all fields'); return; } setCurrentStep('economics'); }} style={{ flex: 2 }} />
            </View>
          </View>
        )}

        {currentStep === 'economics' && (
          <View style={styles.step}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconWrapper}>
                <Trophy size={24} color={Colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Set Your Stake</Text>
              <Text style={styles.stepDescription}>Higher stakes = bigger rewards!</Text>
            </View>

            <View style={styles.modernInputGroup}>
              <Text style={styles.modernInputLabel}>Stake Amount (DCoins)</Text>
              <View style={styles.stakeInputWrapper}>
                <Text style={styles.dcoinIcon}>🪙</Text>
                <TextInput style={styles.stakeInput} placeholder={`Min: ${Config.MIN_CHALLENGE_STAKE}`} placeholderTextColor={Colors.textMuted} value={stakeAmount} onChangeText={setStakeAmount} keyboardType="numeric" />
                <Text style={styles.dcoinLabel}>DC</Text>
              </View>
            </View>

            <LinearGradient colors={[Colors.surface, Colors.surface + 'dd']} style={styles.economicsCard}>
              <View style={styles.economicsRow}>
                <View style={styles.economicsItem}>
                  <Zap size={16} color={Colors.primary} />
                  <Text style={styles.economicsLabel}>Your Stake</Text>
                </View>
                <Text style={styles.economicsValue}>{stakeAmount} DC</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.economicsRow}>
                <View style={styles.economicsItem}>
                  <TrendingUp size={16} color={Colors.danger} />
                  <Text style={styles.economicsLabel}>Platform Fee (15%)</Text>
                </View>
                <Text style={[styles.economicsValue, { color: Colors.danger }]}>-{Math.floor(parseInt(stakeAmount || '0') * 0.15)} DC</Text>
              </View>
              <View style={styles.divider} />
              <View style={[styles.economicsRow, styles.prizeRow]}>
                <View style={styles.economicsItem}>
                  <Trophy size={18} color={Colors.success} />
                  <Text style={[styles.economicsLabel, styles.prizeLabel]}>Prize Pool</Text>
                </View>
                <Text style={[styles.economicsValue, styles.prizeValue]}>{Math.floor(parseInt(stakeAmount || '0') * 0.85)} DC</Text>
              </View>
            </LinearGradient>

            <View style={styles.tipCard}>
              <AlertCircle size={16} color={Colors.primary} />
              <Text style={styles.tipText}>85% goes to winners, 15% covers platform costs</Text>
            </View>

            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep('details')} variant="outline" style={{ flex: 1 }} />
              <Button title="Create Challenge" onPress={() => { setAnalysis(null); setCurrentStep('moderation'); setTimeout(() => handleCreate(), 50); }} loading={isCreating} style={{ flex: 2 }} />
            </View>
          </View>
        )}

        {currentStep === 'moderation' && (
          <View style={styles.step}>
            <View style={styles.creatingCard}>
              <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.creatingIconWrapper}>
                <ActivityIndicator size="large" color={Colors.text} />
              </LinearGradient>
              <Text style={styles.creatingTitle}>Creating Your Challenge</Text>
              <Text style={styles.creatingDescription}>Securing your stake and publishing to the feed...</Text>
              <View style={styles.creatingSteps}>
                <View style={styles.creatingStep}>
                  <CheckCircle size={16} color={Colors.success} fill={Colors.success} />
                  <Text style={styles.creatingStepText}>Verifying stake</Text>
                </View>
                <View style={styles.creatingStep}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.creatingStepText}>Publishing challenge</Text>
                </View>
                <View style={styles.creatingStep}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.creatingStepText}>Notifying users</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {currentStep === 'success' && (
          <View style={styles.step}>
            <LinearGradient colors={[Colors.success + '20', Colors.primary + '10']} style={styles.successCard}>
              <View style={styles.successIconWrapper}>
                <Award size={60} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>Challenge Live! 🎉</Text>
              <Text style={styles.successDescription}>Your challenge is now visible to everyone. Time to watch the completions roll in!</Text>
              <View style={styles.successStats}>
                <View style={styles.successStat}>
                  <Trophy size={20} color={Colors.warning} />
                  <Text style={styles.successStatValue}>{Math.floor(parseInt(stakeAmount) * 0.85)}</Text>
                  <Text style={styles.successStatLabel}>Prize Pool</Text>
                </View>
                <View style={styles.successDivider} />
                <View style={styles.successStat}>
                  <Zap size={20} color={Colors.primary} />
                  <Text style={styles.successStatValue}>{stakeAmount}</Text>
                  <Text style={styles.successStatLabel}>Staked</Text>
                </View>
              </View>
              <View style={styles.successButtons}>
                <Button title="View in Feed" onPress={() => router.push('/(tabs)')} fullWidth />
                <Button title="Create Another" onPress={resetForm} variant="outline" fullWidth />
              </View>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: Spacing.lg, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl },
  headerContent: { paddingHorizontal: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: 4, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  progressBarContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  progressBarTrack: { height: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  content: { flex: 1 },
  step: { padding: Spacing.lg },
  stepHeader: { alignItems: 'center', marginBottom: Spacing.xl },
  stepIconWrapper: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  stepTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, marginBottom: Spacing.sm, textAlign: 'center', letterSpacing: -0.5 },
  stepDescription: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.md, marginBottom: Spacing.xl },
  categoryCard: { width: '47%', borderRadius: BorderRadius.lg, overflow: 'hidden' },
  categoryCardSelected: { transform: [{ scale: 1.02 }] },
  categoryGradient: { padding: Spacing.lg, minHeight: 150, justifyContent: 'center', alignItems: 'center', position: 'relative', borderWidth: 2, borderColor: Colors.border, borderRadius: BorderRadius.lg },
  categoryIconWrapper: { marginBottom: Spacing.md, padding: Spacing.md, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: BorderRadius.full },
  categoryLabel: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  categoryLabelSelected: { color: Colors.text },
  categoryDescription: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  categoryDescriptionSelected: { color: Colors.text, opacity: 0.8 },
  selectedBadge: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
  modernInputGroup: { marginBottom: Spacing.lg },
  inputLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  modernInputLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },
  charCount: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  inputWrapper: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 2, borderColor: Colors.border, overflow: 'hidden' },
  modernInput: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: 16, color: Colors.text },
  textAreaWrapper: { minHeight: 140 },
  textArea: { minHeight: 140, paddingTop: Spacing.md, textAlignVertical: 'top' },
  difficultyGrid: { flexDirection: 'row', gap: Spacing.sm },
  difficultyCard: { flex: 1, backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', position: 'relative' },
  difficultyCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '20' },
  difficultyEmoji: { fontSize: 28, marginBottom: 4 },
  difficultyLabel: { fontSize: 11, fontWeight: '700', color: Colors.text },
  difficultyIndicator: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  stakeInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 2, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  dcoinIcon: { fontSize: 24, marginRight: Spacing.sm },
  stakeInput: { flex: 1, fontSize: 24, fontWeight: '800', color: Colors.text, paddingVertical: Spacing.sm },
  dcoinLabel: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  economicsCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  economicsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  economicsItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  economicsLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  economicsValue: { fontSize: 16, fontWeight: '800', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  prizeRow: { paddingTop: Spacing.sm },
  prizeLabel: { fontSize: 15, fontWeight: '700' },
  prizeValue: { fontSize: 20, color: Colors.success },
  tipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary + '15', padding: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  tipText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 18 },
  buttonRow: { flexDirection: 'row', gap: Spacing.md },
  creatingCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
  creatingIconWrapper: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  creatingTitle: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  creatingDescription: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  creatingSteps: { gap: Spacing.md, alignItems: 'flex-start' },
  creatingStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  creatingStepText: { fontSize: 14, color: Colors.text },
  loadingDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.border },
  successCard: { borderRadius: BorderRadius.xl, padding: Spacing.xxl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  successIconWrapper: { marginBottom: Spacing.lg },
  successTitle: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: Spacing.sm, textAlign: 'center' },
  successDescription: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
  successStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, marginBottom: Spacing.xl },
  successStat: { alignItems: 'center' },
  successStatValue: { fontSize: 28, fontWeight: '900', color: Colors.text, marginTop: 4 },
  successStatLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  successDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  successButtons: { width: '100%', gap: Spacing.md },
});