import { useState } from 'react';
import { Pressable } from 'react-native';

import { AppText, Button, OTPInput, type KeypadKey } from '../../components';
import { useCountdown } from '../../hooks/useCountdown';
import type { ScreenProps } from '../../navigation/types';
import { makeStyles } from '../../utils/responsive';
import OnboardingStep from './OnboardingStep';

const CODE_LENGTH = 6;
const RESEND_AFTER_S = 30;

const useStyles = makeStyles(({ ms }) => ({
  resend: { alignSelf: 'center', paddingVertical: ms(4) },
}));

/** 1.4 Verify code — OTP boxes, resend timer, edit-number link. */
export default function OtpScreen({ navigation, route }: ScreenProps<'Otp'>) {
  const styles = useStyles();
  const { phone } = route.params;
  const [code, setCode] = useState<string>('');
  const timer = useCountdown(RESEND_AFTER_S);

  const onKey = (key: KeypadKey): void => {
    if (key === 'back') setCode((c) => c.slice(0, -1));
    else if (key !== '+') setCode((c) => (c + key).slice(0, CODE_LENGTH));
  };

  const resend = (): void => {
    // TODO(api): ask the server to send a new code.
    setCode('');
    timer.restart();
  };

  return (
    <OnboardingStep
      step={2}
      title="Enter the code"
      sub={
        <>
          Sent to{' '}
          <AppText variant="body" weight="bold">
            {phone}
          </AppText>
          {' · '}
          <AppText variant="body" weight="semibold" color="accent" onPress={() => navigation.goBack()} accessibilityRole="link">
            Edit
          </AppText>
        </>
      }
      onBack={() => navigation.goBack()}
      onKey={onKey}
    >
      <OTPInput value={code} length={CODE_LENGTH} onChange={setCode} showSoftInputOnFocus={false} />

      {timer.done ? (
        <Pressable accessibilityRole="button" onPress={resend} style={styles.resend}>
          <AppText variant="small" weight="bold" color="accent">
            Resend code
          </AppText>
        </Pressable>
      ) : (
        <AppText variant="small" weight="regular" color="muted" align="center" accessibilityLiveRegion="polite">
          Resend code in{' '}
          <AppText variant="small" weight="bold" color="accent">
            {timer.label}
          </AppText>
        </AppText>
      )}

      <Button
        label="Verify"
        disabled={code.length < CODE_LENGTH}
        // TODO(api): verify the code with the server; show an error Banner on failure.
        onPress={() => navigation.navigate('ProfileSetup')}
      />
    </OnboardingStep>
  );
}
