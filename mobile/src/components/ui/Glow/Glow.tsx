import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '../../../theme';
import { useResponsive } from '../../../utils/responsive';
import { useSvgId } from '../../../utils/svgId';

export interface GlowProps {
  /** Design diameter in dp (default 420). */
  size?: number;
  /** Peak opacity at the centre (default .28). */
  intensity?: number;
  /** Position it with top/left etc.; it is non-interactive. */
  style?: StyleProp<ViewStyle>;
}

/** Soft radial accent glow behind brand moments (splash, welcome). */
export default function Glow({ size = 420, intensity = 0.28, style }: GlowProps) {
  const { s } = useResponsive();
  const id = useSvgId('glow');
  const px = s(size);
  return (
    <Svg width={px} height={px} viewBox="0 0 100 100" style={[{ position: 'absolute' }, style]} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={colors.accent} stopOpacity={intensity} />
          <Stop offset="0.65" stopColor={colors.accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
    </Svg>
  );
}
