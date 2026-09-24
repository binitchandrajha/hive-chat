import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha, type ColorToken } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export type BannerVariant = 'accent' | 'warn';

export interface BannerProps {
  text: string;
  /** Bold first line above `text` ("Focus hours", "Create a Hive"). */
  title?: string;
  variant?: BannerVariant;
  icon?: IconName;
  /** Replaces the icon (e.g. the Logo on "Create a Hive"). */
  leading?: ReactNode;
  /** Trailing control (Toggle, plus icon). */
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const LOOK: Record<BannerVariant, { base: string; fg: ColorToken }> = {
  accent: { base: colors.accent, fg: 'accent2' },
  warn: { base: colors.rose, fg: 'warnText' },
};

const useStyles = makeStyles(({ ms }) => ({
  banner: {
    marginHorizontal: ms(16),
    marginVertical: ms(8),
    borderRadius: ms(16),
    paddingVertical: ms(12),
    paddingHorizontal: ms(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
    borderWidth: 1,
  },
  text: { flex: 1, minWidth: 0 },
}));

/** Inline info / warning banner. */
export default function Banner({ text, title, variant = 'accent', icon = 'info', leading, right, onPress, style }: BannerProps) {
  const styles = useStyles();
  const look = LOOK[variant];
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.banner,
        { backgroundColor: withAlpha(look.base, 0.1), borderColor: withAlpha(look.base, variant === 'accent' ? 0.28 : 0.25) },
        style,
      ]}
    >
      {leading ?? <Icon name={icon} size={20} color={look.fg} />}
      <View style={styles.text}>
        {title ? (
          <AppText variant="body" weight="bold" numberOfLines={1}>
            {title}
          </AppText>
        ) : null}
        <AppText variant={title ? 'caption' : 'small'} weight="medium" color={look.fg}>
          {text}
        </AppText>
      </View>
      {right}
    </Pressable>
  );
}
