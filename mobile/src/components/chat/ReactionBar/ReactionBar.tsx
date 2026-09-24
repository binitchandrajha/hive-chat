import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon from '../../ui/Icon/Icon';

export const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'] as const;

export interface ReactionBarProps {
  /** Emoji the user already reacted with. */
  active?: string;
  onPick: (emoji: string) => void;
  /** "+" opens the full emoji picker. */
  onMore?: () => void;
  emojis?: readonly string[];
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: s(999),
    paddingVertical: ms(6),
    paddingHorizontal: ms(8),
    shadowColor: colors.black,
    shadowOpacity: 0.45,
    shadowRadius: ms(15),
    shadowOffset: { width: 0, height: ms(10) },
    elevation: 10,
  },
  item: { width: s(38), height: s(38), borderRadius: s(19), alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: fs(24) },
}));

/** Quick reactions shown above a long-pressed bubble. */
export default function ReactionBar({ active, onPick, onMore, emojis = QUICK_REACTIONS, style }: ReactionBarProps) {
  const styles = useStyles();
  return (
    <View style={[styles.bar, style]}>
      {emojis.map((e) => (
        <Pressable
          key={e}
          accessibilityRole="button"
          accessibilityLabel={`React ${e}`}
          accessibilityState={{ selected: e === active }}
          onPress={() => onPick(e)}
          style={[styles.item, e === active && { backgroundColor: colors.surface3 }]}
        >
          <AppText style={styles.emoji}>{e}</AppText>
        </Pressable>
      ))}
      {onMore ? (
        <Pressable accessibilityRole="button" accessibilityLabel="More reactions" onPress={onMore} style={styles.item}>
          <Icon name="plus" size={20} color="muted" />
        </Pressable>
      ) : null}
    </View>
  );
}
