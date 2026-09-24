import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, type Tint } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';
import IconTile from '../../ui/IconTile/IconTile';

export interface SettingsRowProps {
  icon: IconName;
  /** Tile tint (default accent). */
  color?: Tint;
  title: string;
  sub?: string;
  /** Current value shown before the chevron ("Contacts", "1.2 GB"). */
  value?: string;
  /** `chevron` (default), `none`, or a node such as a Toggle. */
  right?: 'chevron' | 'none' | ReactNode;
  /** Rose title for destructive rows (Block, Report, Exit group). */
  danger?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(14),
    paddingVertical: ms(14),
    paddingHorizontal: ms(16),
  },
  text: { flex: 1, minWidth: 0 },
  sub: { marginTop: ms(2) },
  value: { flexShrink: 0, maxWidth: '40%' },
}));

/** One row in a SettingsGroup card: coloured icon tile, title/sub, value and trailing control. */
export default function SettingsRow({
  icon,
  color = 'accent',
  title,
  sub,
  value,
  right = 'chevron',
  danger = false,
  onPress,
  style,
}: SettingsRowProps) {
  const styles = useStyles();
  const trailing =
    right === 'chevron' ? <Icon name="right" size={18} color="faint" /> : right === 'none' ? null : right;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={value ? `${title}, ${value}` : title}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface2 }, style]}
    >
      <IconTile icon={icon} color={danger ? 'rose' : color} />
      <View style={styles.text}>
        <AppText variant="body" weight="semibold" color={danger ? 'rose' : 'text'} numberOfLines={1}>
          {title}
        </AppText>
        {sub ? (
          <AppText variant="caption" weight="regular" color="muted" numberOfLines={2} style={styles.sub}>
            {sub}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="small" weight="regular" color="muted" numberOfLines={1} style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {trailing}
    </Pressable>
  );
}
