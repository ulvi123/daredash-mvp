export const Colors = {
    // Brand colors
    primary: '#0080FF',      // Electric Blue
    secondary: '#A020F0',    // Neon Purple
    accent: '#FFD700',       // Bright Yellow
    success: '#00FF88',      // Vivid Green
    danger: '#FF4444',       // Hot Red
    warning: '#FFA500',      // Orange
    
    // Backgrounds
    background: '#0A0E27',   // Dark Navy
    surface: '#1E2139',      // Slate Gray
    surfaceLight: '#2A2E4A', // Lighter slate
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    textMuted: '#6B7280',
    
    // Borders
    border: '#2A2E4A',
    borderLight: '#3A3E5A',
    
    // Overlays
    overlay: 'rgba(10, 14, 39, 0.9)',
    overlayLight: 'rgba(10, 14, 39, 0.7)',
    
    // Status colors
    online: '#00FF88',
    offline: '#6B7280',
    
    // Difficulty colors
    difficulty: {
      1: '#00FF88',  // Easy - Green
      2: '#FFD700',  // Medium - Yellow
      3: '#FFA500',  // Hard - Orange
      4: '#FF4444',  // Very Hard - Red
      5: '#A020F0',  // Extreme - Purple
    },
    
    // Category colors
    category: {
      creative: '#A020F0',
      social: '#0080FF',
      fitness: '#00FF88',
      skill: '#FFD700',
      adventure: '#FF4444',
      random: '#FFA500',
      business: '#00CED1',
    },
  };
  
  export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };
  
  export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  };
  
  export const Typography = {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  };
  
  export const Shadows = {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  };