import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import Hexagon from '../Hexagon/Hexagon';
import Icon, { type IconName } from '../Icon/Icon';

export interface FabProps {
  icon: IconName;
  /** Accessibility label, e.g. "New chat". */
  label: string;
  onPress: () => void;
  /** Sit just above the home bar (screens without a TabBar). */
  low?: boolean;
  /** Render in place instead of floating bottom-right. */
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms, vs }) => ({
  float: { position: 'absolute', right: ms(20), zIndex: 21 },
  high: { bottom: vs(104) },
  low: { bottom: vs(40) },
  shadow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: ms(8),
    shadowOffset: { width: 0, height: ms(8) },
  },
}));

/** Hexagon floating action button. */
export default function Fab({ icon, label, onPress, low = false, inline = false, style }: FabProps) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        !inline && styles.float,
        !inline && (low ? styles.low : styles.high),
        styles.shadow,
        { opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Hexagon size={58} fill={[colors.accent, colors.accentDeep]}>
        <Icon name={icon} size={24} strokeWidth={2.2} color="onAccent" />
      </Hexagon>
    </Pressable>
  );
}
