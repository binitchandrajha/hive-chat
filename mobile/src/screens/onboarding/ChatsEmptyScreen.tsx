import { FlatList, View } from 'react-native';

import {
  AppBar,
  Button,
  Chip,
  ContactRow,
  EmptyState,
  Screen,
  SearchBar,
  SectionTitle,
  TabBar,
  TAB_BAR_SPACE,
} from '../../components';
import { people as P } from '../../data/sample';
import type { ScreenProps } from '../../navigation/types';
import type { Person } from '../../types/person';
import { makeStyles, useResponsive } from '../../utils/responsive';

/** Contacts already on Hive — from the contacts sync once the API exists. */
const ON_HIVE: readonly Person[] = [P.aarav, P.priya];

const useStyles = makeStyles(({ ms }) => ({
  search: { paddingHorizontal: ms(20) },
}));

/** 1.7 First run — empty inbox guides the user to start a chat or invite friends. */
export default function ChatsEmptyScreen({ navigation }: ScreenProps<'ChatsEmpty'>) {
  const styles = useStyles();
  const { vs } = useResponsive();
  // TODO(nav): point these at New chat / Chat / Search once the Chats flow is built.
  const todo = (): void => undefined;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <AppBar
        title="Chats"
        actions={[
          { icon: 'camera', label: 'Camera', onPress: todo },
          // Dev shortcut: "more" opens the component gallery until the Archived screen exists.
          { icon: 'more', label: 'More options', onPress: () => navigation.navigate('Gallery') },
        ]}
      />
      <FlatList<Person>
        data={ON_HIVE}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: vs(TAB_BAR_SPACE) }}
        ListHeaderComponent={
          <View>
            <View style={styles.search}>
              <SearchBar onPress={todo} />
            </View>
            <EmptyState
              icon="chatplus"
              title="Your hive is quiet"
              text="Start a conversation with someone in your contacts, or invite friends to join you on Hive."
              action={
                <>
                  <Button label="Start a chat" icon="chatplus" onPress={todo} />
                  <Button label="Invite friends" variant="ghost" icon="link" onPress={todo} />
                </>
              }
            />
            <SectionTitle title="On Hive from your contacts" />
          </View>
        }
        renderItem={({ item }) => (
          // The chip is a visual cue; the whole row opens the chat.
          <ContactRow person={item} onPress={todo} right={<Chip label="Say hi 👋" active />} />
        )}
      />
      <TabBar active="chats" onChange={todo} newBuzz />
    </Screen>
  );
}
