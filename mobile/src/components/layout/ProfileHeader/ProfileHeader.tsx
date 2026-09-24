import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { AvatarSubject } from '../../../types/person';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Avatar from '../../ui/Avatar/Avatar';

export interface ProfileHeaderProps {
  person: AvatarSubject & { name: string };
  sub?: string;
  /** Avatar design size (default 110). */
  size?: number;
  /** Overlay on the avatar, e.g. a camera IconButton for editing. */
  avatarAccessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  root: {
    alignItems: 'center',
    paddingTop: ms(8),
    paddingHorizontal: ms(20),
    paddingBottom: ms(18),
    gap: ms(6),
  },
  name: { marginTop: ms(8) },
}));

/** Centred avatar + name + subtitle at the top of contact / group / Hive info. */
export default function ProfileHeader({ person, sub, size = 110, avatarAccessory, style }: ProfileHeaderProps) {
  const styles = useStyles();
  return (
    <View style={[styles.root, style]}>
      <View>
        <Avatar person={person} size={size} />
        {avatarAccessory}
      </View>
      <AppText variant="heading" align="center" numberOfLines={2} style={styles.name}>
        {person.name}
      </AppText>
      {sub ? (
        <AppText variant="small" color="muted" align="center" numberOfLines={2}>
          {sub}
        </AppText>
      ) : null}
    </View>
  );
}
