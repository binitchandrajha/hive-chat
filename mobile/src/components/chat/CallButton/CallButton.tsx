import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, type ColorToken } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export type CallButtonVariant = 'default' | 'on' | 'end' | 'ok';

export interface CallButtonProps {
  icon: IconName;
  variant?: CallButtonVariant;
  /** 68dp instead of 54dp (incoming-call accept / decline). */
  big?: boolean;
  /** Visible caption under the button; also used as the accessibility label. */
  label?: string;
  /** Accessibility label when there is no visible `label`. */
  a11yLabel?: string;
  /** Design size override (e.g. 48 for the small "Message" action). */
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const LOOK: Record<CallButtonVariant, { bg: string; fg: ColorToken }> = {
  default: { bg: colors.surface3, fg: 'text' },
  on: { bg: colors.text, fg: 'dark' },
  end: { bg: colors.rose, fg: 'white' },
  ok: { bg: colors.mint, fg: 'onMint' },
};

const useStyles = makeStyles(({ ms }) => ({
  wrap: { alignItems: 'center', gap: ms(8) },
  btn: { alignItems: 'center', justifyContent: 'center' },
}));

/** Round call control (mute, speaker, video, hang up, accept). */
export default function CallButton({
  icon,
  variant = 'default',
  big = false,
  label,
  a11yLabel,
  size,
  onPress,
  style,
}: CallButtonProps) {
  const styles = useStyles();
  const { s } = useResponsive();
  const px = s(size ?? (big ? 68 : 54));
  const look = LOOK[variant];
  // The phone glyph rotated 135° reads as "hang up".
  const rotate = icon === 'phone' && variant === 'end' ? 135 : undefined;
  const iconSize = big ? 28 : size !== undefined && size < 54 ? 20 : 24;

  const button = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? a11yLabel}
      accessibilityState={variant === 'on' ? { selected: true } : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { width: px, height: px, borderRadius: px / 2, backgroundColor: look.bg, opacity: pressed ? 0.8 : 1 },
        !label && style,
      ]}
    >
      <Icon name={icon} size={iconSize} color={look.fg} rotate={rotate} />
    </Pressable>
  );

  if (!label) return button;
  return (
    <View style={[styles.wrap, style]}>
      {button}
      <AppText variant="caption" weight="semibold" color="muted">
        {label}
      </AppText>
    </View>
  );
}
