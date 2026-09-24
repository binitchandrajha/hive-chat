import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Avatar, Button, IconButton, TextField } from '../../components';
import type { ScreenProps } from '../../navigation/types';
import { colors } from '../../theme';
import { pickImageWithPrompt } from '../../utils/imagePicker';
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
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const choosePhoto = async (): Promise<void> => {
    const image = await pickImageWithPrompt({ source: 'gallery', aspect: [1, 1] });
    if (image) setPhoto(image.uri);
  };

  return (
    <OnboardingStep
      step={3}
      title="Set up your profile"
      sub="This is how friends will see you on Hive."
      onBack={() => navigation.goBack()}
    >
      <View style={styles.photo}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={photo ? 'Change profile photo' : 'Add profile photo'}
          onPress={() => void choosePhoto()}
        >
          <Avatar
            person={{ initials: initialsOf(name), color: 0 }}
            size={120}
            icon={name.trim() ? undefined : 'user'}
            image={photo}
          />
        </Pressable>
        <IconButton
          icon="camera"
          label={photo ? 'Change profile photo' : 'Add profile photo'}
          variant="accent"
          iconSize={19}
          onPress={() => void choosePhoto()}
          style={styles.camera}
        />
      </View>

      <TextField label="Your name" value={name} placeholder="Your name" onChange={setName} autoFocus maxLength={40} />
      <TextField label="About" value={about} placeholder="Hey there! I am using Hive." onChange={setAbout} maxLength={120} />

      <View style={styles.footer}>
        <Button
          label="Continue"
          disabled={!name.trim()}
          // TODO(api): upload `photo` and save name + about to the user's profile.
          onPress={() => navigation.navigate('Permissions')}
        />
      </View>
    </OnboardingStep>
  );
}
