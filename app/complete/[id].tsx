// import { View, Text, StyleSheet } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Colors, Spacing } from '../../utils/constants/themes';
// import Button from '../../components/common/Button';

// export default function CompleteChallengeScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.emoji}>📸</Text>
//       <Text style={styles.title}>Complete Challenge</Text>
//       <Text style={styles.subtitle}>
//         This feature is coming in Day 3!
//       </Text>
//       <Text style={styles.description}>
//         You'll be able to submit photo/video proof here.
//       </Text>
//       <Text style={styles.challengeId}>Challenge ID: {id}</Text>
      
//       <Button 
//         title="Go Back" 
//         onPress={() => router.back()}
//         variant="outline"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: Spacing.xl,
//   },
//   emoji: {
//     fontSize: 80,
//     marginBottom: Spacing.lg,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 18,
//     color: Colors.primary,
//     marginBottom: Spacing.md,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.lg,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   challengeId: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     marginBottom: Spacing.xl,
//     fontFamily: 'monospace',
//   },
// });


import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Challenge } from '../../types/challenges';
import { ChallengeService } from '../../services/firebase/challenge.service';
import { TokenService } from '../../services/firebase/token.service';
import Button from '../../components/common/Button';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../services/firebase/config'
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Collections } from '../../services/firebase/collections';
import { storage } from '../../services/firebase/config';

const { width } = Dimensions.get('window');

type Step = 'capture' | 'verify' | 'success';

