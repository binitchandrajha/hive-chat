import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { angleToPoints, useSvgId } from '../../../utils/svgId';

export interface GradientProps {
  /** 2+ colour stops, evenly spaced unless `stops` is given. */
  colors: readonly string[];
  /** Stop offsets 0–1, same length as `colors`. */
  stops?: readonly number[];
  type?: 'linear' | 'radial';
  /** CSS-style angle for linear gradients (145 = top-left → bottom-right). */
  angle?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/** A View with a gradient background. Border radius in `style` clips the fill. */
export default function Gradient({
  colors,
  stops,
  type = 'linear',
  angle = 145,
  style,
  children,
}: GradientProps) {
  const id = useSvgId('grad');
  const last = Math.max(colors.length - 1, 1);
  const stopEls = colors.map((c, i) => (
    <Stop key={`${c}-${i}`} offset={stops?.[i] ?? i / last} stopColor={c} stopOpacity={1} />
  ));
  const p = angleToPoints(angle);

  return (
    <View style={[styles.clip, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          {type === 'radial' ? (
            <RadialGradient id={id} cx="50%" cy="25%" rx="120%" ry="70%" fx="50%" fy="25%">
              {stopEls}
            </RadialGradient>
          ) : (
            <LinearGradient id={id} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}>
              {stopEls}
            </LinearGradient>
          )}
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ clip: { overflow: 'hidden' } });
