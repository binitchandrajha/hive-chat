import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { colors, font, fontFamilies, type ColorToken, type FontWeight } from '../../../theme';
import { makeStyles, MAX_FONT_MULTIPLIER } from '../../../utils/responsive';

export type AppTextVariant =
  | 'hero' // 30 · welcome headline
  | 'headline' // 26 · onboarding step titles
  | 'title' // 24 · large app bar
  | 'heading' // 20
  | 'subtitle' // 17 · compact app bar, sheet titles
  | 'bodyLg' // 16
  | 'body' // 14.5 · messages, rows
  | 'small' // 13
  | 'caption' // 11.5 · times, captions
  | 'overline'; // 12 uppercase section titles

export interface AppTextProps extends Omit<TextProps, 'style'> {
  children?: ReactNode;
  variant?: AppTextVariant;
  color?: ColorToken;
  weight?: FontWeight;
  align?: TextStyle['textAlign'];
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

const DEFAULT_WEIGHT: Record<AppTextVariant, FontWeight> = {
  hero: 'heavy',
  headline: 'heavy',
  title: 'heavy',
  heading: 'heavy',
  subtitle: 'bold',
  bodyLg: 'semibold',
  body: 'regular',
  small: 'medium',
  caption: 'semibold',
  overline: 'bold',
};

const useStyles = makeStyles(({ fs }) => ({
  hero: { fontSize: fs(font.size.hero), lineHeight: fs(33), letterSpacing: -1.2 },
  headline: { fontSize: fs(26), lineHeight: fs(31), letterSpacing: -0.8 },
  title: { fontSize: fs(font.size.title), letterSpacing: -0.7 },
  heading: { fontSize: fs(font.size.xl), letterSpacing: -0.4 },
  subtitle: { fontSize: fs(17), letterSpacing: -0.2 },
  bodyLg: { fontSize: fs(font.size.lg) },
  body: { fontSize: fs(font.size.md), lineHeight: fs(20.5) },
  small: { fontSize: fs(font.size.sm), lineHeight: fs(18) },
  caption: { fontSize: fs(font.size.xs) },
  overline: { fontSize: fs(12), letterSpacing: 0.7, textTransform: 'uppercase' },
}));

/** Every piece of text in the app. Caps system font scaling so layouts never break. */
export default function AppText({
  children,
  variant = 'body',
  color = 'text',
  weight,
  align,
  numberOfLines,
  style,
  ...rest
}: AppTextProps) {
  const styles = useStyles();
  const w = weight ?? DEFAULT_WEIGHT[variant];
  return (
    <Text
      maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}
      numberOfLines={numberOfLines}
      style={[
        styles[variant],
        { color: colors[color], fontFamily: fontFamilies[w], textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
