import { useState } from 'react';
import { View } from 'react-native';

import { Banner, Button, SettingsGroup, SettingsRow, Toggle } from '../../components';
import type { ScreenProps } from '../../navigation/types';
import { makeStyles } from '../../utils/responsive';
import OnboardingStep from './OnboardingStep';

type Permission = 'contacts' | 'notifications' | 'media';

const useStyles = makeStyles(({ ms }) => ({
  group: { marginHorizontal: 0, marginVertical: 0 },
  banner: { marginHorizontal: 0, marginVertical: 0 },
  footer: { marginTop: 'auto', gap: ms(6) },
}));

/** 1.6 Permissions — explain before asking: contacts, notifications, mic & camera. */
export default function PermissionsScreen({ navigation }: ScreenProps<'Permissions'>) {
  const styles = useStyles();
  const [allowed, setAllowed] = useState<Record<Permission, boolean>>({
    contacts: true,
    notifications: true,
    media: false,
  });
  const set = (key: Permission) => (on: boolean) => setAllowed((a) => ({ ...a, [key]: on }));

  const finish = (): void => {
    // TODO(permissions): request the enabled OS permissions (expo-contacts,
    // expo-notifications, expo-camera) before entering the app.
    navigation.reset({ index: 0, routes: [{ name: 'ChatsEmpty' }] });
  };

  return (
    <OnboardingStep
      step={4}
      title="Almost there"
      sub="Allow these to get the best of Hive. You can change them anytime."
      onBack={() => navigation.goBack()}
    >
      <SettingsGroup style={styles.group}>
        <SettingsRow
          icon="contact"
          color="blue"
          title="Contacts"
          sub="Find friends already on Hive"
          right={<Toggle on={allowed.contacts} onChange={set('contacts')} label="Contacts" />}
        />
        <SettingsRow
          icon="bell"
          title="Notifications"
          sub="Never miss a message or call"
          right={<Toggle on={allowed.notifications} onChange={set('notifications')} label="Notifications" />}
        />
        <SettingsRow
          icon="mic"
          color="green"
          title="Microphone & Camera"
          sub="For calls and voice notes"
          right={<Toggle on={allowed.media} onChange={set('media')} label="Microphone and camera" />}
        />
      </SettingsGroup>

      <Banner icon="shield" text="Your contacts are hashed on-device and never stored in plain text." style={styles.banner} />

      <View style={styles.footer}>
        <Button label="Start chatting" onPress={finish} />
        <Button label="Skip for now" variant="text" onPress={finish} />
      </View>
    </OnboardingStep>
  );
}
