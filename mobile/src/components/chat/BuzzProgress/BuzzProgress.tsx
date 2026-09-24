import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';

export interface BuzzProgressProps {
  /** Number of Buzz segments. */
  count: number;
  /** Index of the one playing. */
  current: number;
  /** Progress of the current segment, 0–1. */
  progress: number;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  row: { flexDirection: 'row', gap: ms(4), paddingHorizontal: ms(12) },
  seg: {
    flex: 1,
    height: s(3),
    borderRadius: s(2),
    overflow: 'hidden',
    backgroundColor: withAlpha(colors.white, 0.3),
  },
  fill: { height: '100%', backgroundColor: colors.white },
}));

/** Segmented progress bar at the top of the Buzz viewer. */
export default function BuzzProgress({ count, current, progress, style }: BuzzProgressProps) {
  const styles = useStyles();
  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: count, now: current + 1 }}
    >
      {Array.from({ length: count }, (_, i) => {
        const pct = i < current ? 100 : i === current ? Math.round(progress * 100) : 0;
        return (
          <View key={i} style={styles.seg}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
        );
      })}
    </View>
  );
}
