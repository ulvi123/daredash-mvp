import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const handlePress = () => {
    if (!loading && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor(variant)} />;
    }

    return (
      <>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.text, getTextStyle(variant, size), textStyle]}>
          {title}
        </Text>
      </>
    );
  };

  if (variant === 'primary') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.button,
          getSizeStyle(size),
          fullWidth && styles.fullWidth,
          pressed && styles.pressed,
          (disabled || loading) && styles.disabled,
          style,
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, getSizeStyle(size)]}
        >
          {renderContent()}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getSizeStyle(size),
        getVariantStyle(variant),
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {renderContent()}
    </Pressable>
  );
}

function getSizeStyle(size: ButtonSize): ViewStyle {
  switch (size) {
    case 'small':
      return {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minHeight: 36,
      };
    case 'large':
      return {
        paddingVertical: Spacing.md + 4,
        paddingHorizontal: Spacing.xl,
        minHeight: 56,
      };
    case 'medium':
    default:
      return {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        minHeight: 48,
      };
  }
}

function getVariantStyle(variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.border,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
      };
    case 'danger':
      return {
        backgroundColor: Colors.danger,
      };
    case 'success':
      return {
        backgroundColor: Colors.success,
      };
    default:
      return {};
  }
}

function getTextStyle(variant: ButtonVariant, size: ButtonSize): TextStyle {
  const baseStyle: TextStyle = {
    fontWeight: '700',
    color: getTextColor(variant),
  };

  switch (size) {
    case 'small':
      return { ...baseStyle, fontSize: 14 };
    case 'large':
      return { ...baseStyle, fontSize: 18 };
    case 'medium':
    default:
      return { ...baseStyle, fontSize: 16 };
  }
}

function getTextColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'outline':
      return Colors.primary;
    case 'secondary':
      return Colors.text;
    default:
      return Colors.text;
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
});