// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Pressable,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../contexts/AuthContext';
// import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
// import * as Haptics from 'expo-haptics';

// export default function LoginScreen() {
//   const router = useRouter();
//   const { signIn } = useAuth();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const validateForm = (): string | null => {
//     if (!email.trim()) return 'Please enter your email';
//     if (!email.includes('@')) return 'Please enter a valid email address';
//     if (!password.trim()) return 'Please enter your password';
//     return null;
//   };

//   const handleLogin = async () => {
//     const error = validateForm();
//     if (error) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert('Invalid Input', error);
//       return;
//     }

//     try {
//       setLoading(true);
//       await signIn(email, password);
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//       // Navigation handled by AuthLayout
//     } catch (error: any) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert('Login Failed', error.message || 'Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <Pressable onPress={() => router.back()} style={styles.backButton}>
//               <Text style={styles.backButtonText}>← Back</Text>
//             </Pressable>
//           </View>

//           {/* Title */}
//           <View style={styles.titleSection}>
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>Log in to continue your DARE journey</Text>
//           </View>

//           {/* Form */}
//           <View style={styles.formSection}>
//             {/* Email */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Email</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="your@email.com"
//                 placeholderTextColor={Colors.textMuted}
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 editable={!loading}
//               />
//             </View>

//             {/* Password */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Password</Text>
//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={[styles.input, styles.passwordInput]}
//                   placeholder="Your password"
//                   placeholderTextColor={Colors.textMuted}
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry={!showPassword}
//                   autoCapitalize="none"
//                   editable={!loading}
//                 />
//                 <Pressable
//                   onPress={() => setShowPassword(!showPassword)}
//                   style={styles.eyeButton}
//                 >
//                   <Text style={styles.eyeIcon}>
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </Text>
//                 </Pressable>
//               </View>
//             </View>

//             {/* Forgot Password */}
//             <Pressable onPress={() => Alert.alert('Reset Password', 'Feature coming soon!')}>
//               <Text style={styles.forgotPassword}>Forgot Password?</Text>
//             </Pressable>

//             {/* Login Button */}
//             <Pressable
//               style={({ pressed }) => [
//                 styles.loginButton,
//                 pressed && styles.buttonPressed,
//                 loading && styles.buttonDisabled,
//               ]}
//               onPress={handleLogin}
//               disabled={loading}
//             >
//               <LinearGradient
//                 colors={[Colors.primary, Colors.secondary]}
//                 style={styles.loginButtonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.text} />
//                 ) : (
//                   <Text style={styles.loginButtonText}>Sign In</Text>
//                 )}
//               </LinearGradient>
//             </Pressable>
//           </View>

