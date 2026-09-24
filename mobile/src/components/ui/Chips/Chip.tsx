import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../AppText/AppText';
import Icon, { type IconName } from '../Icon/Icon';

export interface ChipProps {
  label: string;
  /** Small counter bubble after the label. */
  count?: number | string;
  active?: boolean;
  icon?: IconName;
  /** Trailing icon (e.g. `down` for a picker chip). */
  trailingIcon?: IconName;
  size?: 'sm' | 'md';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    borderRadius: s(999),
    borderWidth: 1,
  },
  md: { height: s(32), paddingHorizontal: ms(14) },
  sm: { height: s(24), paddingHorizontal: ms(10) },
  count: {
    backgroundColor: colors.accent,
    borderRadius: s(999),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
  countText: { fontSize: fs(10) },
}));

/** Pill used for filters, tags ("Admin"), actions ("Join", "Say hi 👋") and pickers. */
export default function Chip({
  label,
  count,
  active = false,
  icon,
  trailingIcon,
  size = 'md',
  onPress,
  style,
}: ChipProps) {
  const styles = useStyles();
  const fg = active ? 'accent' : 'muted';
  const body = (
    <View
      style={[
        styles.chip,
        styles[size],
        {
          backgroundColor: active ? withAlpha(colors.accent, 0.14) : colors.surface2,
          borderColor: active ? withAlpha(colors.accent, 0.35) : colors.line,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 13 : 15} color={fg} /> : null}
      <AppText variant={size === 'sm' ? 'caption' : 'small'} weight="semibold" color={fg} numberOfLines={1}>
        {label}
      </AppText>
      {count !== undefined ? (
        <View style={styles.count}>
          <AppText weight="heavy" color="onAccent" style={styles.countText}>
            {count}
          </AppText>
        </View>
      ) : null}
      {trailingIcon ? <Icon name={trailingIcon} size={14} color={fg} /> : null}
    </View>
  );

  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress}>
      {body}
    </Pressable>
  );
}
