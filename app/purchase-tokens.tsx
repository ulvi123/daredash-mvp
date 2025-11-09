import { View, Text, StyleSheet, ScrollView, Pressable,Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../utils/constants/themes';
import { Config } from '../utils/constants/config';
import Button from '../components/common/Button';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { TokenService } from '../services/firebase/token.service';
import { BlurView } from 'expo-blur';




export default function PurchaseTokensScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async (packageId: string) => {
    if (!user) return;

    const pkg = Config.PURCHASE_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    // Calculate total DCoins with bonus
    const bonusDCoins = Math.floor(pkg.dcoins * pkg.bonusPercentage / 100);
    const totalDCoins = pkg.dcoins + bonusDCoins;

    Alert.alert(
      'Confirm Purchase',
      `Purchase ${totalDCoins.toLocaleString()} DCoins for $${pkg.price}?\n\n` +
      `Base: ${pkg.dcoins} DC\n` +
      `Bonus: ${bonusDCoins} DC (${pkg.bonusPercentage}%)\n` +
      `Total: ${totalDCoins} DC`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy Now',
          onPress: async () => {
            try {
              setPurchasing(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              // Simulate payment processing
              await new Promise(resolve => setTimeout(resolve, 1500));

              // Add DCoins to account
              await TokenService.addDCoins(
                user.id,
                totalDCoins,
                'purchase',
                `Purchased ${pkg.name} package`,
                {
                  packageId: pkg.id,
                  baseAmount: pkg.dcoins,
                  bonusAmount: bonusDCoins,
                  priceUSD: pkg.price,
                }
              );

              // Refresh user data
              await refreshUser();

              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

              Alert.alert(
                '🎉 Purchase Successful!',
                `${totalDCoins} DCoins added to your account!`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error: any) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Purchase Failed', error.message || 'Please try again');
            } finally {
              setPurchasing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Buy DCoins</Text>
        <Text style={styles.headerSubtitle}>
          Current Balance: {user?.dcoins.toLocaleString() || 0} DC
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <BlurView intensity={40} style={styles.infoBanner}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            For MVP testing: Payment is simulated. DCoins will be added instantly to your account.
          </Text>
        </BlurView>

        <Text style={styles.sectionTitle}>Choose Package</Text>
        
        {Config.PURCHASE_PACKAGES.map((pkg) => {
          const bonusDCoins = Math.floor(pkg.dcoins * pkg.bonusPercentage / 100);
          const totalDCoins = pkg.dcoins + bonusDCoins;

          return (
            <Pressable
              key={pkg.id}
              style={styles.packageCard}
              onPress={() => handlePurchase(pkg.id)}
              disabled={purchasing}
            >
              <BlurView intensity={40} style={styles.packageBlur}>
                <LinearGradient
                  colors={pkg.isPopular 
                    ? ['rgba(102, 126, 234, 0.3)', 'rgba(118, 75, 162, 0.3)']
                    : ['rgba(30, 33, 57, 0.5)', 'rgba(30, 33, 57, 0.3)']}
                  style={styles.packageGradient}
                >
                  {pkg.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>⭐ MOST POPULAR</Text>
                    </View>
                  )}
                  
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  
                  <View style={styles.packageAmount}>
                    <Text style={styles.packageEmoji}>🪙</Text>
                    <View>
                      <Text style={styles.packageDCoins}>{totalDCoins.toLocaleString()}</Text>
                      <Text style={styles.packageBase}>
                        {pkg.dcoins.toLocaleString()} base
                        {bonusDCoins > 0 && ` + ${bonusDCoins.toLocaleString()} bonus`}
                      </Text>
                    </View>
                  </View>

                  {pkg.bonusPercentage > 0 && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusText}>+{pkg.bonusPercentage}% BONUS</Text>
                    </View>
                  )}

                  <View style={styles.packageFooter}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>${pkg.price}</Text>
                      <Text style={styles.pricePerCoin}>
                        ${(pkg.price / totalDCoins).toFixed(4)}/coin
                      </Text>
                    </View>

                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.buyButton}
                    >
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </BlurView>
            </Pressable>
          );
        })}

        {/* How it Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>💡 How it works</Text>
          <BlurView intensity={40} style={styles.howItWorksCard}>
            <StepItem step="1" text="Choose a package above" />
            <StepItem step="2" text="Confirm your purchase" />
            <StepItem step="3" text="DCoins added instantly" />
            <StepItem step="4" text="Start creating or completing challenges!" />
          </BlurView>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>✨ Why buy DCoins?</Text>
          <BlurView intensity={40} style={styles.benefitsCard}>
            <BenefitItem icon="🎨" text="Create unlimited challenges" />
            <BenefitItem icon="🎯" text="Accept premium challenges" />
            <BenefitItem icon="💰" text="Earn more by staking higher" />
            <BenefitItem icon="⚡" text="No transaction limits" />
          </BlurView>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function StepItem({ step, text }: { step: string; text: string }) {
  return (
    <View style={styles.stepItem}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.stepNumber}
      >
        <Text style={styles.stepNumberText}>{step}</Text>
      </LinearGradient>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

function BenefitItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.benefitItem}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={styles.benefitText}>{text}</Text>
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
    paddingBottom: Spacing.xl,
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
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    overflow: 'hidden',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  packageCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  packageBlur: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  packageGradient: {
    padding: Spacing.lg,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.background,
    letterSpacing: 0.5,
  },
  packageName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  packageAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  packageEmoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  packageDCoins: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
  },
  packageBase: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bonusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {},
  priceText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  pricePerCoin: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  buyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  howItWorksSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  howItWorksCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  benefitsSection: {
    marginBottom: Spacing.lg,
  },
  benefitsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});