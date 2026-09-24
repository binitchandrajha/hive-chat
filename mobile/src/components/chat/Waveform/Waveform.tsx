import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, type ColorToken } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';

export interface WaveformProps {
  /** Played fraction 0–1; bars before it are fully opaque. */
  progress?: number;
  color?: ColorToken;
  /** Bar heights in design dp; defaults to the design's sample shape. */
  bars?: readonly number[];
  style?: StyleProp<ViewStyle>;
}

const SAMPLE = [8, 14, 20, 12, 24, 18, 10, 22, 16, 26, 12, 8, 18, 22, 14, 10, 20, 16, 12, 24, 18, 8, 14, 10];

const useStyles = makeStyles(({ s, ms }) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: ms(2), height: s(26), flex: 1 },
  bar: { width: s(3), borderRadius: s(2) },
}));

/** Voice-note / live-call waveform. */
export default function Waveform({ progress = 0, color = 'text', bars = SAMPLE, style }: WaveformProps) {
  const styles = useStyles();
  const { s } = useResponsive();
  return (
    <View style={[styles.row, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {bars.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: s(h), backgroundColor: colors[color], opacity: i / bars.length < progress ? 1 : 0.35 },
          ]}
        />
      ))}
    </View>
  );
}
