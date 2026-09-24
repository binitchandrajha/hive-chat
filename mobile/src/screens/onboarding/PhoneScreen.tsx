import { useState } from 'react';

import { Button, TextField, type KeypadKey } from '../../components';
import type { ScreenProps } from '../../navigation/types';
import { DEFAULT_COUNTRY, digitsOnly, formatPhone } from '../../utils/phone';
import OnboardingStep from './OnboardingStep';

/** 1.3 Phone number — country prefix + number, entered with the in-app keypad. */
export default function PhoneScreen({ navigation }: ScreenProps<'Phone'>) {
  const [digits, setDigits] = useState<string>('');
  const complete = digits.length === DEFAULT_COUNTRY.length;

  const onKey = (key: KeypadKey): void => {
    if (key === 'back') setDigits((d) => d.slice(0, -1));
    else if (key !== '+') setDigits((d) => digitsOnly(d + key));
  };

  const sendCode = (): void => {
    // TODO(api): request the SMS code from the server before moving on.
    navigation.navigate('Otp', { phone: `${DEFAULT_COUNTRY.dialCode} ${formatPhone(digits)}` });
  };

  return (
    <OnboardingStep
      step={1}
      title="Your phone number"
      sub="We’ll text you a 6-digit code to verify it’s you."
      onBack={() => navigation.goBack()}
      onKey={onKey}
    >
      <TextField
        label="Mobile number"
        prefix={`${DEFAULT_COUNTRY.flag} ${DEFAULT_COUNTRY.dialCode}`}
        value={formatPhone(digits)}
        placeholder="981 234 5678"
        onChange={(v) => setDigits(digitsOnly(v))}
        keyboardType="phone-pad"
        showSoftInputOnFocus={false}
        // The keypad is the input, so the field always looks active.
        focused
        autoFocus
      />
      <Button label="Send code" icon="send" disabled={!complete} onPress={sendCode} />
    </OnboardingStep>
  );
}
