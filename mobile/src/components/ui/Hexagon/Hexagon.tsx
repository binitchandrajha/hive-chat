import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';

import { angleToPoints, useSvgId } from '../../../utils/svgId';
import { useResponsive } from '../../../utils/responsive';

export interface HexagonProps {
  /** Design width in dp (scaled with `s()`). */
  size: number;
  /** Design height; defaults to `size`. */
  height?: number;
  /** Solid colour, or [from, to] for a 145° gradient. */
  fill: string | readonly [string, string];
  angle?: number;
  style?: StyleProp<ViewStyle>;
  /** Centred on top of the shape. */
  children?: ReactNode;
}

// Same rounded hexagon as the design's --hex mask (viewBox 0 0 100 100).
const POINTS = '50,7 87,28.5 87,71.5 50,93 13,71.5 13,28.5';

/** The Hive signature shape — avatars, FAB, send button, attach actions. */
export default function Hexagon({ size, height, fill, angle = 145, style, children }: HexagonProps) {
  const { s } = useResponsive();
  const id = useSvgId('hex');
  const w = s(size);
  const h = s(height ?? size);
  const isGradient = typeof fill !== 'string';
  const p = angleToPoints(angle);
  const paint = isGradient ? `url(#${id})` : fill;

  return (
    <View style={[{ width: w, height: h }, styles.center, style]}>
      <Svg
        style={StyleSheet.absoluteFill}
        width={w}
        height={h}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {isGradient ? (
          <Defs>
            <LinearGradient id={id} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}>
              <Stop offset={0} stopColor={fill[0]} />
              <Stop offset={1} stopColor={fill[1]} />
            </LinearGradient>
          </Defs>
        ) : null}
        <Polygon points={POINTS} fill={paint} stroke={paint} strokeWidth={12} strokeLinejoin="round" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center', justifyContent: 'center' } });