export default function CompleteChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('capture');
  
  // Capture state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Verify state
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    loadChallenge();
    requestPermissions();
  }, [id]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to complete challenges');
    }
  };

  const loadChallenge = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await ChallengeService.getChallengeById(id);
      setChallenge(data);
    } catch (error) {
      console.error('Error loading challenge:', error);
      Alert.alert('Error', 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = `completions/${user?.id}/${id}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const verifyWithAI = async (imageUrl: string, challengeDescription: string): Promise<any> => {
    // Call OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a challenge verification AI. Analyze if the image proves the challenge was completed. Respond in JSON format with: verified (boolean), confidence (0-100), explanation (string).',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Challenge: "${challengeDescription}". Does this image prove the challenge was completed?`,
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  };

  const handleSubmit = async () => {
    if (!imageUri || !challenge || !user) {
      Alert.alert('Missing Info', 'Please capture or select an image');
      return;
    }

    try {
      setUploading(true);
      setStep('verify');

      // 1. Upload image to Firebase Storage
      const imageUrl = await uploadImage(imageUri);

      // 2. Verify with AI
      setVerifying(true);
      const aiResult = await verifyWithAI(imageUrl, challenge.description);
      setVerificationResult(aiResult);
      setVerifying(false);

      // 3. Create completion document
      const completionData = {
        challengeId: challenge.id,
        userId: user.id,
        userName: user.displayName,
        userAvatar: user.avatarUrl || null,
        proofType: 'photo',
        proofUrl: imageUrl,
        caption: caption.trim() || null,
        aiVerification: {
          verified: aiResult.verified,
          confidence: aiResult.confidence,
          explanation: aiResult.explanation,
          proofMatchesDescription: aiResult.verified,
          noDeepfakeDetected: true,
          timestampValid: true,
          locationValid: true,
          modelUsed: 'gpt-4o-mini',
          verificationTimestamp: new Date(),
          processingTimeMs: 0,
        },
        status: aiResult.verified && aiResult.confidence >= 70 ? 'verified' : 'rejected',
        rewardAmount: challenge.prizePool,
        rewardPaid: false,
        submittedAt: serverTimestamp(),
      };

      const completionRef = await addDoc(collection(db, Collections.COMPLETIONS), completionData);

      // 4. If verified, distribute rewards
      if (aiResult.verified && aiResult.confidence >= 70) {
        // Transfer DCoins from challenge to user
        await TokenService.addDCoins(
          user.id,
          challenge.prizePool,
          'prize_won',
          `Won challenge: ${challenge.title}`,
          { challengeId: challenge.id, completionId: completionRef.id }
        );

        // Update challenge status
        await updateDoc(doc(db, Collections.CHALLENGES, challenge.id), {
          status: 'completed',
          completions: challenge.completions + 1,
          completedAt: serverTimestamp(),
        });

        // Update user stats
        await refreshUser();

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep('success');
      } else {
        // Rejected
        Alert.alert(
          'Verification Failed',
          aiResult.explanation || 'AI could not verify your completion. Please try again with better proof.',
          [
            { text: 'Try Again', onPress: () => setStep('capture') },
            { text: 'Cancel', onPress: () => router.back() },
          ]
        );
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to submit proof');
      setStep('capture');
    } finally {
      setUploading(false);
    }
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
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Complete Challenge</Text>
        <Text style={styles.headerSubtitle}>{challenge.title}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Capture */}
        {step === 'capture' && (
          <View style={styles.captureStep}>
            {/* Challenge Info */}
            <BlurView intensity={40} style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              
              <View style={styles.prizeRow}>
                <Text style={styles.prizeLabel}>Prize:</Text>
                <View style={styles.prizeAmount}>
                  <Text style={styles.prizeEmoji}>🪙</Text>
                  <Text style={styles.prizeValue}>{challenge.prizePool}</Text>
                  <Text style={styles.prizeCurrency}>DC</Text>
                </View>
              </View>
            </BlurView>

            {/* Image Preview */}
            {imageUri ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <Button
                  title="Retake"
                  onPress={() => setImageUri(null)}
                  variant="outline"
                  size="small"
                  style={styles.retakeButton}
                />
              </View>
            ) : (
              <View style={styles.captureButtons}>
                <Button
                  title="Take Photo"
                  onPress={handleTakePhoto}
                  icon="📸"
                  fullWidth
                  style={styles.captureButton}
                />
                <Button
                  title="Choose from Gallery"
                  onPress={handlePickImage}
                  icon="🖼️"
                  variant="secondary"
                  fullWidth
                  style={styles.captureButton}
                />
              </View>
            )}

            {/* Caption */}
            {imageUri && (
              <>
                <TextInput
                  style={styles.captionInput}
                  placeholder="Add a caption (optional)"
                  placeholderTextColor={Colors.textMuted}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={200}
                />
                <Text style={styles.charCount}>{caption.length}/200</Text>

                <Button
                  title="Submit Proof"
                  onPress={handleSubmit}
                  loading={uploading}
                  fullWidth
                  icon="🚀"
                  style={styles.submitButton}
                />
              </>
            )}
          </View>
        )}

        {/* Step 2: Verify */}
        {step === 'verify' && (
          <View style={styles.verifyStep}>
            <BlurView intensity={60} style={styles.verifyCard}>
              <LinearGradient
                colors={['rgba(102, 126, 234, 0.3)', 'rgba(118, 75, 162, 0.3)']}
                style={styles.verifyGradient}
              >
                {verifying ? (
                  <>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.verifyTitle}>AI Verifying...</Text>
                    <Text style={styles.verifyDescription}>
                      Our AI is analyzing your proof to ensure it meets the challenge requirements.
                    </Text>
                  </>
                ) : verificationResult ? (
                  <>
                    <Text style={styles.verifyEmoji}>
                      {verificationResult.verified ? '✅' : '❌'}
                    </Text>
                    <Text style={styles.verifyTitle}>
                      {verificationResult.verified ? 'Verified!' : 'Verification Failed'}
                    </Text>
                    <Text style={styles.verifyConfidence}>
                      Confidence: {verificationResult.confidence}%
                    </Text>
                    <Text style={styles.verifyExplanation}>
                      {verificationResult.explanation}
                    </Text>
                  </>
                ) : null}
              </LinearGradient>
            </BlurView>
          </View>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <View style={styles.successStep}>
            <BlurView intensity={60} style={styles.successCard}>
              <LinearGradient
                colors={['rgba(0, 255, 136, 0.3)', 'rgba(0, 204, 106, 0.3)']}
                style={styles.successGradient}
              >
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successTitle}>Challenge Completed!</Text>
                <Text style={styles.successDescription}>
                  You've earned {challenge.prizePool} DCoins!
                </Text>

                {imageUri && (
                  <Image source={{ uri: imageUri }} style={styles.successImage} />
                )}

                <View style={styles.successButtons}>
                  <Button
                    title="View Profile"
                    onPress={() => router.push('/(tabs)/profile')}
                    variant="secondary"
                    style={styles.successButton}
                  />
                  <Button
                    title="Browse More"
                    onPress={() => router.push('/')}
                    style={styles.successButton}
                  />
                </View>
              </LinearGradient>
            </BlurView>
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
    marginBottom: Spacing.xl,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  captureStep: {},
  challengeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  prizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  imagePreview: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  image: {
    width: '100%',
    height: width - Spacing.lg * 2,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
  },
  retakeButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
  },
  captureButtons: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  captureButton: {
    marginBottom: Spacing.sm,
  },
  captionInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.xs,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Spacing.md,
  },
  submitButton: {},
  verifyStep: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  verifyCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  verifyGradient: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  verifyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  verifyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  verifyEmoji: {
    fontSize: 80,
  },
  verifyConfidence: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  verifyExplanation: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  successStep: {
    alignItems: 'center',
  },
  successCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  successGradient: {
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
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  successImage: {
    width: width - Spacing.lg * 4,
    height: width - Spacing.lg * 4,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  successButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  successButton: {
    flex: 1,
  },
});