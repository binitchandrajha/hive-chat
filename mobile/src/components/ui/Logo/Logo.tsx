import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '../../../theme';
import { useResponsive } from '../../../utils/responsive';
import { useSvgId } from '../../../utils/svgId';

export interface LogoProps {
  /** Design size in dp. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Hive brand mark: hexagon + chat bubble. */
export default function Logo({ size = 34, style }: LogoProps) {
  const { s } = useResponsive();
  const id = useSvgId('logo');
  const px = s(size);
  return (
    <Svg width={px} height={px} viewBox="0 0 48 48" style={style}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.accent2} />
          <Stop offset="1" stopColor={colors.accentDeep} />
        </LinearGradient>
      </Defs>
      <Path d="M24 3 42 13.5v21L24 45 6 34.5v-21z" fill={`url(#${id})`} />
      <Path
        d="M15 19.5h18v10H22l-5 4v-4h-2z"
        fill={colors.onAccent}
        stroke={colors.onAccent}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx="20" cy="24.5" r="1.6" fill={colors.accent} />
      <Circle cx="24" cy="24.5" r="1.6" fill={colors.accent} />
      <Circle cx="28" cy="24.5" r="1.6" fill={colors.accent} />
    </Svg>
  );
}
