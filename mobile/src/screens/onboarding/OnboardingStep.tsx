import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar, AppText, Keypad, Screen, StepProgress, type KeypadKey } from '../../components';
import { colors } from '../../theme';
import { makeStyles } from '../../utils/responsive';

export interface OnboardingStepProps {
  step: 1 | 2 | 3 | 4;
  title: string;
  /** Line under the title; a string or rich text. */
  sub: ReactNode;
  onBack: () => void;
  children: ReactNode;
  /** Show the numeric Keypad pinned to the bottom (phone / OTP steps). */
  onKey?: (key: KeypadKey) => void;
}

const useStyles = makeStyles(({ ms, vs }) => ({
  scroll: { flexGrow: 1, paddingHorizontal: ms(20), paddingTop: vs(22), paddingBottom: ms(10), gap: vs(20) },
  sub: { marginTop: ms(6) },
  keypad: { backgroundColor: colors.surface },
}));

/**
 * Shared skeleton of the 4 onboarding steps: back AppBar, StepProgress,
 * title + sub, scrollable form, optional bottom Keypad.
 */
export default function OnboardingStep({ step, title, sub, onBack, children, onKey }: OnboardingStepProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <Screen edges={onKey ? ['top', 'left', 'right'] : undefined} avoidKeyboard={!onKey}>
      <AppBar onBack={onBack} />
      <StepProgress current={step} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View>
          <AppText variant="headline" accessibilityRole="header">
            {title}
          </AppText>
          <AppText variant="body" color="muted" style={styles.sub}>
            {sub}
          </AppText>
        </View>
        {children}
      </ScrollView>
      {onKey ? (
        <View style={[styles.keypad, { paddingBottom: insets.bottom }]}>
          <Keypad onKey={onKey} />
        </View>
      ) : null}
    </Screen>
  );
}
