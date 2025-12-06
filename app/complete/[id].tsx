import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Challenge } from '../../types/challenges';
import { ChallengeService } from '../../services/firebase/challenge.service';
import { CompletionService } from '../../services/firebase/completion.service';
import Button from '../../components/common/Button';

export default function CompleteChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Proof submission state
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [proofDescription, setProofDescription] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);

  useEffect(() => {
    loadChallenge();
    requestPermissions();
  }, [id]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and media library permissions to submit proof.'
      );
    }
  };

  const loadChallenge = async () => {
    if (!id) return;

    try {
      console.log('📥 Loading challenge:', id);
      setLoading(true);
      const data = await ChallengeService.getChallengeById(id);

      if (!data) {
        Alert.alert('Error', 'Challenge not found');
        router.back();
        return;
      }

      console.log('Challenge data:', {
        acceptedBy: data.acceptedBy,
        userId: user?.id,
        status: data.status
      });

      if (data.acceptedBy !== user?.id) {
        Alert.alert('Error', 'You have not accepted this challenge');
        router.back();
        return;
      }

      if (data.status !== 'in_progress') {
        Alert.alert('Error', `Challenge is ${data.status}, not in progress`);
        router.back();
        return;
      }

      setChallenge(data);
    } catch (error) {
      console.error('Error loading challenge:', error);
      Alert.alert('Error', 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
        setMediaType('photo');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
        setMediaType('photo');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const recordVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
        setMediaType('video');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const handleSubmit = async () => {
    console.log('🔘 Submit button clicked');

    if (!proofImage) {
      Alert.alert('Missing Proof', 'Please upload a photo or video as proof');
      return;
    }

    if (!challenge || !user || !mediaType) {
      console.error('Missing data:', { challenge: !!challenge, user: !!user, mediaType });
      return;
    }

    const confirmed = window.confirm(
      `Submit Proof?\n\nYou're about to submit your proof for verification. This cannot be undone.`
    );

    if (!confirmed) {
      console.log('❌ User cancelled submission');
      return;
    }

    try {
      console.log('✅ User confirmed submission');
      setSubmitting(true);
      console.log('📤 Submitting proof for challenge:', challenge.id);

      // Submit proof using CompletionService
      const completionId = await CompletionService.submitProof(
        challenge.id,
        user.id,
        user.displayName || user.email || 'Anonymous',
        user.photoURL,
        mediaType,
        proofImage,
        proofDescription || undefined
      );

      console.log('✅ Proof submitted successfully, completion ID:', completionId);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✅ Navigating here immediately without Alert.alert-havent BEEN TESTED!!!!!
      console.log('🎯 Navigating to stream tab...');
      router.replace('/(tabs)/stream');

    } catch (error: any) {
      console.error('❌ Error submitting proof:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to submit proof');
    } finally {
      console.log('🏁 Submit process finished');
      setSubmitting(false);
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

  const timeRemaining = new Date(challenge.expiresAt).getTime() - Date.now();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const isExpired = timeRemaining < 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Complete Challenge</Text>
        <Text style={styles.headerSubtitle}>
          {isExpired ? '⏰ Expired' : `⏱️ ${hoursRemaining}h remaining`}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Challenge Info */}
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>

          <View style={styles.prizeRow}>
            <Text style={styles.prizeLabel}>You will earn:</Text>
            <View style={styles.prizeAmount}>
              <Text style={styles.prizeEmoji}>🪙</Text>
              <Text style={styles.prizeValue}>{challenge.prizePool}</Text>
              <Text style={styles.prizeCurrency}>DC</Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📋 How to Submit Proof</Text>
          <Text style={styles.instructionsText}>
            1. Take a photo or record a video showing you completing the challenge{'\n'}
            2. Add a description explaining what you did{'\n'}
            3. Submit for AI verification{'\n'}
            4. Get paid instantly when verified!
          </Text>
        </View>

        {/* Media Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Proof</Text>

          {proofImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: proofImage }} style={styles.previewImage} />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewType}>
                  {mediaType === 'video' ? '🎥 Video' : '📷 Photo'}
                </Text>
              </View>
              <Pressable
                style={styles.removeButton}
                onPress={() => {
                  setProofImage(null);
                  setMediaType(null);
                }}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.uploadButtons}>
              <Pressable style={styles.uploadButton} onPress={takePhoto}>
                <Text style={styles.uploadButtonEmoji}>📷</Text>
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </Pressable>

              <Pressable style={styles.uploadButton} onPress={recordVideo}>
                <Text style={styles.uploadButtonEmoji}>🎥</Text>
                <Text style={styles.uploadButtonText}>Record Video</Text>
              </Pressable>

              <Pressable style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonEmoji}>🖼️</Text>
                <Text style={styles.uploadButtonText}>Choose from Library</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Description Input */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe how you completed the challenge..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={proofDescription}
            onChangeText={setProofDescription}
            maxLength={500}
          />
          <Text style={styles.charCount}>{proofDescription.length}/500</Text>
        </View>

        {/* Warning */}
        {isExpired && (
          <View style={styles.warningCard}>
            <Text style={styles.warningEmoji}>⚠️</Text>
            <Text style={styles.warningText}>
              This challenge has expired. You can still submit proof, but it may not be accepted.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={[Colors.background, 'rgba(10, 14, 39, 0.95)']}
          style={styles.bottomBarGradient}
        >
          <Button
            title={submitting ? "Submitting..." : "Submit Proof"}
            onPress={() => {
              console.log('🖱️ Submit button pressed');
              handleSubmit();
            }}
            loading={submitting}
            disabled={!proofImage || submitting}
            icon="✅"
            fullWidth
          />
        </LinearGradient>
      </View>
    </View>
  );
}

// ... (keep all the same styles from before)

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
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  challengeCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
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
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
  instructionsCard: {
    margin: Spacing.lg,
    marginTop: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  uploadSection: {
    margin: Spacing.lg,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  uploadButtons: {
    gap: Spacing.md,
  },
  uploadButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  uploadButtonEmoji: {
    fontSize: 32,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: BorderRadius.lg,
  },
  previewOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  previewType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.danger,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '700',
  },
  descriptionSection: {
    margin: Spacing.lg,
    marginTop: 0,
  },
  descriptionInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  warningCard: {
    margin: Spacing.lg,
    marginTop: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.warning + '20',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  warningEmoji: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarGradient: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});