import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, tints, withAlpha, type Tint } from '../../../theme';
import type { AvatarSubject } from '../../../types/person';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Avatar from '../../ui/Avatar/Avatar';
import Gradient from '../../ui/Gradient/Gradient';
import Icon from '../../ui/Icon/Icon';

export interface BuzzCardProps {
  person: AvatarSubject;
  /** Card background tint (gradient to near-black). Ignored for `add`. */
  background?: Tint;
  label: string;
  /** `story` = someone's Buzz, `add` = dashed "Add Buzz" card with my avatar. */
  variant?: 'story' | 'add';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  card: {
    width: s(112),
    height: s(150),
    borderRadius: ms(18),
    overflow: 'hidden',
    padding: ms(10),
    justifyContent: 'flex-end',
  },
  add: {
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.faint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },
  avatar: { position: 'absolute', top: ms(10), left: ms(10) },
  label: { textShadowColor: withAlpha(colors.black, 0.6), textShadowRadius: ms(6) },
}));

/** Story card in the Buzz rail. */
export default function BuzzCard({ person, background = 'coral', label, variant = 'story', onPress, style }: BuzzCardProps) {
  const styles = useStyles();

  if (variant === 'add') {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.card, styles.add, style]}>
        <Avatar person={person} size={46} />
        <AppText variant="caption" weight="bold" align="center">
          {label}
        </AppText>
        <Icon name="plus" size={12} color="muted" />
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}'s Buzz`} onPress={onPress} style={style}>
      <Gradient colors={[tints[background], colors.shade]} angle={160} style={styles.card}>
        <View style={styles.avatar}>
          <Avatar person={person} size={34} ring="new" />
        </View>
        <AppText variant="caption" weight="bold" numberOfLines={1} style={styles.label}>
          {label}
        </AppText>
      </Gradient>
    </Pressable>
  );
}
