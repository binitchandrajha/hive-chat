import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';

export interface StepProgressProps {
  /** Total number of steps (onboarding has 4). */
  steps?: number;
  /** 1-based index of the current step; it and all earlier steps are filled. */
  current: number;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  row: { flexDirection: 'row', gap: ms(6), paddingHorizontal: ms(20), paddingTop: ms(4) },
  seg: { flex: 1, height: s(4), borderRadius: s(2) },
}));

/** Segmented progress bar under the AppBar in multi-step flows. */
export default function StepProgress({ steps = 4, current, style }: StepProgressProps) {
  const styles = useStyles();
  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current} of ${steps}`}
      accessibilityValue={{ min: 1, max: steps, now: current }}
    >
      {Array.from({ length: steps }, (_, i) => (
        <View
          key={i}
          style={[styles.seg, { backgroundColor: i < current ? colors.accent : colors.surface3 }]}
        />
      ))}
    </View>
  );
}
