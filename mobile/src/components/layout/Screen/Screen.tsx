import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '../../../theme';
import { useResponsive } from '../../../utils/responsive';
import Wallpaper from '../../ui/Wallpaper/Wallpaper';

export interface ScreenProps {
  children: ReactNode;
  /** Honeycomb chat wallpaper behind the content. */
  wallpaper?: boolean;
  /** Full-bleed layer behind everything, ignoring safe areas (call / Buzz / media backgrounds). */
  background?: ReactNode;
  /** Safe-area edges to pad. Default: all. Drop `bottom` on screens with a floating TabBar. */
  edges?: readonly Edge[];
  /** Keep content in a centred column on tablets (default true). */
  constrain?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ALL_EDGES: readonly Edge[] = ['top', 'bottom', 'left', 'right'];

/** Root of every screen: background, safe areas (notch, home bar) and tablet column. */
export default function Screen({
  children,
  wallpaper = false,
  background,
  edges = ALL_EDGES,
  constrain = true,
  style,
}: ScreenProps) {
  const { isTablet, contentWidth } = useResponsive();
  return (
    <View style={styles.root}>
      {wallpaper ? <Wallpaper base /> : null}
      {background ? <View style={StyleSheet.absoluteFill}>{background}</View> : null}
      <SafeAreaView edges={edges} style={styles.flex}>
        <View
          style={[
            styles.flex,
            constrain && isTablet && { width: contentWidth, alignSelf: 'center' },
            style,
          ]}
        >
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
});
