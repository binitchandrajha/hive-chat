import { useState } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fontFamilies } from '../../../theme';
import { makeStyles, MAX_FONT_MULTIPLIER } from '../../../utils/responsive';
import AppText from '../AppText/AppText';
import Icon, { type IconName } from '../Icon/Icon';

export interface TextFieldProps {
  label?: string;
  value: string;
  placeholder?: string;
  /** Leading picker text, e.g. "🇳🇵 +977"; tapping it calls `onPrefixPress`. */
  prefix?: string;
  onPrefixPress?: () => void;
  icon?: IconName;
  /** Force the focus look (otherwise it follows real focus). */
  focused?: boolean;
  onChange: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
  /** Hide the system keyboard (screens that show the in-app Keypad). */
  showSoftInputOnFocus?: boolean;
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  field: { gap: ms(7) },
  box: {
    height: s(52),
    borderRadius: ms(14),
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(14),
    gap: ms(10),
  },
  focus: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.25,
    shadowRadius: ms(4),
    shadowOffset: { width: 0, height: 0 },
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    paddingRight: ms(12),
    borderRightWidth: 1,
    borderRightColor: colors.line,
    height: '55%',
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: fs(16),
    fontFamily: fontFamilies.semibold,
    paddingVertical: 0,
  },
}));

/** Labelled input with focus ring, optional country prefix or leading icon. */
export default function TextField({
  label,
  value,
  placeholder,
  prefix,
  onPrefixPress,
  icon,
  focused,
  onChange,
  keyboardType,
  autoFocus,
  showSoftInputOnFocus,
  maxLength,
  style,
}: TextFieldProps) {
  const styles = useStyles();
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const isFocused = focused ?? hasFocus;

  return (
    <View style={[styles.field, style]}>
      {label ? (
        <AppText variant="caption" weight="bold" color="muted">
          {label}
        </AppText>
      ) : null}
      <View style={[styles.box, isFocused && styles.focus]}>
        {prefix ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Country code ${prefix}`}
            onPress={onPrefixPress}
            style={styles.prefix}
          >
            <AppText variant="bodyLg" weight="semibold">
              {prefix}
            </AppText>
            <Icon name="down" size={14} color="text" />
          </Pressable>
        ) : null}
        {icon ? <Icon name={icon} size={20} color={isFocused ? 'accent' : 'muted'} /> : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.faint}
          selectionColor={colors.accent}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          showSoftInputOnFocus={showSoftInputOnFocus}
          maxLength={maxLength}
          accessibilityLabel={label ?? placeholder}
          maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          style={styles.input}
        />
      </View>
    </View>
  );
}
