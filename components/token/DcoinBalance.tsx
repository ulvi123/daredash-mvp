import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import { Config } from '../../utils/constants/config';
import * as Haptics from 'expo-haptics';

interface DCoinBalanceProps {
  balance: number;
  showUSD?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function DCoinBalance({
  balance,
  showUSD = true,
  onPress,
  size = 'medium',
}: DCoinBalanceProps) {
  const router = useRouter();
  const usdValue = (balance * Config.DCOIN_VALUE_USD).toFixed(2);

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push('/purchase-tokens');
    }
  };

  const getStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          coinText: styles.coinTextSmall,
          usdText: styles.usdTextSmall,
          icon: styles.iconSmall,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          coinText: styles.coinTextLarge,
          usdText: styles.usdTextLarge,
          icon: styles.iconLarge,
        };
      default:
        return {
          container: styles.containerMedium,
          coinText: styles.coinTextMedium,
          usdText: styles.usdTextMedium,
          icon: styles.iconMedium,
        };
    }
  };

  const sizeStyles = getStyles();

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [pressed && styles.pressed]}>
      <LinearGradient
        colors={['rgba(0, 128, 255, 0.2)', 'rgba(160, 32, 240, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, sizeStyles.container]}
      >
        <View style={styles.content}>
          {/* Coin Icon */}
          <View style={styles.iconContainer}>
            <Text style={[styles.coinIcon, sizeStyles.icon]}>🪙</Text>
          </View>

          {/* Balance Info */}
          <View style={styles.balanceInfo}>
            <Text style={[styles.coinText, sizeStyles.coinText]}>
              {formatNumber(balance)} <Text style={styles.coinLabel}>DC</Text>
            </Text>
            {showUSD && (
              <Text style={[styles.usdText, sizeStyles.usdText]}>
                ${usdValue} USD
              </Text>
            )}
          </View>

          {/* Add Button */}
          <View style={styles.addButton}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 255, 0.3)',
    overflow: 'hidden',
  },
  containerSmall: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  containerMedium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  containerLarge: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  coinIcon: {
    fontSize: 24,
  },
  iconSmall: {
    fontSize: 20,
  },
  iconMedium: {
    fontSize: 24,
  },
  iconLarge: {
    fontSize: 32,
  },
  balanceInfo: {
    flex: 1,
  },
  coinText: {
    fontWeight: '800',
    color: Colors.text,
  },
  coinTextSmall: {
    fontSize: 14,
  },
  coinTextMedium: {
    fontSize: 18,
  },
  coinTextLarge: {
    fontSize: 24,
  },
  coinLabel: {
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  usdText: {
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  usdTextSmall: {
    fontSize: 10,
  },
  usdTextMedium: {
    fontSize: 12,
  },
  usdTextLarge: {
    fontSize: 14,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  plusIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: -2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});