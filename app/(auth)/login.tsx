import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): string | null => {
    if (!email.trim()) return 'Please enter your email';
    if (!email.includes('@')) return 'Please enter a valid email address';
    if (!password.trim()) return 'Please enter your password';
    return null;
  };

  const handleLogin = async () => {
    const error = validateForm();
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Input', error);
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation handled by AuthLayout
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue your DARE journey</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Your password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable onPress={() => Alert.alert('Reset Password', 'Feature coming soon!')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.text} />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Signup Redirect */}
          <View style={styles.signupSection}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text style={styles.signupLink}>Create one</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginTop: Spacing.xxl + 20,
    marginBottom: Spacing.lg,
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backButtonText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
  titleSection: { marginBottom: Spacing.xl },
  title: { fontSize: 36, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },
  formSection: { marginBottom: Spacing.lg },
  inputContainer: { marginBottom: Spacing.lg },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md + 4,
    fontSize: 16,
    color: Colors.text,
  },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeButton: { position: 'absolute', right: Spacing.md, top: Spacing.md, padding: 4 },
  eyeIcon: { fontSize: 20 },
  forgotPassword: {
    textAlign: 'right',
    color: Colors.primary,
    fontSize: 14,
    marginBottom: Spacing.lg,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  loginButtonGradient: {
    paddingVertical: Spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  buttonPressed: { opacity: 0.8 },
  buttonDisabled: { opacity: 0.6 },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  signupText: { fontSize: 14, color: Colors.textSecondary },
  signupLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
