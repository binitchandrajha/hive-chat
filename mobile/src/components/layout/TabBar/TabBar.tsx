import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, withAlpha } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export type TabKey = 'chats' | 'buzz' | 'calls' | 'hives' | 'me';

export interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  /** Dot on the Buzz tab when there are unseen updates. */
  newBuzz?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TABS: readonly { key: TabKey; icon: IconName; label: string }[] = [
  { key: 'chats', icon: 'chat', label: 'Chats' },
  { key: 'buzz', icon: 'buzz', label: 'Buzz' },
  { key: 'calls', icon: 'phone', label: 'Calls' },
  { key: 'hives', icon: 'hex', label: 'Hives' },
  { key: 'me', icon: 'user', label: 'You' },
];

/** Height the TabBar covers — add as bottom padding to lists behind it. */
export const TAB_BAR_SPACE = 110;

const useStyles = makeStyles(({ s, ms, fs }) => ({
  bar: {
    position: 'absolute',
    left: ms(14),
    right: ms(14),
    height: s(64),
    borderRadius: ms(24),
    backgroundColor: withAlpha(colors.surface2, 0.96),
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: ms(6),
    zIndex: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: ms(15),
    shadowOffset: { width: 0, height: ms(12) },
    elevation: 12,
  },
  tab: {
    alignItems: 'center',
    gap: ms(3),
    paddingVertical: ms(6),
    paddingHorizontal: ms(10),
    borderRadius: ms(16),
  },
  label: { fontSize: fs(10.5) },
  pip: {
    position: 'absolute',
    top: ms(2),
    right: ms(8),
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface2,
  },
}));

/** Floating pill tab bar: Chats · Buzz · Calls · Hives · You. */
export default function TabBar({ active, onChange, newBuzz = false, style }: TabBarProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { ms, isTablet, contentWidth, width } = useResponsive();
  const side = isTablet ? (width - contentWidth) / 2 + ms(14) : undefined;

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        { bottom: Math.max(insets.bottom, ms(8)) + ms(8) },
        side !== undefined && { left: side, right: side },
        style,
      ]}
    >
      {TABS.map((t) => {
        const on = t.key === active;
        const fg = on ? 'accent' : 'faint';
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.label}
            onPress={() => onChange(t.key)}
            style={[styles.tab, on && { backgroundColor: withAlpha(colors.accent, 0.1) }]}
          >
            <Icon name={t.icon} size={22} color={fg} />
            <AppText weight="bold" color={fg} style={styles.label}>
              {t.label}
            </AppText>
            {t.key === 'buzz' && newBuzz && !on ? <View style={styles.pip} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}
