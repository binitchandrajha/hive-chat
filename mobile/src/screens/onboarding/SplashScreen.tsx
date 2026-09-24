import { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Glow, Icon, Logo, Screen, Wallpaper } from '../../components';
import type { ScreenProps } from '../../navigation/types';
import { makeStyles } from '../../utils/responsive';

/** How long the brand moment shows while the app boots / the socket connects. */
const SPLASH_MS = 1600;

const useStyles = makeStyles(({ ms, vs, fs }) => ({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: ms(18) },
  glow: { top: vs(120), alignSelf: 'center' },
  word: { fontSize: fs(34), letterSpacing: -1.4 },
  foot: {
    position: 'absolute',
    bottom: vs(40),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
}));

/** 1.1 Splash — brand moment while the socket connects. Tap to skip. */
export default function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  const styles = useStyles();

  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Welcome'), SPLASH_MS);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <Screen background={<Wallpaper />}>
      <Pressable
        accessibilityLabel="Hive. Tap to continue"
        onPress={() => navigation.replace('Welcome')}
        style={styles.body}
      >
        <Glow style={styles.glow} />
        <Logo size={96} />
        <AppText weight="heavy" style={styles.word}>
          hive
        </AppText>
      </Pressable>
      <View style={styles.foot}>
        <Icon name="lock" size={13} color="faint" />
        <AppText variant="caption" weight="medium" color="faint">
          end-to-end encrypted
        </AppText>
      </View>
    </Screen>
  );
}
