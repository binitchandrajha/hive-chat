import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, Image as SvgImage, LinearGradient, Path, Stop } from 'react-native-svg';

import { angleToPoints, useSvgId } from '../../../utils/svgId';
import { useResponsive } from '../../../utils/responsive';

export interface HexagonProps {
  /** Design width in dp (scaled with `s()`). */
  size: number;
  /** Design height; defaults to `size`. */
  height?: number;
  /** Solid colour, or [from, to] for a 145° gradient. Shown behind / instead of `image`. */
  fill: string | readonly [string, string];
  angle?: number;
  /** Photo URI clipped to the hexagon (profile photos, group icons). */
  image?: string;
  style?: StyleProp<ViewStyle>;
  /** Centred on top of the shape. */
  children?: ReactNode;
}

/**
 * Rounded hexagon outline in a 100×100 box — same shape as the design's --hex mask
 * (hexagon points expanded by a round 6-unit corner). Used for both fill and photo clip.
 */
const HEX_PATH = ((): string => {
  const pts: readonly (readonly [number, number])[] = [
    [50, 7], [87, 28.5], [87, 71.5], [50, 93], [13, 71.5], [13, 28.5],
  ];
  const r = 6;
  const normal = (i: number): [number, number] => {
    const a = pts[i % pts.length] ?? [0, 0];
    const b = pts[(i + 1) % pts.length] ?? [0, 0];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [((b[1] - a[1]) / len) * r, (-(b[0] - a[0]) / len) * r];
  };
  const f = (n: number): string => n.toFixed(2);
  const first = pts[0] ?? [0, 0];
  const n0 = normal(0);
  let d = `M${f(first[0] + n0[0])},${f(first[1] + n0[1])}`;
  for (let i = 0; i < pts.length; i++) {
    const b = pts[(i + 1) % pts.length] ?? [0, 0];
    const n = normal(i);
    const next = normal(i + 1);
    d += ` L${f(b[0] + n[0])},${f(b[1] + n[1])}`;
    d += ` A${r},${r} 0 0 1 ${f(b[0] + next[0])},${f(b[1] + next[1])}`;
  }
  return `${d} Z`;
})();

/** The Hive signature shape — avatars, FAB, send button, attach actions. */
export default function Hexagon({ size, height, fill, angle = 145, image, style, children }: HexagonProps) {
  const { s } = useResponsive();
  const id = useSvgId('hex');
  const w = s(size);
  const h = s(height ?? size);
  const isGradient = typeof fill !== 'string';
  const p = angleToPoints(angle);
  const paint = isGradient ? `url(#${id}g)` : fill;

  return (
    <View style={[{ width: w, height: h }, styles.center, style]}>
      <Svg style={StyleSheet.absoluteFill} width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          {isGradient ? (
            <LinearGradient id={`${id}g`} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}>
              <Stop offset={0} stopColor={fill[0]} />
              <Stop offset={1} stopColor={fill[1]} />
            </LinearGradient>
          ) : null}
          {image ? (
            <ClipPath id={`${id}c`}>
              <Path d={HEX_PATH} />
            </ClipPath>
          ) : null}
        </Defs>
        <Path d={HEX_PATH} fill={paint} />
        {image ? (
          <SvgImage
            href={{ uri: image }}
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${id}c)`}
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center', justifyContent: 'center' } });
