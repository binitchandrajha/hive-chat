import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha, type ColorToken } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';

export interface ListRowProps {
  /** Avatar, IconTile… */
  leading?: ReactNode;
  title: string;
  titleColor?: ColorToken;
  /** Right of the title line (time). */
  meta?: ReactNode;
  /** Second line: a string renders as muted text, or pass a custom node. */
  sub?: ReactNode;
  /** Right of the second line (badges, mute/pin icons). */
  subRight?: ReactNode;
  /** Vertically centred at the end (checkbox, chevron, call button, chip). */
  right?: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(13),
    paddingVertical: ms(10),
    paddingHorizontal: ms(16),
  },
  main: { flex: 1, minWidth: 0, gap: ms(3) },
  line: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
  title: { flex: 1, flexShrink: 1 },
  subLine: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
}));

/** Base list row: leading visual, title/sub lines, trailing slots. */
export default function ListRow({
  leading,
  title,
  titleColor = 'text',
  meta,
  sub,
  subRight,
  right,
  selected = false,
  onPress,
  onLongPress,
  accessibilityLabel,
  style,
}: ListRowProps) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={selected ? { selected } : undefined}
      disabled={!onPress && !onLongPress}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.row,
        selected && { backgroundColor: withAlpha(colors.accent, 0.07) },
        pressed && { backgroundColor: colors.surface },
        style,
      ]}
    >
      {leading}
      <View style={styles.main}>
        <View style={styles.line}>
          <AppText variant="body" weight="bold" color={titleColor} numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
          {meta}
        </View>
        {sub !== undefined || subRight ? (
          <View style={styles.subLine}>
            {typeof sub === 'string' ? (
              <AppText variant="small" weight="regular" color="muted" numberOfLines={1} style={styles.title}>
                {sub}
              </AppText>
            ) : (
              <View style={styles.title}>{sub}</View>
            )}
            {subRight}
          </View>
        ) : null}
      </View>
      {right}
    </Pressable>
  );
}
