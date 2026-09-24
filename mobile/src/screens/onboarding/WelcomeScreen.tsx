import { ScrollView, View } from 'react-native';

import { AppText, Avatar, Bubble, Button, Glow, Logo, Screen, Wallpaper } from '../../components';
import { people as P } from '../../data/sample';
import type { ScreenProps } from '../../navigation/types';
import { makeStyles, useResponsive } from '../../utils/responsive';

const useStyles = makeStyles(({ ms, vs, fs }) => ({
  scroll: { flexGrow: 1 },
  hero: { overflow: 'hidden' },
  glow: { top: 0, alignSelf: 'center' },
  // Positions are % of the hero box so the cluster keeps its shape on every screen size.
  priya: { position: 'absolute', left: '11.7%', top: '15.4%' },
  aarav: { position: 'absolute', right: '13.5%', top: '10.3%' },
  logo: { position: 'absolute', alignSelf: 'center', top: '38.5%' },
  sita: { position: 'absolute', left: '8.8%', top: '51.3%' },
  kiran: { position: 'absolute', right: '11.7%', top: '48.7%' },
  chat: { position: 'absolute', left: '7%', right: '7%', top: '72%', gap: ms(6) },
  inBubble: { maxWidth: '70%' },
  outBubble: { maxWidth: '62%' },
  body: { flex: 1, paddingHorizontal: ms(20), paddingTop: vs(18), gap: ms(12) },
  lead: { lineHeight: fs(22) },
  actions: { marginTop: 'auto', gap: ms(8), paddingTop: vs(16), paddingBottom: ms(8) },
}));

/** 1.2 Welcome — value props + primary CTA over a live hex cluster of chats. */
export default function WelcomeScreen({ navigation }: ScreenProps<'Welcome'>) {
  const styles = useStyles();
  const { s, vs, hp } = useResponsive();
  const heroHeight = Math.min(vs(390), hp(50));
  // On short screens there is no room for the sample chat under the avatars — it's decoration, so drop it.
  const showChat = heroHeight >= s(340);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={[styles.hero, { height: heroHeight }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Wallpaper />
          <Glow style={styles.glow} />
          <Avatar person={P.priya} size={70} ring="new" style={styles.priya} />
          <Avatar person={P.aarav} size={58} online style={styles.aarav} />
          <Logo size={84} style={styles.logo} />
          <Avatar person={P.sita} size={52} style={styles.sita} />
          <Avatar person={P.kiran} size={66} ring="new" style={styles.kiran} />
          {showChat ? (
            <View style={styles.chat}>
              <Bubble dir="in" text="Hey! Coming tonight? 🍯" time="9:40" style={styles.inBubble} />
              <Bubble dir="out" text="On my way 🚀" time="9:41" tick="read" style={styles.outBubble} />
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <AppText variant="hero" accessibilityRole="header">
            Where your people{'\n'}
            <AppText variant="hero" color="accent">
              buzz together.
            </AppText>
          </AppText>
          <AppText variant="body" color="muted" style={styles.lead}>
            Private messages, calls and Buzz stories — fast, encrypted and beautifully simple.
          </AppText>

          <View style={styles.actions}>
            <Button label="Get started" onPress={() => navigation.navigate('Phone')} />
            <AppText variant="caption" weight="regular" color="faint" align="center">
              By continuing you agree to our{' '}
              <AppText variant="caption" weight="semibold" color="accent">
                Terms
              </AppText>{' '}
              &{' '}
              <AppText variant="caption" weight="semibold" color="accent">
                Privacy Policy
              </AppText>
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
