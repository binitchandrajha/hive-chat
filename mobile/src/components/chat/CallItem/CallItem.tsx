import { memo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { AvatarSubject } from '../../../types/person';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Avatar from '../../ui/Avatar/Avatar';
import Icon from '../../ui/Icon/Icon';
import IconButton from '../../ui/IconButton/IconButton';
import ListRow from '../../layout/ListRow/ListRow';

export type CallDirection = 'in' | 'out';

export interface CallItemProps {
  person: AvatarSubject & { name: string };
  direction: CallDirection;
  missed?: boolean;
  /** "Today, 8:40 · 12:40" */
  time: string;
  video?: boolean;
  /** Repeated attempts, shown as "(2)". */
  count?: number;
  onPress?: () => void;
  /** Call-back button on the right. */
  onCall?: () => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  sub: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
}));

/** Call log row, colour-coded by direction; missed calls in rose. */
function CallItem({ person, direction, missed = false, time, video = false, count = 0, onPress, onCall, style }: CallItemProps) {
  const styles = useStyles();
  const arrowColor = missed ? 'rose' : direction === 'in' ? 'mint' : 'accent';
  return (
    <ListRow
      leading={<Avatar person={person} size={48} />}
      title={count > 1 ? `${person.name} (${count})` : person.name}
      titleColor={missed ? 'rose' : 'text'}
      sub={
        <View style={styles.sub}>
          <Icon name={direction === 'in' ? 'callin' : 'callout'} size={15} strokeWidth={2.4} color={arrowColor} />
          <AppText variant="small" weight="regular" color="muted" numberOfLines={1}>
            {time}
          </AppText>
        </View>
      }
      right={
        <IconButton
          icon={video ? 'video' : 'phone'}
          label={`${video ? 'Video' : 'Voice'} call ${person.name}`}
          iconSize={21}
          color="accent"
          onPress={onCall}
        />
      }
      onPress={onPress}
      accessibilityLabel={`${missed ? 'Missed' : direction === 'in' ? 'Incoming' : 'Outgoing'} ${video ? 'video' : 'voice'} call, ${person.name}, ${time}`}
      style={style}
    />
  );
}

export default memo(CallItem);
