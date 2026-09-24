import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../AppText/AppText';

export interface BadgeProps {
  count: number;
  /** Grey badge for muted chats. */
  muted?: boolean;
  /** Counts above this show as `max+`. */
  max?: number;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  badge: {
    minWidth: s(20),
    height: s(20),
    paddingHorizontal: ms(6),
    borderRadius: s(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: fs(11) },
}));

/** Unread counter pill. Renders nothing for 0. */
export default function Badge({ count, muted = false, max = 99, style }: BadgeProps) {
  const styles = useStyles();
  if (count <= 0) return null;
  return (
    <View
      accessibilityLabel={`${count} unread`}
      style={[styles.badge, { backgroundColor: muted ? colors.surface3 : colors.accent }, style]}
    >
      <AppText weight="heavy" color={muted ? 'muted' : 'onAccent'} style={styles.label}>
        {count > max ? `${max}+` : count}
      </AppText>
    </View>
  );
}
