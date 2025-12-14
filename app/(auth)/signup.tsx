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
// import { UserRole } from '../../types/index';
// import * as Haptics from 'expo-haptics';

// export default function SignupScreen() {
//   const router = useRouter();
//   const { signUp } = useAuth();

//   const [displayName, setDisplayName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [selectedRole, setSelectedRole] = useState<UserRole>('both');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const roles: { value: UserRole; label: string; emoji: string; description: string }[] = [
//     {
//       value: 'doer',
//       label: 'Doer',
//       emoji: '🎯',
//       description: 'Complete challenges & earn DCoins',
//     },
//     {
//       value: 'challenger',
//       label: 'Challenger',
//       emoji: '🎨',
//       description: 'Create challenges for others',
//     },
//     {
//       value: 'both',
//       label: 'Both',
//       emoji: '⚡',
//       description: 'Do it all - recommended!',
//     },
//   ];

//   const validateForm = (): string | null => {
//     if (!displayName.trim()) return 'Please enter your name';
//     if (!email.trim()) return 'Please enter your email';
//     if (!email.includes('@')) return 'Please enter a valid email';
//     if (password.length < 6) return 'Password must be at least 6 characters';
//     if (password !== confirmPassword) return 'Passwords do not match';
//     return null;
//   };

//   const handleSignup = async () => {
//     const error = validateForm();
//     if (error) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert('Invalid Form', error);
//       return;
//     }

//     try {
//       setLoading(true);
//       await signUp(email, password, displayName, selectedRole);
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

//       //Showing here the welcoming message

//       Alert.alert(
//         '🎉 Welcome to DareDash!',
//         'Your account has been created successfully! You received 100 free DCoins to get started!',
//         [{ text: 'Let\'s Go!', style: 'default' }]
//       );

//       // Navigation handled by RootLayout
//     } catch (error: any) {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//       Alert.alert('Signup Failed', error.message || 'Please try again');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient
//       colors={[Colors.background, Colors.surface]}
//       style={styles.container}
//     >
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

//           {/* Title Section */}
//           <View style={styles.titleSection}>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>
//               Join DARE and start earning DCoins today
//             </Text>
//           </View>

//           {/* Role Selection */}
//           <View style={styles.section}>
//             <Text style={styles.sectionLabel}>I want to...</Text>
//             <View style={styles.roleContainer}>
//               {roles.map((role) => (
//                 <Pressable
//                   key={role.value}
//                   style={[
//                     styles.roleCard,
//                     selectedRole === role.value && styles.roleCardSelected,
//                   ]}
//                   onPress={() => {
//                     setSelectedRole(role.value);
//                     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                   }}
//                 >
//                   <Text style={styles.roleEmoji}>{role.emoji}</Text>
//                   <Text style={styles.roleLabel}>{role.label}</Text>
//                   <Text style={styles.roleDescription}>{role.description}</Text>
//                   {selectedRole === role.value && (
//                     <View style={styles.selectedIndicator}>
//                       <Text style={styles.checkmark}>✓</Text>
//                     </View>
//                   )}
//                 </Pressable>
//               ))}
//             </View>
//           </View>

//           {/* Form Section */}
//           <View style={styles.formSection}>
//             {/* Display Name */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Display Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="What should we call you?"
//                 placeholderTextColor={Colors.textMuted}
//                 value={displayName}
//                 onChangeText={setDisplayName}
//                 autoCapitalize="words"
//                 editable={!loading}
//               />
//             </View>

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
//                   placeholder="At least 6 characters"
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

//             {/* Confirm Password */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Confirm Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Re-enter password"
//                 placeholderTextColor={Colors.textMuted}
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//                 editable={!loading}
//               />
//             </View>

//             {/* Signup Button */}
//             <Pressable
//               style={({ pressed }) => [
//                 styles.signupButton,
//                 pressed && styles.buttonPressed,
//                 loading && styles.buttonDisabled,
//               ]}
//               onPress={handleSignup}
//               disabled={loading}
//             >
//               <LinearGradient
//                 colors={[Colors.primary, Colors.secondary]}
//                 style={styles.signupButtonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.text} />
//                 ) : (
//                   <Text style={styles.signupButtonText}>Create Account</Text>
//                 )}
//               </LinearGradient>
//             </Pressable>

//             {/* Terms */}
//             <Text style={styles.termsText}>
//               By signing up, you agree to our{' '}
//               <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
//               <Text style={styles.termsLink}>Privacy Policy</Text>
//             </Text>
//           </View>

