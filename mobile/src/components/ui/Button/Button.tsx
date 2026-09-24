import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, withAlpha, type ColorToken } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../AppText/AppText';
import Gradient from '../Gradient/Gradient';
import Icon, { type IconName } from '../Icon/Icon';

export type ButtonVariant = 'primary' | 'ghost' | 'text' | 'danger';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const FG: Record<ButtonVariant, ColorToken> = {
  primary: 'onAccent',
  ghost: 'text',
  text: 'accent',
  danger: 'rose',
};

const useStyles = makeStyles(({ s, ms }) => ({
  base: {
    height: s(52),
    borderRadius: ms(radius.md),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
    paddingHorizontal: ms(16),
    alignSelf: 'stretch',
  },
  primary: {
    shadowColor: colors.accent,
    shadowOpacity: 0.22,
    shadowRadius: ms(11),
    shadowOffset: { width: 0, height: ms(8) },
    elevation: 4,
  },
  ghost: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line },
  text: { height: s(40) },
  danger: { backgroundColor: withAlpha(colors.rose, 0.12) },
  fill: { ...StyleSheet.absoluteFillObject, borderRadius: ms(radius.md) },
}));

/** Full-width action button: primary · ghost · text · danger. */
export default function Button({
  label,
  variant = 'primary',
  icon,
  disabled = false,
  onPress,
  style,
}: ButtonProps) {
  const styles = useStyles();
  const fg = FG[variant];
  const content = (
    <>
      {icon ? <Icon name={icon} size={20} color={fg} /> : null}
      <AppText variant="bodyLg" weight="bold" color={fg} numberOfLines={1}>
        {label}
      </AppText>
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.4 : pressed ? 0.85 : 1, alignSelf: 'stretch' },
        style,
      ]}
    >
      {variant === 'primary' ? (
        <View style={[styles.base, styles.primary]}>
          <Gradient
            colors={[colors.accent, colors.accentDeep]}
            style={styles.fill}
          />
          {content}
        </View>
      ) : (
        <View style={[styles.base, styles[variant]]}>{content}</View>
      )}
    </Pressable>
  );
}
