import { memo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { avatarPalette, colors } from '../../../theme';
import type { AvatarSubject } from '../../../types/person';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../AppText/AppText';
import Hexagon from '../Hexagon/Hexagon';
import Icon, { type IconName } from '../Icon/Icon';

export type AvatarRing = 'new' | 'seen';

export interface AvatarProps {
  person: AvatarSubject;
  /** Design size in dp. */
  size?: number;
  /** Green presence dot (ignored when a ring is shown). */
  online?: boolean;
  /** Buzz ring: `new` = accent gradient, `seen` = grey. */
  ring?: AvatarRing;
  /** Show an icon instead of initials (e.g. "New group"). */
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s }) => ({
  root: { alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute',
    right: s(2),
    bottom: s(3),
    width: s(12),
    height: s(12),
    borderRadius: s(6),
    backgroundColor: colors.mint,
    borderWidth: s(2.5),
    borderColor: colors.bg,
  },
  layer: { position: 'absolute' },
}));

/** Hexagon avatar — the Hive signature. */
function Avatar({ person, size = 48, online = false, ring, icon, style }: AvatarProps) {
  const styles = useStyles();
  const { s, fs } = useResponsive();
  const pair = avatarPalette[person.color] ?? avatarPalette[0];

  const face = (faceSize: number) => (
    <Hexagon size={faceSize} fill={pair}>
      {icon ? (
        <Icon name={icon} size={faceSize * 0.45} color="dark" />
      ) : (
        <AppText
          weight="heavy"
          color="dark"
          style={{ fontSize: fs(faceSize * 0.36), letterSpacing: -0.3 }}
        >
          {person.initials}
        </AppText>
      )}
    </Hexagon>
  );

  if (ring) {
    const ringFill =
      ring === 'new' ? ([colors.accent2, colors.accentDeep] as const) : colors.ringSeen;
    return (
      <View style={[styles.root, { width: s(size), height: s(size) }, style]}>
        <Hexagon size={size} fill={ringFill} angle={200} style={styles.layer} />
        <Hexagon size={size - 6} fill={colors.bg} style={styles.layer} />
        {face(size - 12)}
      </View>
    );
  }

  return (
    <View style={[styles.root, { width: s(size), height: s(size) }, style]}>
      {face(size)}
      {online ? <View style={styles.dot} /> : null}
    </View>
  );
}

export default memo(Avatar);
