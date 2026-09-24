/**
 * Hive Chat design tokens — the ONLY place raw colours / radii / font sizes live.
 * Mirrors the :root variables of `Claude outputs/hive-chat-ui.html`.
 * Keep web/src/theme/tokens.ts identical once the web app is built.
 */

export const colors = {
  // brand (Ocean) — change only these to re-theme the app
  accent: '#3D8BFF',
  accent2: '#86B6FF', // lighter tint
  accentDeep: '#1F68E0', // pressed / gradient end
  onAccent: '#FFFFFF', // text & icons on accent
  tick: '#D6F3FF', // read ticks inside outgoing bubble

  // neutrals (dark theme)
  bg: '#0C0D12',
  surface: '#14151C',
  surface2: '#1C1D26',
  surface3: '#262733',
  line: '#2A2B37',
  text: '#F2F2F7',
  muted: '#9A9CAE',
  faint: '#666879',
  dark: '#12121A', // text on pastel fills (avatars)

  // status
  mint: '#4FD1A5', // online / success
  rose: '#FF6B6B', // danger / missed call
  sky: '#6CB8FF', // read ticks on incoming

  // surfaces used by specific screens
  wall: '#0E0F15', // chat wallpaper base
  ringSeen: '#3A3B48', // viewed Buzz ring
  onMint: '#062016', // icon on the accept-call button
  white: '#FFFFFF',
  black: '#000000',
  shade: '#101118', // dark end of media placeholders
  callMid: '#111219',
  callEnd: '#0A0B0F',
  warnText: '#FFB3B3',
  sun: '#FFE3A3', // media placeholder art
} as const;

/**
 * Category tints — coloured icon tiles (settings), attachment actions,
 * media placeholders. Illustrative only, never a brand colour.
 */
export const tints = {
  accent: colors.accent,
  blue: '#5B95E8',
  green: '#3FBF8A',
  purple: '#A36AE8',
  coral: '#F06A55',
  teal: '#45B9C0',
  yellow: '#E8C24A',
  pink: '#E7609E',
  orange: '#F0A92C',
  stone: '#A39A86',
  rose: colors.rose,
  sky: colors.sky,
} as const;

/** Avatar gradient pairs [light, deep]; index 0 follows the accent. */
export const avatarPalette = [
  [colors.accent2, colors.accent],
  ['#A6F0CF', '#3FBF8A'],
  ['#FFB4A8', '#F06A55'],
  ['#E3C4FF', '#A36AE8'],
  ['#FFE0A3', '#F2A93B'],
  ['#FFE9A8', '#E8C24A'],
  ['#B8F0F0', '#45B9C0'],
  ['#FFC6E0', '#E7609E'],
] as const satisfies readonly (readonly [string, string])[];

/** Colour-coded sender names in group chats. */
export const senderColors = ['#C79BFF', '#5ED6A6', '#FF8FC0', colors.accent2, '#FFD37A', '#7FD8DE'] as const;

export const radius = { xs: 6, sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

export const font = {
  family: 'Plus Jakarta Sans',
  size: { xxs: 10.5, xs: 11.5, sm: 13, md: 14.5, lg: 16, xl: 20, title: 24, hero: 30 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800' },
} as const;

/** Loaded font files per weight (Android needs one family per weight). */
export const fontFamilies = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  heavy: 'PlusJakartaSans_800ExtraBold',
} as const;

export type ColorToken = keyof typeof colors;
export type Tint = keyof typeof tints;
export type AvatarColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type FontWeight = keyof typeof font.weight;
export type FontSize = keyof typeof font.size;

/** `#RRGGBB` + opacity → `rgba()`; used for tinted fills like rgba(accent, .14). */
export function withAlpha(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
