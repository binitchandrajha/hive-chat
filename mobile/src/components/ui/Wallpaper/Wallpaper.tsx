import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

import { colors } from '../../../theme';
import { useSvgId } from '../../../utils/svgId';

export interface WallpaperProps {
  /** Fill the base colour too (chat background) or only draw the pattern. */
  base?: boolean;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

/** Faint honeycomb pattern behind chats, splash and calls. Fills its parent. */
export default function Wallpaper({ base = false, opacity = 1, style }: WallpaperProps) {
  const id = useSvgId('wall');
  return (
    <Svg style={[StyleSheet.absoluteFill, { opacity }, style]} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <Pattern id={id} width={56} height={97} patternUnits="userSpaceOnUse">
          <Path
            d="M28 66L0 50V17L28 1l28 16v33L28 66zm0 31L0 81V66"
            fill="none"
            stroke={colors.white}
            strokeOpacity={0.035}
            strokeWidth={1.2}
          />
        </Pattern>
      </Defs>
      {base ? <Rect width="100%" height="100%" fill={colors.wall} /> : null}
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
