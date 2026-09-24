import { useState } from 'react';
import { Pressable, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontFamilies } from '../../../theme';
import { makeStyles, MAX_FONT_MULTIPLIER } from '../../../utils/responsive';
import AppText from '../AppText/AppText';
import Icon from '../Icon/Icon';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  /**
   * Make the bar a button (e.g. on the Chats home it opens the Search screen)
   * instead of an editable field.
   */
  onPress?: () => void;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    height: s(44),
    borderRadius: ms(14),
    backgroundColor: colors.surface2,
    paddingHorizontal: ms(14),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focus: { borderColor: colors.accent },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: fs(14),
    fontFamily: fontFamilies.medium,
    paddingVertical: 0,
    // No browser focus ring on web (Chrome's 'auto' ring ignores width) — the box shows focus.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
}));

/** Rounded search field. */
export default function SearchBar({
  placeholder = 'Search chats, people, messages',
  value = '',
  onChange,
  onPress,
  autoFocus,
  style,
}: SearchBarProps) {
  const styles = useStyles();
  const [focused, setFocused] = useState<boolean>(false);

  if (onPress) {
    return (
      <Pressable accessibilityRole="search" accessibilityLabel={placeholder} onPress={onPress} style={[styles.bar, style]}>
        <Icon name="search" size={18} color="muted" />
        <AppText variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>
          {placeholder}
        </AppText>
      </Pressable>
    );
  }

  return (
    <View style={[styles.bar, focused && styles.focus, style]}>
      <Icon name="search" size={18} color={focused ? 'text' : 'muted'} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        selectionColor={colors.accent}
        autoFocus={autoFocus}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
      />
    </View>
  );
}