//           {/* Login Link */}
//           <View style={styles.loginSection}>
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <Pressable onPress={() => router.push('/(auth)/login')}>
//               <Text style={styles.loginLink}>Sign In</Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.xxl,
//   },
//   header: {
//     marginTop: Spacing.xxl + 20,
//     marginBottom: Spacing.lg,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   titleSection: {
//     marginBottom: Spacing.xl,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     lineHeight: 24,
//   },
//   section: {
//     marginBottom: Spacing.xl,
//   },
//   sectionLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   roleContainer: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   roleCard: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   roleCardSelected: {
//     borderColor: Colors.primary,
//     backgroundColor: 'rgba(0, 128, 255, 0.1)',
//   },
//   roleEmoji: {
//     fontSize: 32,
//     marginBottom: Spacing.sm,
//   },
//   roleLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   roleDescription: {
//     fontSize: 11,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 14,
//   },
//   selectedIndicator: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: Colors.primary,
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkmark: {
//     color: Colors.text,
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   formSection: {
//     marginBottom: Spacing.lg,
//   },
//   inputContainer: {
//     marginBottom: Spacing.lg,
//   },
//   inputLabel: {
//     fontSize: 14,
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
//     paddingVertical: Spacing.md + 4,
//     fontSize: 16,
//     color: Colors.text,
//   },
//   passwordContainer: {
//     position: 'relative',
//   },
//   passwordInput: {
//     paddingRight: 50,
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: Spacing.md,
//     top: Spacing.md,
//     padding: 4,
//   },
//   eyeIcon: {
//     fontSize: 20,
//   },
//   signupButton: {
//     borderRadius: BorderRadius.md,
//     overflow: 'hidden',
//     marginTop: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   signupButtonGradient: {
//     paddingVertical: Spacing.md + 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   signupButtonText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   buttonPressed: {
//     opacity: 0.8,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   termsText: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   termsLink: {
//     color: Colors.primary,
//     textDecorationLine: 'underline',
//   },
//   loginSection: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: Spacing.lg,
//   },
//   loginText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   loginLink: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: Colors.primary,
//   },
// });

import { useState, useEffect, useRef } from 'react';
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
import { UserRole } from '../../types/index';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('both');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const roles: { value: UserRole; label: string; emoji: string; description: string; gradient: [string, string] }[] = [
    {
      value: 'doer',
      label: 'Doer',
      emoji: '🎯',
      description: 'Complete challenges & earn DCoins',
      gradient: ['#667eea', '#764ba2'] as [string, string],
    },
    {
      value: 'challenger',
      label: 'Challenger',
      emoji: '🎨',
      description: 'Create challenges for others',
      gradient: ['#f093fb', '#f5576c'] as [string, string],
    },
    {
      value: 'both',
      label: 'Both',
      emoji: '⚡',
      description: 'Do it all - recommended!',
      gradient: ['#4facfe', '#00f2fe'] as [string, string],
    },
  ];

  const validateForm = (): string | null => {
    if (!displayName.trim()) return 'Please enter your name';
    if (!email.trim()) return 'Please enter your email';
    if (!email.includes('@')) return 'Please enter a valid email';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSignup = async () => {
    const error = validateForm();
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Form', error);
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, displayName, selectedRole);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        '🎉 Welcome to DareDash!',
        'Your account has been created successfully! You received 100 free DCoins to get started!',
        [{ text: 'Let\'s Go!', style: 'default' }]
      );

      // Navigation handled by RootLayout
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Signup Failed', error.message || 'Please try again');
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

          {/* Animated Title Section */}
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
                <Text style={styles.logoEmoji}>🚀</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join DARE and start earning DCoins today
            </Text>
          </Animated.View>

          {/* Role Selection */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionLabel}>✨ Choose Your Path</Text>
            <View style={styles.roleContainer}>
              {roles.map((role) => (
                <Pressable
                  key={role.value}
                  style={styles.roleCard}
                  onPress={() => {
                    setSelectedRole(role.value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                >
                  <LinearGradient
                    colors={
                      selectedRole === role.value
                        ? role.gradient
                        : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] as [string, string]
                    }
                    style={styles.roleCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {selectedRole === role.value && (
                      <View style={styles.selectedGlow} />
                    )}
                    <Text style={styles.roleEmoji}>{role.emoji}</Text>
                    <Text style={styles.roleLabel}>{role.label}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                    {selectedRole === role.value && (
                      <View style={styles.selectedIndicator}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                          style={styles.selectedIndicatorGradient}
                        >
                          <Text style={styles.checkmark}>✓</Text>
                        </LinearGradient>
                      </View>
                    )}
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
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
            {/* Display Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.inputWrapper}
              >
                <View style={styles.inputIconContainer}>
                  <Text style={styles.inputIcon}>👤</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="What should we call you?"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </LinearGradient>
            </View>

            {/* Email */}
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

            {/* Password */}
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
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.inputWrapper}
              >
                <View style={styles.inputIconContainer}>
                  <Text style={styles.inputIcon}>🔐</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </LinearGradient>
            </View>

            {/* Signup Button */}
            <Pressable
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSignup}
              disabled={loading}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.signupButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.signupButtonText}>Create Account</Text>
                    <Text style={styles.signupButtonEmoji}>🎉</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Bonus Badge */}
            <View style={styles.bonusBadge}>
              <LinearGradient
                colors={['rgba(255,215,0,0.3)', 'rgba(255,165,0,0.2)']}
                style={styles.bonusBadgeGradient}
              >
                <Text style={styles.bonusIcon}>🎁</Text>
                <Text style={styles.bonusText}>Get 100 FREE DCoins on signup!</Text>
              </LinearGradient>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>

          {/* Login Link */}
          <Animated.View 
            style={[
              styles.loginSection,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.loginCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.loginCardGradient}
              >
                <Text style={styles.loginText}>Already have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/login')}>
                  <LinearGradient
                    colors={['#FF006E', '#8338EC']}
                    style={styles.loginLinkGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.loginLink}>Sign In</Text>
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
    flex: 1,
  },
  keyboardView: {
    flex: 1,
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
    fontWeight: '700',
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  roleCardGradient: {
    padding: Spacing.md,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 140,
    justifyContent: 'center',
  },
  selectedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  roleEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  selectedIndicatorGradient: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
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
    paddingRight: 50,
  },
  eyeButton: {
    padding: Spacing.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  signupButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  signupButtonGradient: {
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginRight: Spacing.sm,
  },
  signupButtonEmoji: {
    fontSize: 20,
    color: '#fff',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  bonusBadge: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  bonusBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  bonusIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  bonusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#667eea',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  loginSection: {
    marginTop: Spacing.xl,
  },
  loginCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  loginCardGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  loginLinkGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
});