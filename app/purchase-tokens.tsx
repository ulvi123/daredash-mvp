// import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../contexts/AuthContext';
// import { Colors, Spacing, BorderRadius } from '../utils/constants/themes';
// import { Config } from '../utils/constants/config';
// import Button from '../components/common/Button';

// export default function PurchaseTokensScreen() {
//   const router = useRouter();
//   const { user } = useAuth();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={[Colors.primary, Colors.secondary]}
//         style={styles.header}
//       >
//         <Pressable onPress={() => router.back()} style={styles.backButton}>
//           <Text style={styles.backButtonText}>← Back</Text>
//         </Pressable>
//         <Text style={styles.headerTitle}>Buy DCoins</Text>
//         <Text style={styles.headerSubtitle}>
//           Current Balance: {user?.dcoins.toLocaleString() || 0} DC
//         </Text>
//       </LinearGradient>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Packages */}
//         <Text style={styles.sectionTitle}>Choose Package</Text>
        
//         {Config.PURCHASE_PACKAGES.map((pkg) => (
//           <Pressable key={pkg.id} style={styles.packageCard}>
//             <LinearGradient
//               colors={pkg.isPopular 
//                 ? ['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.2)']
//                 : ['rgba(30, 33, 57, 0.8)', 'rgba(30, 33, 57, 0.6)']}
//               style={styles.packageGradient}
//             >
//               {pkg.isPopular && (
//                 <View style={styles.popularBadge}>
//                   <Text style={styles.popularText}>⭐ POPULAR</Text>
//                 </View>
//               )}
              
//               <Text style={styles.packageName}>{pkg.name}</Text>
              
//               <View style={styles.packageAmount}>
//                 <Text style={styles.packageEmoji}>🪙</Text>
//                 <Text style={styles.packageDCoins}>{pkg.dcoins.toLocaleString()}</Text>
//                 <Text style={styles.packageLabel}>DCoins</Text>
//               </View>

//               {pkg.bonusPercentage > 0 && (
//                 <View style={styles.bonusBadge}>
//                   <Text style={styles.bonusText}>+{pkg.bonusPercentage}% BONUS</Text>
//                 </View>
//               )}

//               <View style={styles.packagePrice}>
//                 <Text style={styles.priceText}>${pkg.price}</Text>
//                 <Text style={styles.pricePerCoin}>
//                   ${(pkg.price / pkg.dcoins).toFixed(4)} per coin
//                 </Text>
//               </View>

//               <View style={styles.comingSoonBadge}>
//                 <Text style={styles.comingSoonText}>Coming in Day 3! 🚀</Text>
//               </View>
//             </LinearGradient>
//           </Pressable>
//         ))}

//         {/* Info Section */}
//         <View style={styles.infoSection}>
//           <Text style={styles.infoTitle}>💡 How it works</Text>
//           <Text style={styles.infoText}>
//             1. Choose a package above{'\n'}
//             2. Complete secure payment{'\n'}
//             3. DCoins added instantly to your balance{'\n'}
//             4. Use DCoins to create or complete challenges
//           </Text>
//         </View>

//         <View style={styles.bottomPadding} />
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
//     paddingBottom: Spacing.xl,
//     paddingHorizontal: Spacing.lg,
//   },
//   backButton: {
//     marginBottom: Spacing.md,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '600',
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.8)',
//   },
//   content: {
//     flex: 1,
//     padding: Spacing.lg,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   packageCard: {
//     marginBottom: Spacing.md,
//   },
//   packageGradient: {
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     position: 'relative',
//   },
//   popularBadge: {
//     position: 'absolute',
//     top: Spacing.md,
//     right: Spacing.md,
//     backgroundColor: Colors.accent,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   popularText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: Colors.background,
//   },
//   packageName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   packageAmount: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//   },
//   packageEmoji: {
//     fontSize: 32,
//     marginRight: Spacing.sm,
//   },
//   packageDCoins: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: Colors.primary,
//   },
//   packageLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//     marginLeft: Spacing.sm,
//   },
//   bonusBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: Colors.success + '30',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.full,
//     marginBottom: Spacing.md,
//   },
//   bonusText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: Colors.success,
//   },
//   packagePrice: {
//     marginBottom: Spacing.md,
//   },
//   priceText: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   pricePerCoin: {
//     fontSize: 12,
//     color: Colors.textMuted,
//   },
//   comingSoonBadge: {
//     backgroundColor: Colors.warning + '20',
//     borderWidth: 1,
//     borderColor: Colors.warning,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     alignItems: 'center',
//   },
//   comingSoonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.warning,
//   },
//   infoSection: {
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     marginTop: Spacing.lg,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   infoTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   infoText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 24,
//   },
//   bottomPadding: {
//     height: Spacing.xxl,
//   },
// });

