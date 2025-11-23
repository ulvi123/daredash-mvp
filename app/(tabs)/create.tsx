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








type Step = 'category' | 'details' | 'economics' | 'moderation' | 'success';

export default function CreateChallengeScreen() {
  const { user, refreshUser } = useAuth();
  const router = useRouter()

  // Form state
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [category, setCategory] = useState<ChallengeCategory | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(3);
  const [stakeAmount, setStakeAmount] = useState('50');
  const [prizeModel, setPrizeModel] = useState<PrizeModel>('single_winner');

  // AI Moderation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [createdChallengeId, setCreatedChallengeId] = useState<string | null>(null);

  const categories: { value: ChallengeCategory; label: string; emoji: string; color: string }[] = [
    { value: 'creative', label: 'Creative', emoji: '🎨', color: Colors.secondary },
    { value: 'social', label: 'Social', emoji: '🤝', color: Colors.primary },
    { value: 'fitness', label: 'Fitness', emoji: '💪', color: Colors.success },
    { value: 'skill', label: 'Skill', emoji: '🎯', color: Colors.accent },
    { value: 'adventure', label: 'Adventure', emoji: '🏔️', color: Colors.danger },
    { value: 'random', label: 'Random', emoji: '🎲', color: Colors.warning },
  ];

  const handleAnalyze = async () => {
    if (!category || !title.trim() || !description.trim()) {
      Alert.alert('Missing Info', 'Please fill in all required fields');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('moderation');

    try {
      const result = await ModerationService.analyzeChallenge(description, category);
      setAnalysis(result);
      Haptics.notificationAsync(
        result.approved
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze challenge. Please try again.');
      console.error('Moderation analysis error:', error);
      setCurrentStep('economics');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // !analysis has been removed fro now
  const handleCreate = async () => {
    console.log('🚀 handleCreate called');

    if (!user || !category) {
      console.log('❌ Missing user or category:', { hasUser: !!user, category });
      Alert.alert('Error', 'Missing user or category');
      setCurrentStep('economics');
      setIsCreating(false);
      return;
    }

    console.log('✅ User and category OK');

    const stake = parseInt(stakeAmount);
    console.log('💰 Stake validation:', {
      stake,
      min: Config.MIN_CHALLENGE_STAKE,
      userBalance: user.dcoins,
      hasEnough: user.dcoins >= stake
    });

    if (isNaN(stake) || stake < Config.MIN_CHALLENGE_STAKE) {
      console.log('❌ Invalid stake amount');
      Alert.alert('Invalid Stake', `Minimum stake is ${Config.MIN_CHALLENGE_STAKE} DCoins`);
      setCurrentStep('economics');
      setIsCreating(false);
      return;
    }

    if (user.dcoins < stake) {
      console.log('❌ Insufficient balance');
      Alert.alert(
        'Insufficient DCoins',
        `You need ${stake} DCoins but only have ${user.dcoins} DCoins.\n\nPlease purchase more DCoins or reduce your stake amount.`
      );
      setCurrentStep('economics');
      setIsCreating(false);
      return;
    }

    console.log('✅ Stake validation passed - proceeding with creation');

    setIsCreating(true);
    console.log('🔄 setIsCreating(true) called');

    const finalAnalysis: AIAnalysis = analysis || {
      approved: true,
      overallRiskScore: 29,
      physicalSafetyScore: 100,
      legalComplianceScore: 100,
      socialAppropriatenessScore: 100,
      privacyConcernsScore: 100,
      flags: [{
        type: 'danger',
        category: 'other',
        message: 'Challenge created without AI moderation.',
        severity: 10
      }],
      suggestions: ['Challenge pending manual review.'],
      modelUsed: 'fallback',
      analysisTimestamp: new Date(),
      processingTimeMs: 0
    };

    try {
      console.log('📝 Calling ChallengeService.createChallenge...');

      const challengeId = await ChallengeService.createChallenge(
        user.id,
        user.displayName,
        user.avatarUrl,
        title,
        description,
        category,
        difficulty,
        stake,
        prizeModel,
        finalAnalysis,
        168
      );

      console.log('✅ Challenge created successfully! ID:', challengeId);

      setCreatedChallengeId(challengeId);
      setCurrentStep('success');

      console.log('🔄 Refreshing user...');
      await refreshUser();
      console.log('✅ User refreshed');

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('❌ Challenge creation error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      Alert.alert('Error', error.message || 'Failed to create challenge');
      setCurrentStep('economics');
    } finally {
      console.log('🏁 setIsCreating(false) called');
      setIsCreating(false);
    }
  };
  const resetForm = () => {
    setCurrentStep('category');
    setCategory(null);
    setTitle('');
    setDescription('');
    setDifficulty(3);
    setStakeAmount('1000');
    setAnalysis(null);
    setCreatedChallengeId(null);
  };

  const handleGoToFeed = () => {
    router.push('/(tabs)');  // Navigate to home/feed
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.surface, Colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>Create Challenge</Text>
        {user && <DCoinBalance balance={user.dcoins} size="small" />}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Category Selection */}
        {currentStep === 'category' && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Choose Category</Text>
            <Text style={styles.stepDescription}>What type of challenge is this?</Text>

            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.value}
                  style={[
                    styles.categoryCard,
                    category === cat.value && styles.categoryCardSelected,
                  ]}
                  onPress={() => {
                    setCategory(cat.value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  {category === cat.value && (
                    <View style={[styles.checkmark, { backgroundColor: cat.color }]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            <Button
              title="Next"
              onPress={() => {
                if (!category) {
                  Alert.alert('Select Category', 'Please choose a category first');
                  return;
                }
                setCurrentStep('details');
              }}
              disabled={!category}
              fullWidth
            />
          </View>
        )}

        {/* Step 2: Challenge Details */}
        {currentStep === 'details' && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Challenge Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Give your challenge a catchy title"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
                maxLength={60}
              />
              <Text style={styles.charCount}>{title.length}/60</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the challenge in detail..."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Difficulty</Text>
              <View style={styles.difficultySelector}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.difficultyButton,
                      difficulty === level && styles.difficultyButtonSelected,
                    ]}
                    onPress={() => {
                      setDifficulty(level as ChallengeDifficulty);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.difficultyEmoji}>
                      {level <= 2 ? '😊' : level === 3 ? '😐' : level === 4 ? '😰' : '🔥'}
                    </Text>
                    <Text style={styles.difficultyLevel}>{level}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep('category')} variant="outline" />
              <Button
                title="Next"
                onPress={() => {
                  if (!title.trim() || !description.trim()) {
                    Alert.alert('Missing Info', 'Please fill in all fields');
                    return;
                  }
                  setCurrentStep('economics');
                }}
              />
            </View>
          </View>
        )}

        {/* Step 3: Economics */}
        {/* Step 3: Economics */}
        {currentStep === 'economics' && (
          <View style={styles.step}>
            <Text style={styles.stepTitle}>Set Rewards</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stake Amount (DCoins)</Text>
              <TextInput
                style={styles.input}
                placeholder={`Min: ${Config.MIN_CHALLENGE_STAKE}`}
                placeholderTextColor={Colors.textMuted}
                value={stakeAmount}
                onChangeText={setStakeAmount}
                keyboardType="numeric"
              />
              <View style={styles.economicsBreakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Your Stake:</Text>
                  <Text style={styles.breakdownValue}>{stakeAmount} DC</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Platform Fee (15%):</Text>
                  <Text style={[styles.breakdownValue, { color: Colors.danger }]}>
                    -{Math.floor(parseInt(stakeAmount || '0') * 0.15)} DC
                  </Text>
                </View>
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.breakdownLabel}>Prize Pool:</Text>
                  <Text style={[styles.breakdownValue, { color: Colors.success, fontWeight: '700' }]}>
                    {Math.floor(parseInt(stakeAmount || '0') * 0.85)} DC
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep('details')} variant="outline" />
              <Button
                title="Create Challenge"
                onPress={() => {
                  setAnalysis(null);
                  setCurrentStep('moderation');
                  // Small delay to ensure state updates before calling handleCreate
                  setTimeout(() => handleCreate(), 50);
                }}
                loading={isCreating}
              />
            </View>
          </View>
        )}

        {/* Step 4: AI Moderation */}
        {/* Step 4: AI Moderation */}
        {currentStep === 'moderation' && (
          <View style={styles.step}>
            {isAnalyzing ? (
              <View style={styles.analyzing}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.analyzingText}>AI analyzing challenge safety...</Text>
              </View>
            ) : isCreating ? (
              <View style={styles.analyzing}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.analyzingText}>Creating your challenge...</Text>
              </View>
            ) : analysis ? (
              <View>
                <View style={[
                  styles.resultCard,
                  { borderColor: analysis.approved ? Colors.success : Colors.danger }
                ]}>
                  <Text style={styles.resultEmoji}>
                    {analysis.approved ? '✅' : '⚠️'}
                  </Text>
                  <Text style={styles.resultTitle}>
                    {analysis.approved ? 'Challenge Approved!' : 'Safety Concerns Detected'}
                  </Text>
                  <View style={styles.riskScore}>
                    <Text style={styles.riskScoreLabel}>Risk Score:</Text>
                    <Text style={[
                      styles.riskScoreValue,
                      { color: ModerationService.getRiskLevelColor(analysis.overallRiskScore) }
                    ]}>
                      {analysis.overallRiskScore}/100
                    </Text>
                  </View>
                </View>

                {analysis.flags.length > 0 && (
                  <View style={styles.flagsSection}>
                    <Text style={styles.sectionTitle}>Issues Found:</Text>
                    {analysis.flags.map((flag: any, index: number) => (
                      <View key={index} style={styles.flagItem}>
                        <Text style={styles.flagEmoji}>
                          {flag.type === 'danger' ? '🚨' : flag.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </Text>
                        <Text style={styles.flagText}>{flag.message}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {analysis.suggestions.length > 0 && (
                  <View style={styles.suggestionsSection}>
                    <Text style={styles.sectionTitle}>Suggestions:</Text>
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
                    ))}
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <Button title="Edit" onPress={() => setCurrentStep('details')} variant="outline" />
                  <Button
                    title={analysis.approved ? "Create Challenge" : "Create Anyway"}
                    onPress={handleCreate}
                    loading={isCreating}
                    variant={analysis.approved ? 'primary' : 'danger'}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.analyzing}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.analyzingText}>Preparing challenge...</Text>
              </View>
            )}
          </View>
        )}

        {/* Step 5: Success */}
        {currentStep === 'success' && (
          <View style={styles.step}>
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>Challenge Created!</Text>
              <Text style={styles.successDescription}>
                Your challenge is now live and others can start completing it.
              </Text>
              <View style={styles.successStats}>
                <View style={styles.successStat}>
                  <Text style={styles.successStatValue}>{stakeAmount}</Text>
                  <Text style={styles.successStatLabel}>DCoins Staked</Text>
                </View>
                <View style={styles.successStat}>
                  <Text style={styles.successStatValue}>{Math.floor(parseInt(stakeAmount) * 0.85)}</Text>
                  <Text style={styles.successStatLabel}>Prize Pool</Text>
                </View>
              </View>
              <Button title="Create Another" onPress={resetForm} fullWidth />
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  step: {
    padding: Spacing.lg,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 128, 255, 0.1)',
  },
  categoryEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 128, 255, 0.1)',
  },
  difficultyEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  difficultyLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  economicsBreakdown: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  breakdownTotal: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  analyzing: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  analyzingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: Spacing.lg,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  riskScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  riskScoreLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  riskScoreValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  flagsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  flagText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  suggestionsSection: {
    marginBottom: Spacing.lg,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  successCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  successDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  successStats: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  successStat: {
    alignItems: 'center',
  },
  successStatValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
  },
  successStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});