import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, PlusCircle, Zap, User, Play } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../utils/constants/themes';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 16,
          left: 16,
          right: 16,
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          borderRadius: BorderRadius.xl,
          height: 68,
          paddingBottom: 12,
          paddingTop: 12,
          paddingHorizontal: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          borderWidth: 1,
          borderColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          marginHorizontal: 2,
        },
        tabBarBackground: () => null, // Remove default background
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <ModernIconWrapper focused={focused} color={color}>
              <Home 
                size={22} 
                color={focused ? Colors.text : color}
                strokeWidth={2.5}
              />
            </ModernIconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="stream"
        options={{
          title: 'Stream',
          tabBarIcon: ({ color, focused }) => (
            <ModernIconWrapper focused={focused} color={color}>
              <Zap 
                size={22} 
                color={focused ? Colors.text : color}
                strokeWidth={2.5}
                fill={focused ? Colors.text : 'none'}
              />
            </ModernIconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <FloatingCreateButton focused={focused}>
              <PlusCircle 
                size={32} 
                color={Colors.text}
                strokeWidth={2.5}
              />
            </FloatingCreateButton>
          ),
        }}
      />
      <Tabs.Screen
        name="watch"
        options={{
          title: 'Watch',
          tabBarIcon: ({ color, focused }) => (
            <ModernIconWrapper focused={focused} color={color}>
              <Play 
                size={22} 
                color={focused ? Colors.text : color}
                strokeWidth={2.5}
                fill={focused ? Colors.text : 'none'}
              />
            </ModernIconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <ModernIconWrapper focused={focused} color={color}>
              <User 
                size={22} 
                color={focused ? Colors.text : color}
                strokeWidth={2.5}
              />
            </ModernIconWrapper>
          ),
        }}
      />
    </Tabs>
  );
}

function ModernIconWrapper({ 
  focused, 
  color,
  children 
}: { 
  focused: boolean;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[
      styles.modernIconWrapper,
      focused && styles.modernIconWrapperFocused
    ]}>
      {children}
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

function FloatingCreateButton({ 
  focused,
  children 
}: { 
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={[
      styles.floatingButton,
      focused && styles.floatingButtonFocused
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  modernIconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    position: 'relative',
  },
  modernIconWrapperFocused: {
    backgroundColor: Colors.primary,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 4,
    borderColor: Colors.background,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  floatingButtonFocused: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.background,
    transform: [{ scale: 1.05 }],
  },
});