//           {/* Signup Redirect */}
//           <View style={styles.signupSection}>
//             <Text style={styles.signupText}>Don’t have an account? </Text>
//             <Pressable onPress={() => router.push('/signup')}>
//               <Text style={styles.signupLink}>Create one</Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   keyboardView: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.xxl,
//   },
//   header: {
//     marginTop: Spacing.xxl + 20,
//     marginBottom: Spacing.lg,
//   },
//   backButton: { flexDirection: 'row', alignItems: 'center' },
//   backButtonText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
//   titleSection: { marginBottom: Spacing.xl },
//   title: { fontSize: 36, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
//   subtitle: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },
//   formSection: { marginBottom: Spacing.lg },
//   inputContainer: { marginBottom: Spacing.lg },
//   inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
//   input: {
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md + 4,
//     fontSize: 16,
//     color: Colors.text,
//   },
//   passwordContainer: { position: 'relative' },
//   passwordInput: { paddingRight: 50 },
//   eyeButton: { position: 'absolute', right: Spacing.md, top: Spacing.md, padding: 4 },
//   eyeIcon: { fontSize: 20 },
//   forgotPassword: {
//     textAlign: 'right',
//     color: Colors.primary,
//     fontSize: 14,
//     marginBottom: Spacing.lg,
//     fontWeight: '600',
//   },
//   loginButton: {
//     borderRadius: BorderRadius.md,
//     overflow: 'hidden',
//     marginTop: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   loginButtonGradient: {
//     paddingVertical: Spacing.md + 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loginButtonText: { fontSize: 18, fontWeight: '700', color: Colors.text },
//   buttonPressed: { opacity: 0.8 },
//   buttonDisabled: { opacity: 0.6 },
//   signupSection: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: Spacing.lg,
//   },
//   signupText: { fontSize: 14, color: Colors.textSecondary },
//   signupLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
// });


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
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <LinearGradient 
      colors={['#0F0C29', '#302b63', '#24243e']} 
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Floating particles background */}
          <View style={styles.particlesContainer}>
            {[...Array(15)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.particle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    opacity: Math.random() * 0.5 + 0.3,
                  }
                ]}
              />
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.backButtonGradient}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Animated Title */}
          <Animated.View 
            style={[
              styles.titleSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoEmoji}>🎯</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue your DARE journey</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.inputWrapper}
              >
                <View style={styles.inputIconContainer}>
                  <Text style={styles.inputIcon}>📧</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </LinearGradient>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.inputWrapper}
              >
                <View style={styles.inputIconContainer}>
                  <Text style={styles.inputIcon}>🔒</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Your password"
                  placeholderTextColor="rgba(255,255,255,0.4)"
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
              </LinearGradient>
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
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Text style={styles.loginButtonEmoji}>→</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login (Optional - for future) */}
            <View style={styles.socialContainer}>
              <Pressable style={styles.socialButton}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.socialButtonGradient}
                >
                  <Text style={styles.socialIcon}>🍎</Text>
                </LinearGradient>
              </Pressable>
              
              <Pressable style={styles.socialButton}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.socialButtonGradient}
                >
                  <Text style={styles.socialIcon}>G</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>

          {/* Signup Redirect */}
          <Animated.View 
            style={[
              styles.signupSection,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.signupCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.signupCardGradient}
              >
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Pressable onPress={() => router.push('/signup')}>
                  <LinearGradient
                    colors={['#FF006E', '#8338EC']}
                    style={styles.signupLinkGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.signupLink}>Create one</Text>
                  </LinearGradient>
                </Pressable>
              </LinearGradient>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  keyboardView: { 
    flex: 1 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },
  header: {
    marginTop: Spacing.xxl + 20,
    marginBottom: Spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  backButtonGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: { 
    fontSize: 16, 
    color: '#fff', 
    fontWeight: '700' 
  },
  titleSection: { 
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.lg,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: { 
    fontSize: 42, 
    fontWeight: '900', 
    color: '#fff', 
    marginBottom: Spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(102,126,234,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.7)', 
    lineHeight: 24,
    textAlign: 'center',
  },
  formSection: { 
    marginBottom: Spacing.xl 
  },
  inputContainer: { 
    marginBottom: Spacing.lg 
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingLeft: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  inputIconContainer: {
    marginRight: Spacing.sm,
  },
  inputIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md + 4,
    fontSize: 16,
    color: '#fff',
  },
  passwordInput: { 
    paddingRight: 50 
  },
  eyeButton: { 
    padding: Spacing.md,
  },
  eyeIcon: { 
    fontSize: 20 
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#667eea',
    fontSize: 14,
    marginBottom: Spacing.lg,
    fontWeight: '700',
  },
  loginButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  loginButtonGradient: {
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#fff',
    marginRight: Spacing.sm,
  },
  loginButtonEmoji: {
    fontSize: 20,
    color: '#fff',
  },
  buttonPressed: { 
    opacity: 0.8 
  },
  buttonDisabled: { 
    opacity: 0.6 
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  socialButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  signupSection: {
    marginTop: Spacing.xl,
  },
  signupCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  signupCardGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  signupText: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.7)',
  },
  signupLinkGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  signupLink: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#fff',
  },
});