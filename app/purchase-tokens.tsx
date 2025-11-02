import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, BorderRadius } from '../utils/constants/themes';
import { Config } from '../utils/constants/config';
import Button from '../components/common/Button';

export default function PurchaseTokensScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
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
        {/* Packages */}
        <Text style={styles.sectionTitle}>Choose Package</Text>
        
        {Config.PURCHASE_PACKAGES.map((pkg) => (
          <Pressable key={pkg.id} style={styles.packageCard}>
            <LinearGradient
              colors={pkg.isPopular 
                ? ['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.2)']
                : ['rgba(30, 33, 57, 0.8)', 'rgba(30, 33, 57, 0.6)']}
              style={styles.packageGradient}
            >
              {pkg.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>⭐ POPULAR</Text>
                </View>
              )}
              
              <Text style={styles.packageName}>{pkg.name}</Text>
              
              <View style={styles.packageAmount}>
                <Text style={styles.packageEmoji}>🪙</Text>
                <Text style={styles.packageDCoins}>{pkg.dcoins.toLocaleString()}</Text>
                <Text style={styles.packageLabel}>DCoins</Text>
              </View>

              {pkg.bonusPercentage > 0 && (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusText}>+{pkg.bonusPercentage}% BONUS</Text>
                </View>
              )}

              <View style={styles.packagePrice}>
                <Text style={styles.priceText}>${pkg.price}</Text>
                <Text style={styles.pricePerCoin}>
                  ${(pkg.price / pkg.dcoins).toFixed(4)} per coin
                </Text>
              </View>

              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming in Day 3! 🚀</Text>
              </View>
            </LinearGradient>
          </Pressable>
        ))}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 How it works</Text>
          <Text style={styles.infoText}>
            1. Choose a package above{'\n'}
            2. Complete secure payment{'\n'}
            3. DCoins added instantly to your balance{'\n'}
            4. Use DCoins to create or complete challenges
          </Text>
        </View>

        <View style={styles.bottomPadding} />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  packageCard: {
    marginBottom: Spacing.md,
  },
  packageGradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.background,
  },
  packageName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  packageAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  packageEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  packageDCoins: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
  },
  packageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
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
  packagePrice: {
    marginBottom: Spacing.md,
  },
  priceText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  pricePerCoin: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  comingSoonBadge: {
    backgroundColor: Colors.warning + '20',
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});