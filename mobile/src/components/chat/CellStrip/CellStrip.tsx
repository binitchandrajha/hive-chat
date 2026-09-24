import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import type { AvatarSubject } from '../../../types/person';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Avatar, { type AvatarRing } from '../../ui/Avatar/Avatar';
import type { IconName } from '../../ui/Icon/Icon';
import Icon from '../../ui/Icon/Icon';

export interface Cell {
  key: string;
  person: AvatarSubject;
  label: string;
  ring?: AvatarRing;
  online?: boolean;
  /** Icon avatar, e.g. `plus` for "Add". */
  icon?: IconName;
}

export interface CellStripProps {
  items: readonly Cell[];
  onPress?: (cell: Cell) => void;
  /** Shows a small ✕ on each avatar (selected group members). */
  onRemove?: (cell: Cell) => void;
  /** Avatar design size (56 for Hot Cells, 50 for members). */
  size?: number;
  /** Wrap instead of scrolling horizontally. */
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  row: { gap: ms(14), paddingHorizontal: ms(16), paddingTop: ms(6), paddingBottom: ms(10) },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: s(60), alignItems: 'center', gap: ms(6) },
  remove: {
    position: 'absolute',
    right: -s(2),
    bottom: -s(2),
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: colors.surface3,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

/** Horizontal avatar strip: "Hot Cells" pinned chats, call favourites, selected members. */
export default function CellStrip({ items, onPress, onRemove, size = 56, wrap = false, style }: CellStripProps) {
  const styles = useStyles();

  const cells = items.map((c) => (
    <Pressable
      key={c.key}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={c.label}
      disabled={!onPress && !onRemove}
      onPress={() => (onRemove ? onRemove(c) : onPress?.(c))}
      style={styles.cell}
    >
      <View>
        <Avatar person={c.person} size={size} ring={c.ring} online={!c.ring && c.online} icon={c.icon} />
        {onRemove ? (
          <View style={styles.remove} accessibilityLabel={`Remove ${c.label}`}>
            <Icon name="close" size={11} strokeWidth={3} color="text" />
          </View>
        ) : null}
      </View>
      <AppText variant="caption" weight="medium" color="muted" numberOfLines={1}>
        {c.label}
      </AppText>
    </Pressable>
  ));

  if (wrap) return <View style={[styles.row, styles.wrapRow, style]}>{cells}</View>;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={[{ flexGrow: 0 }, style]}
    >
      {cells}
    </ScrollView>
  );
}
