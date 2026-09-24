import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export interface QuickAction {
  icon: IconName;
  label: string;
  onPress?: () => void;
}

export interface QuickActionsProps {
  items: readonly QuickAction[];
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  row: {
    flexDirection: 'row',
    gap: ms(10),
    justifyContent: 'center',
    paddingTop: ms(4),
    paddingHorizontal: ms(16),
    paddingBottom: ms(12),
  },
  item: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: ms(18),
    paddingTop: ms(12),
    paddingBottom: ms(10),
    alignItems: 'center',
    gap: ms(6),
  },
}));

/** Row of action cards under a ProfileHeader (Audio · Video · Search · Mute). */
export default function QuickActions({ items, style }: QuickActionsProps) {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]}>
      {items.map((a) => (
        <Pressable
          key={a.label}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          onPress={a.onPress}
          style={({ pressed }) => [styles.item, pressed && { backgroundColor: colors.surface2 }]}
        >
          <Icon name={a.icon} size={22} color="accent" />
          <AppText variant="caption" weight="bold" color="accent" numberOfLines={1}>
            {a.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
