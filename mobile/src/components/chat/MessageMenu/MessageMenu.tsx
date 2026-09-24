import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export interface MessageMenuItem<K extends string = string> {
  key: K;
  label: string;
  icon: IconName;
  danger?: boolean;
}

export interface MessageMenuProps<K extends string = string> {
  items: readonly MessageMenuItem<K>[];
  onPick: (key: K) => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  menu: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: ms(18),
    overflow: 'hidden',
    minWidth: s(200),
    shadowColor: colors.black,
    shadowOpacity: 0.45,
    shadowRadius: ms(15),
    shadowOffset: { width: 0, height: ms(10) },
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ms(16),
    paddingVertical: ms(12),
    paddingHorizontal: ms(16),
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
}));

/** Action list under a long-pressed bubble (Reply · Forward · Copy · … · Delete). */
export default function MessageMenu<K extends string = string>({ items, onPick, style }: MessageMenuProps<K>) {
  const styles = useStyles();
  return (
    <View style={[styles.menu, style]} accessibilityRole="menu">
      {items.map((it, i) => (
        <Pressable
          key={it.key}
          accessibilityRole="menuitem"
          accessibilityLabel={it.label}
          onPress={() => onPick(it.key)}
          style={({ pressed }) => [
            styles.item,
            i > 0 && styles.divider,
            pressed && { backgroundColor: colors.surface3 },
          ]}
        >
          <AppText variant="body" weight="semibold" color={it.danger ? 'rose' : 'text'}>
            {it.label}
          </AppText>
          <Icon name={it.icon} size={19} color={it.danger ? 'rose' : 'muted'} />
        </Pressable>
      ))}
    </View>
  );
}
