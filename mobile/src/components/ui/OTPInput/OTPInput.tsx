import { useRef } from 'react';
import { Pressable, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../AppText/AppText';

export interface OTPInputProps {
  value: string;
  length?: number;
  onChange: (value: string) => void;
  /** Hide the system keyboard when the screen shows the in-app Keypad. */
  showSoftInputOnFocus?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  row: { flexDirection: 'row', justifyContent: 'center', gap: ms(10) },
  box: {
    flex: 1,
    maxWidth: s(46),
    height: s(58),
    borderRadius: ms(14),
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { borderColor: colors.accent },
  current: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: ms(4),
    shadowOffset: { width: 0, height: 0 },
  },
  caret: { width: 2, height: s(24), backgroundColor: colors.accent },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
}));

/** Verification code boxes backed by one hidden input. */
export default function OTPInput({
  value,
  length = 6,
  onChange,
  showSoftInputOnFocus,
  autoFocus = true,
  style,
}: OTPInputProps) {
  const styles = useStyles();
  const { fs } = useResponsive();
  const input = useRef<TextInput>(null);

  return (
    <Pressable
      accessibilityLabel={`Verification code, ${value.length} of ${length} digits entered`}
      onPress={() => input.current?.focus()}
      style={[styles.row, style]}
    >
      {Array.from({ length }, (_, i) => {
        const digit = value[i];
        const isCurrent = i === value.length;
        return (
          <View key={i} style={[styles.box, digit ? styles.filled : null, isCurrent ? styles.current : null]}>
            {digit ? (
              <AppText weight="heavy" color="accent" style={{ fontSize: fs(24) }}>
                {digit}
              </AppText>
            ) : isCurrent ? (
              <View style={styles.caret} />
            ) : null}
          </View>
        );
      })}
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus={autoFocus}
        showSoftInputOnFocus={showSoftInputOnFocus}
        maxLength={length}
        style={styles.hidden}
      />
    </Pressable>
  );
}
