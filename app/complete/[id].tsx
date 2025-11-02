import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '../../utils/constants/themes';
import Button from '../../components/common/Button';

export default function CompleteChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📸</Text>
      <Text style={styles.title}>Complete Challenge</Text>
      <Text style={styles.subtitle}>
        This feature is coming in Day 3!
      </Text>
      <Text style={styles.description}>
        You'll be able to submit photo/video proof here.
      </Text>
      <Text style={styles.challengeId}>Challenge ID: {id}</Text>
      
      <Button 
        title="Go Back" 
        onPress={() => router.back()}
        variant="outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  challengeId: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    fontFamily: 'monospace',
  },
});