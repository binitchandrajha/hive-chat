import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { tints, type Tint } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Hexagon from '../../ui/Hexagon/Hexagon';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export type AttachKind = 'gallery' | 'camera' | 'document' | 'location' | 'contact' | 'poll' | 'audio' | 'ai';

export interface AttachGridProps {
  onPick: (kind: AttachKind) => void;
  style?: StyleProp<ViewStyle>;
}

const ITEMS: readonly { kind: AttachKind; icon: IconName; label: string; tint: Tint }[] = [
  { kind: 'gallery', icon: 'image', label: 'Gallery', tint: 'purple' },
  { kind: 'camera', icon: 'camera', label: 'Camera', tint: 'coral' },
  { kind: 'document', icon: 'file', label: 'Document', tint: 'blue' },
  { kind: 'location', icon: 'location', label: 'Location', tint: 'green' },
  { kind: 'contact', icon: 'contact', label: 'Contact', tint: 'teal' },
  { kind: 'poll', icon: 'poll', label: 'Poll', tint: 'yellow' },
  { kind: 'audio', icon: 'headphones', label: 'Audio', tint: 'pink' },
  { kind: 'ai', icon: 'sparkle', label: 'AI Draft', tint: 'orange' },
];

const useStyles = makeStyles(({ ms }) => ({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: ms(16) },
  item: { width: '25%', alignItems: 'center', gap: ms(7) },
}));

/** Hexagon attachment actions inside the Share sheet. */
export default function AttachGrid({ onPick, style }: AttachGridProps) {
  const styles = useStyles();
  return (
    <View style={[styles.grid, style]}>
      {ITEMS.map((it) => (
        <Pressable
          key={it.kind}
          accessibilityRole="button"
          accessibilityLabel={it.label}
          onPress={() => onPick(it.kind)}
          style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Hexagon size={56} fill={tints[it.tint]}>
            <Icon name={it.icon} size={24} color="white" />
          </Hexagon>
          <AppText variant="caption" weight="semibold" color="muted" numberOfLines={1}>
            {it.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
