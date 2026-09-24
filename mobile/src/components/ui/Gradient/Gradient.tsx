import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

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

interface Corners {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

/** Per-corner radii from a style (specific corner > borderRadius > 0). */
function cornersOf(style: StyleProp<ViewStyle>): Corners {
  const f = StyleSheet.flatten(style) ?? {};
  const all = num(f.borderRadius) ?? 0;
  return {
    tl: num(f.borderTopLeftRadius) ?? all,
    tr: num(f.borderTopRightRadius) ?? all,
    br: num(f.borderBottomRightRadius) ?? all,
    bl: num(f.borderBottomLeftRadius) ?? all,
  };
}

/** Rounded-rect path with a radius per corner (clamped so corners never overlap). */
function roundedRect(w: number, h: number, c: Corners): string {
  const max = Math.min(w, h) / 2;
  const tl = Math.min(c.tl, max);
  const tr = Math.min(c.tr, max);
  const br = Math.min(c.br, max);
  const bl = Math.min(c.bl, max);
  return [
    `M${tl},0`,
    `H${w - tr}`,
    `A${tr},${tr} 0 0 1 ${w},${tr}`,
    `V${h - br}`,
    `A${br},${br} 0 0 1 ${w - br},${h}`,
    `H${bl}`,
    `A${bl},${bl} 0 0 1 0,${h - bl}`,
    `V${tl}`,
    `A${tl},${tl} 0 0 1 ${tl},0`,
    'Z',
  ].join(' ');
}

/**
 * A View with a gradient background. The gradient is drawn as a rounded shape using
 * the border radii in `style`, so per-corner radii (chat bubble tails) look right on
 * iOS, Android and web without relying on overflow clipping.
 */
export default function Gradient({ colors, stops, type = 'linear', angle = 145, style, children }: GradientProps) {
  const id = useSvgId('grad');
  const last = Math.max(colors.length - 1, 1);
  const stopEls = colors.map((c, i) => (
    <Stop key={`${c}-${i}`} offset={stops?.[i] ?? i / last} stopColor={c} stopOpacity={1} />
  ));
  const p = angleToPoints(angle);
  // Drawn at the measured size: a "100%" Svg doesn't follow content-sized views on iOS
  // (e.g. a chat bubble growing with its text).
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  return (
    <View
      style={[styles.clip, style]}
      onLayout={(e) => {
        const { width: w, height: h } = e.nativeEvent.layout;
        setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
      }}
    >
      {size ? (
        <Svg style={StyleSheet.absoluteFill} width={size.w} height={size.h} pointerEvents="none">
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
          <Path d={roundedRect(size.w, size.h, cornersOf(style))} fill={`url(#${id})`} />
        </Svg>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ clip: { overflow: 'hidden' } });