import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../utils/constants/themes';
import { Config } from '../utils/constants/config';
import { TokenService } from '../services/firebase/token.service';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Zap, Star, TrendingUp, Award, Sparkles } from 'lucide-react-native';

export default function PurchaseTokensScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [displayBalance, setDisplayBalance] = useState(user?.dcoins || 0);

  // Update display balance when user changes
  useEffect(() => {
    if (user?.dcoins !== undefined) {
      setDisplayBalance(user.dcoins);
    }
  }, [user?.dcoins]);

  const handlePurchase = async (pkg: any) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to purchase tokens');
      return;
    }

    // Show confirmation
    const confirmed = window.confirm(
      `Demo Mode Purchase\n\n` +
      `You're about to receive ${pkg.dcoins.toLocaleString()} DCoins for FREE!\n\n` +
      `In production, this would charge ${pkg.price} via Stripe.\n\n` +
      `Continue?`
    );

    if (!confirmed) return;

    try {
      setPurchasing(pkg.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Add tokens to user account (Demo mode - instant free tokens!)
      await TokenService.addDCoins(
        user.id,
        pkg.dcoins,
        'purchase',
        `Purchased ${pkg.name} package (Demo Mode)`,
        { packageId: pkg.id, packageName: pkg.name }
      );

      // Calculate new balance
      const newBalance = (user.dcoins || 0) + pkg.dcoins;
      
      // Update display balance immediately for instant feedback
      setDisplayBalance(newBalance);

      // Refresh user data from server
      await refreshUser();

      // Show success
      Alert.alert(
        '🎉 Success!',
        `${pkg.dcoins.toLocaleString()} DCoins added to your account!\n\nNew balance: ${newBalance.toLocaleString()} DC`,
        [{ text: 'Awesome!' }]
      );

    } catch (error: any) {
      console.error('Purchase error:', error);
      Alert.alert('Error', error.message || 'Failed to add tokens');
      // Revert display balance on error
      setDisplayBalance(user.dcoins || 0);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary, Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backButtonInner}>
            <ChevronLeft size={24} color={Colors.text} strokeWidth={2.5} />
          </View>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Buy DCoins</Text>
          <Text style={styles.headerSubtitle}>
            Power up your challenges
          </Text>
        </View>

        {/* Current Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <View style={styles.balanceRow}>
            <Zap size={28} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.balanceAmount}>{displayBalance.toLocaleString()}</Text>
            <Text style={styles.balanceCurrency}>DC</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Demo Mode Banner */}
        <View style={styles.demoBanner}>
          <Sparkles size={20} color={Colors.success} />
          <View style={styles.demoTextContainer}>
            <Text style={styles.demoTitle}>Demo Mode Active</Text>
            <Text style={styles.demoText}>All purchases are FREE in demo mode!</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Package</Text>
        
        {Config.PURCHASE_PACKAGES.map((pkg, index) => (
          <Pressable 
            key={pkg.id} 
            style={styles.packageCard}
            onPress={() => handlePurchase(pkg)}
            disabled={purchasing !== null}
          >
            <LinearGradient
              colors={
                pkg.isPopular 
                  ? [Colors.primary + '40', Colors.secondary + '20']
                  : [Colors.surface, Colors.surface + 'dd']
              }
              style={styles.packageGradient}
            >
              {pkg.isPopular && (
                <View style={styles.popularBadge}>
                  <Star size={12} color={Colors.warning} fill={Colors.warning} />
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <View style={styles.packageHeader}>
                <View style={styles.packageIconWrapper}>
                  {index === 0 && <Zap size={32} color={Colors.primary} />}
                  {index === 1 && <TrendingUp size={32} color={Colors.success} />}
                  {index === 2 && <Award size={32} color={Colors.warning} />}
                  {index === 3 && <Sparkles size={32} color={Colors.secondary} />}
                </View>
                <View style={styles.packageTitleSection}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  {pkg.bonusPercentage > 0 && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusText}>+{pkg.bonusPercentage}% BONUS</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.packageAmount}>
                <Text style={styles.packageDCoins}>{pkg.dcoins.toLocaleString()}</Text>
                <Text style={styles.packageLabel}>DCoins</Text>
              </View>

              <View style={styles.packageFooter}>
                <View style={styles.priceSection}>
                  <Text style={styles.priceText}>${pkg.price}</Text>
                  <Text style={styles.pricePerCoin}>
                    ${(pkg.price / pkg.dcoins).toFixed(4)}/coin
                  </Text>
                </View>

                <View style={styles.buyButton}>
                  <LinearGradient
                    colors={pkg.isPopular ? [Colors.primary, Colors.secondary] : [Colors.primary, Colors.primary + 'cc']}
                    style={styles.buyButtonGradient}
                  >
                    {purchasing === pkg.id ? (
                      <Text style={styles.buyButtonText}>Processing...</Text>
                    ) : (
                      <>
                        <Text style={styles.buyButtonText}>Get Now</Text>
                        <ChevronLeft size={16} color={Colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
                      </>
                    )}
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}

        {/* Info Section */}
        <LinearGradient
          colors={[Colors.primary + '20', Colors.secondary + '10']}
          style={styles.infoSection}
        >
          <Text style={styles.infoTitle}>💡 How It Works</Text>
          <View style={styles.infoSteps}>
            <InfoStep number="1" text="Choose a package above" />
            <InfoStep number="2" text="Instant delivery (demo mode)" />
            <InfoStep number="3" text="Use DCoins for challenges" />
            <InfoStep number="4" text="Earn more by completing!" />
          </View>
        </LinearGradient>

        {/* Production Note */}
        <View style={styles.productionNote}>
          <Text style={styles.productionNoteTitle}>🚀 Production Version</Text>
          <Text style={styles.productionNoteText}>
            In production, payments will be processed securely through Stripe with:
          </Text>
          <Text style={styles.productionNoteList}>
            • Credit/Debit card support{'\n'}
            • Apple Pay & Google Pay{'\n'}
            • Secure payment processing{'\n'}
            • Instant delivery{'\n'}
            • Purchase history & receipts
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function InfoStep({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.infoStep}>
      <View style={styles.infoStepNumber}>
        <Text style={styles.infoStepNumberText}>{number}</Text>
      </View>
      <Text style={styles.infoStepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.lg, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl },
  backButton: { marginBottom: Spacing.lg },
  backButtonInner: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center' },
  headerContent: { marginBottom: Spacing.lg },
  headerTitle: { fontSize: 36, fontWeight: '900', color: Colors.text, marginBottom: 4, letterSpacing: -1 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
  balanceCard: { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  balanceLabel: { fontSize: 13, color: 'rgba(255, 255, 255, 0.7)', marginBottom: Spacing.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: Colors.text },
  balanceCurrency: { fontSize: 16, fontWeight: '700', color: 'rgba(255, 255, 255, 0.7)' },
  content: { flex: 1, padding: Spacing.lg },
  demoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success + '20', borderWidth: 1, borderColor: Colors.success, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, gap: Spacing.sm },
  demoTextContainer: { flex: 1 },
  demoTitle: { fontSize: 14, fontWeight: '800', color: Colors.success, marginBottom: 2 },
  demoText: { fontSize: 12, color: Colors.text },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md, letterSpacing: -0.3 },
  packageCard: { marginBottom: Spacing.md },
  packageGradient: { borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, position: 'relative' },
  popularBadge: { position: 'absolute', top: Spacing.md, right: Spacing.md, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.warning + '30', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 4 },
  popularText: { fontSize: 10, fontWeight: '800', color: Colors.warning, letterSpacing: 0.5 },
  packageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.md },
  packageIconWrapper: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  packageTitleSection: { flex: 1 },
  packageName: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  bonusBadge: { backgroundColor: Colors.success + '30', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
  bonusText: { fontSize: 11, fontWeight: '800', color: Colors.success },
  packageAmount: { marginBottom: Spacing.lg },
  packageDCoins: { fontSize: 40, fontWeight: '900', color: Colors.primary },
  packageLabel: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  packageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceSection: {},
  priceText: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 2 },
  pricePerCoin: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  buyButton: { },
  buyButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.xs },
  buyButtonText: { fontSize: 15, fontWeight: '800', color: Colors.text },
  infoSection: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginTop: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  infoTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  infoSteps: { gap: Spacing.md },
  infoStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  infoStepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  infoStepNumberText: { fontSize: 14, fontWeight: '800', color: Colors.text },
  infoStepText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  productionNote: { marginTop: Spacing.xl, padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border },
  productionNoteTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  productionNoteText: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.sm, lineHeight: 20 },
  productionNoteList: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22 },
  bottomPadding: { height: Spacing.xxl },
});