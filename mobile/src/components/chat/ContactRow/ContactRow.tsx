import { memo, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { Person } from '../../../types/person';
import Avatar from '../../ui/Avatar/Avatar';
import { Check } from '../../ui/Toggle/Toggle';
import ListRow from '../../layout/ListRow/ListRow';

export interface ContactRowProps {
  person: Person;
  /** Second line; defaults to the person's About. */
  sub?: string;
  /** Show a checkbox (multi-select). `undefined` = no checkbox. */
  checked?: boolean;
  /** Trailing node, e.g. an "Admin" or "Say hi 👋" Chip. */
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Contact list row with optional checkbox for pickers. */
function ContactRow({ person, sub, checked, right, onPress, style }: ContactRowProps) {
  return (
    <ListRow
      leading={<Avatar person={person} size={46} online={person.online} />}
      title={person.name}
      sub={sub ?? person.about ?? 'Hey there! I am using Hive.'}
      right={
        <>
          {checked !== undefined ? <Check on={checked} label={person.name} onChange={onPress ? () => onPress() : undefined} /> : null}
          {right}
        </>
      }
      selected={checked === true}
      onPress={onPress}
      style={style}
    />
  );
}

export default memo(ContactRow);
