import { memo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { colors, type ColorToken } from '../../../theme';
import { useResponsive } from '../../../utils/responsive';
import { ICONS, type IconName } from './icons';

export type { IconName } from './icons';

export interface IconProps {
  name: IconName;
  /** Design size in dp (scaled with `s()`). */
  size?: number;
  strokeWidth?: number;
  /** A colour token, or a raw colour from a token-derived value (e.g. a tint). */
  color?: ColorToken | (string & {});
  /** Rotation in degrees (e.g. 135 turns the phone into a hang-up glyph). */
  rotate?: number;
  style?: StyleProp<ViewStyle>;
}

function resolveColor(color: IconProps['color']): string {
  if (color && color in colors) return colors[color as ColorToken];
  return color ?? colors.text;
}

function Icon({ name, size = 22, strokeWidth = 2, color, rotate, style }: IconProps) {
  const { s } = useResponsive();
  const px = s(size);
  const xml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  // Wrapped in a View so it stacks like any other view (on web a bare <svg>
  // paints under absolutely positioned siblings such as a Hexagon background).
  return (
    <View
      style={[{ width: px, height: px }, rotate ? { transform: [{ rotate: `${rotate}deg` }] } : null, style]}
      pointerEvents="none"
    >
      <SvgXml xml={xml} width={px} height={px} color={resolveColor(color)} />
    </View>
  );
}

export default memo(Icon);
