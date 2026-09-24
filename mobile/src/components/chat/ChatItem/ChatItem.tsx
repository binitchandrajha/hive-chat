import { memo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha } from '../../../theme';
import type { Person, Tick } from '../../../types/person';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Avatar from '../../ui/Avatar/Avatar';
import Badge from '../../ui/Badge/Badge';
import Icon from '../../ui/Icon/Icon';
import ListRow from '../../layout/ListRow/ListRow';

export interface ChatItemProps {
  person: Person;
  /** Last message preview. */
  message?: string;
  time: string;
  unread?: number;
  /** Delivery state of *my* last message. */
  tick?: Tick;
  muted?: boolean;
  pinned?: boolean;
  /** Show "typing…" instead of the preview. */
  typing?: boolean;
  /** Group chats: who sent the last message. */
  sender?: string;
  /** Search: highlight this text inside the preview. */
  highlight?: string;
  /** Design size of the avatar (52 in the inbox, 44 in search results). */
  avatarSize?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  preview: { flexDirection: 'row', alignItems: 'center', gap: ms(4), minWidth: 0 },
  text: { flexShrink: 1 },
  side: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
  mark: { backgroundColor: withAlpha(colors.accent, 0.25), color: colors.accent },
}));

function Highlighted({ text, match }: { text: string; match?: string }) {
  const styles = useStyles();
  if (!match) return <>{text}</>;
  const i = text.toLowerCase().indexOf(match.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <AppText variant="small" weight="regular" style={styles.mark}>
        {text.slice(i, i + match.length)}
      </AppText>
      {text.slice(i + match.length)}
    </>
  );
}

/** Inbox row: presence, read ticks, typing, mute, pin and unread badge. */
function ChatItem({
  person,
  message = '',
  time,
  unread = 0,
  tick,
  muted = false,
  pinned = false,
  typing = false,
  sender,
  highlight,
  avatarSize = 52,
  onPress,
  onLongPress,
  style,
}: ChatItemProps) {
  const styles = useStyles();
  const hot = unread > 0;

  const preview = typing ? (
    <AppText variant="small" weight="semibold" color="mint" numberOfLines={1}>
      typing…
    </AppText>
  ) : (
    <View style={styles.preview}>
      {tick ? (
        <Icon name={tick === 'sent' ? 'check' : 'dcheck'} size={16} color={tick === 'read' ? 'sky' : 'faint'} />
      ) : null}
      <AppText variant="small" weight="regular" color="muted" numberOfLines={1} style={styles.text}>
        {sender ? (
          <AppText variant="small" weight="semibold">
            {sender}:{' '}
          </AppText>
        ) : null}
        <Highlighted text={message} match={highlight} />
      </AppText>
    </View>
  );

  return (
    <ListRow
      leading={<Avatar person={person} size={avatarSize} online={person.online} />}
      title={person.name}
      meta={
        <AppText variant="caption" color={hot ? 'accent' : 'faint'}>
          {time}
        </AppText>
      }
      sub={preview}
      subRight={
        muted || pinned || hot ? (
          <View style={styles.side}>
            {muted ? <Icon name="belloff" size={15} color="faint" /> : null}
            {pinned ? <Icon name="pin" size={15} color="faint" /> : null}
            <Badge count={unread} muted={muted} />
          </View>
        ) : undefined
      }
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={`${person.name}, ${typing ? 'typing' : message}, ${time}${hot ? `, ${unread} unread` : ''}`}
      style={style}
    />
  );
}

export default memo(ChatItem);
