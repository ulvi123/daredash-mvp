import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../utils/constants/themes';

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Challenge</Text>
      <Text style={styles.subtitle}>Coming soon in Day 2-3!</Text>
      <Text style={styles.emoji}>🎨</Text>
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
  },
});