import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, tints, type Tint } from '../../../theme';
import Gradient from '../Gradient/Gradient';

/** A real image, or a tinted placeholder while there is none (design mockups, loading). */
export type MediaSource = { uri: string } | { tint: Tint };

export interface MediaThumbProps {
  source: MediaSource;
  /** Draw the sun + hills illustration on placeholders. */
  art?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Photo / video thumbnail used in bubbles, media grids and the attach sheet. */
export default function MediaThumb({ source, art = true, style }: MediaThumbProps) {
  if ('uri' in source) {
    return (
      <View style={[styles.clip, style]}>
        <Image source={{ uri: source.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>
    );
  }
  return (
    <Gradient colors={[tints[source.tint], colors.shade]} style={style}>
      {art ? (
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice">
          <Circle cx="220" cy="48" r="20" fill={colors.sun} opacity={0.9} />
          <Path d="M0 170 80 70l50 55 40-35 130 80z" fill={colors.black} opacity={0.35} />
          <Path d="M0 170 110 95l60 45 30-20 100 50z" fill={colors.black} opacity={0.25} />
        </Svg>
      ) : null}
    </Gradient>
  );
}

const styles = StyleSheet.create({ clip: { overflow: 'hidden' } });
