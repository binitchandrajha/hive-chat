import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import type { AvatarSubject } from '../../../types/person';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Avatar from '../../ui/Avatar/Avatar';
import IconButton from '../../ui/IconButton/IconButton';

export interface ChatHeaderProps {
  person: AvatarSubject & { name: string; online?: boolean };
  /** "online", "typing…", "last seen today at 8:47", "Kiran, Priya, Sita, You" */
  status?: string;
  /** Show the status in mint (online / typing). Default: `person.online`. */
  live?: boolean;
  onBack: () => void;
  onCall?: () => void;
  onVideo?: () => void;
  onInfo?: () => void;
  onMore?: () => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  bar: {
    height: s(58),
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(2),
    paddingLeft: ms(6),
    paddingRight: ms(6),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.bg,
  },
  who: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: ms(10) },
  names: { flex: 1, minWidth: 0 },
}));

/** Conversation header: back, avatar + presence, video / voice / more. */
export default function ChatHeader({
  person,
  status,
  live,
  onBack,
  onCall,
  onVideo,
  onInfo,
  onMore,
  style,
}: ChatHeaderProps) {
  const styles = useStyles();
  const isLive = live ?? person.online ?? false;
  return (
    <View style={[styles.bar, style]}>
      <IconButton icon="back" label="Back" onPress={onBack} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${person.name}, ${status ?? ''}. Open info`}
        onPress={onInfo}
        style={styles.who}
      >
        <Avatar person={person} size={40} online={person.online} />
        <View style={styles.names}>
          <AppText variant="bodyLg" weight="bold" numberOfLines={1}>
            {person.name}
          </AppText>
          {status ? (
            <AppText variant="caption" weight="medium" color={isLive ? 'mint' : 'muted'} numberOfLines={1}>
              {status}
            </AppText>
          ) : null}
        </View>
      </Pressable>
      {onVideo ? <IconButton icon="video" label="Video call" size={36} onPress={onVideo} /> : null}
      {onCall ? <IconButton icon="phone" label="Voice call" size={36} onPress={onCall} /> : null}
      <IconButton icon="more" label="More options" size={36} onPress={onMore} />
    </View>
  );
}
