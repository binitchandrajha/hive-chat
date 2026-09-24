import { useState } from 'react';
import { View } from 'react-native';

import { Avatar, Button, IconButton, TextField } from '../../components';
import type { ScreenProps } from '../../navigation/types';
import { colors } from '../../theme';
import { initialsOf } from '../../utils/initials';
import { makeStyles } from '../../utils/responsive';
import OnboardingStep from './OnboardingStep';

const useStyles = makeStyles(({ s, ms }) => ({
  photo: { alignSelf: 'center' },
  camera: {
    position: 'absolute',
    right: -s(2),
    bottom: s(6),
    borderWidth: ms(3),
    borderColor: colors.bg,
  },
  footer: { marginTop: 'auto' },
}));

/** 1.5 Create profile — name, about and hexagon photo. */
export default function ProfileSetupScreen({ navigation }: ScreenProps<'ProfileSetup'>) {
  const styles = useStyles();
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');

  return (
    <OnboardingStep
      step={3}
      title="Set up your profile"
      sub="This is how friends will see you on Hive."
      onBack={() => navigation.goBack()}
    >
      <View style={styles.photo}>
        <Avatar person={{ initials: initialsOf(name), color: 0 }} size={120} icon={name.trim() ? undefined : 'user'} />
        {/* TODO(media): open the image picker once expo-image-picker is added. */}
        <IconButton icon="camera" label="Add profile photo" variant="accent" iconSize={19} style={styles.camera} />
      </View>

      <TextField label="Your name" value={name} placeholder="Your name" onChange={setName} autoFocus maxLength={40} />
      <TextField label="About" value={about} placeholder="Hey there! I am using Hive." onChange={setAbout} maxLength={120} />

      <View style={styles.footer}>
        <Button
          label="Continue"
          disabled={!name.trim()}
          // TODO(api): save name + about to the user's profile.
          onPress={() => navigation.navigate('Permissions')}
        />
      </View>
    </OnboardingStep>
  );
}
