// Design tokens mirrored 1:1 from the TrailStamp HTML prototype's :root variables.
export const colors = {
  pine: '#1E3D2F',
  pineDark: '#122A20',
  moss: '#5B7553',
  rust: '#BB5A2E',
  rustDark: '#9A491F',
  canvas: '#D9D2B8',
  canvasLight: '#EDE8D7',
  ink: '#2A241C',
  gold: '#C9A648',
  paper: '#FBF8F1',
  danger: '#8B3A3A',
  border: '#E4DDC9',
  borderStrong: '#cfc6ad',
  muted: '#8a8272',
  mutedLight: '#b8ae94',
  bodyText: '#5c5545',
} as const;

export const tierColors = {
  free: { bg: colors.border, fg: colors.muted },
  membership: { bg: '#dfe9dc', fg: colors.pine },
  premium: { bg: colors.gold, fg: '#3a2e0e' },
} as const;

// Font family names come from @expo-google-fonts packages, loaded in App.tsx.
export const fonts = {
  display: 'Oswald_600SemiBold',
  displayBold: 'Oswald_700Bold',
  displayMedium: 'Oswald_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  round: 999,
} as const;

export const theme = { colors, tierColors, fonts, spacing, radii };
export type Theme = typeof theme;
export type MembershipTier = 'free' | 'membership' | 'premium';
