import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { colors, type ColorToken } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import Icon, { type IconName } from '../Icon/Icon';

export type IconButtonVariant = 'plain' | 'fill' | 'accent';

export interface IconButtonProps {
  icon: IconName;
  /** Accessibility label — required, the button has no visible text. */
  label: string;
  variant?: IconButtonVariant;
  onPress?: () => void;
  /** Design size of the round button (default 40). */
  size?: number;
  iconSize?: number;
  /** Override the icon colour (e.g. `accent` for a call action in a row). */
  color?: ColorToken | (string & {});
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BG: Record<IconButtonVariant, string> = {
  plain: 'transparent',
  fill: colors.surface2,
  accent: colors.accent,
};

const useStyles = makeStyles(() => ({
  base: { alignItems: 'center', justifyContent: 'center' },
}));

/** Round icon-only button. */
export default function IconButton({
  icon,
  label,
  variant = 'plain',
  onPress,
  size = 40,
  iconSize = 22,
  color,
  disabled = false,
  style,
}: IconButtonProps) {
  const styles = useStyles();
  const { s } = useResponsive();
  const px = s(size);
  const fg = color ?? (variant === 'accent' ? 'onAccent' : 'text');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      hitSlop={s(4)}
      style={({ pressed }) => [
        styles.base,
        {
          width: px,
          height: px,
          borderRadius: px / 2,
          backgroundColor: pressed && variant === 'plain' ? colors.surface3 : BG[variant],
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Icon name={icon} size={iconSize} color={fg} />
    </Pressable>
  );
}
