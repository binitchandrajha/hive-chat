import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../AppText/AppText';

/** A digit, `+`, or `back` for delete. */
export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '+' | 'back';

export interface KeypadProps {
  onKey: (key: KeypadKey) => void;
  style?: StyleProp<ViewStyle>;
}

const KEYS: readonly (readonly [KeypadKey | null, string])[] = [
  ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
  ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
  ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
  [null, ''], ['0', '+'], ['back', ''],
];

const useStyles = makeStyles(({ s, ms, fs }) => ({
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: ms(4),
    paddingHorizontal: ms(12),
    paddingTop: ms(8),
    backgroundColor: colors.surface,
  },
  key: {
    width: '33.333%',
    height: s(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(12),
  },
  digit: { fontSize: fs(22) },
  letters: { fontSize: fs(9), letterSpacing: 1.3 },
}));

/** Numeric keypad for phone number and OTP entry. Long-press 0 for `+`. */
export default function Keypad({ onKey, style }: KeypadProps) {
  const styles = useStyles();
  const { isTablet, contentWidth } = useResponsive();
  return (
    <View style={[styles.pad, isTablet && { alignSelf: 'center', width: contentWidth }, style]}>
      {KEYS.map(([key, sub], i) =>
        key === null ? (
          <View key={`empty-${i}`} style={styles.key} />
        ) : (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={key === 'back' ? 'Delete' : key}
            onPress={() => onKey(key)}
            onLongPress={key === '0' ? () => onKey('+') : undefined}
            style={({ pressed }) => [styles.key, pressed && { backgroundColor: colors.surface3 }]}
          >
            <AppText weight="semibold" style={styles.digit}>
              {key === 'back' ? '⌫' : key}
            </AppText>
            {sub ? (
              <AppText weight="bold" color="faint" style={styles.letters}>
                {sub}
              </AppText>
            ) : null}
          </Pressable>
        ),
      )}
    </View>
  );
}
