import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, tints, withAlpha, type Tint } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import Icon, { type IconName } from '../Icon/Icon';

export interface IconTileProps {
  icon: IconName;
  /** Tint of the icon; the tile is the same tint at 15%. `neutral` = grey tile. */
  color?: Tint | 'neutral';
  /** Design size in dp. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  tile: { alignItems: 'center', justifyContent: 'center', borderRadius: ms(11) },
}));

/** Rounded-square coloured icon used in settings rows and Hive group rows. */
export default function IconTile({ icon, color = 'accent', size = 36, style }: IconTileProps) {
  const styles = useStyles();
  const { s } = useResponsive();
  const fg = color === 'neutral' ? colors.muted : tints[color];
  const bg = color === 'neutral' ? colors.surface3 : withAlpha(tints[color], 0.15);
  return (
    <View style={[styles.tile, { width: s(size), height: s(size), backgroundColor: bg }, style]}>
      <Icon name={icon} size={size * 0.53} color={fg} />
    </View>
  );
}
