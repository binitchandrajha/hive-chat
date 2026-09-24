import { useEffect, useRef } from 'react';
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import Icon from '../Icon/Icon';

export interface ToggleProps {
  on: boolean;
  onChange?: (on: boolean) => void;
  /** Accessibility label, e.g. the row title. */
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  track: {
    width: s(44),
    height: s(26),
    borderRadius: s(13),
    borderWidth: 1,
    justifyContent: 'center',
  },
  knob: { width: s(20), height: s(20), borderRadius: s(10), marginLeft: s(2) },
  radio: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    borderWidth: ms(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: s(10), height: s(10), borderRadius: s(5), backgroundColor: colors.accent },
  check: {
    width: s(22),
    height: s(22),
    borderRadius: ms(7),
    borderWidth: ms(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

/** On/off switch. */
export default function Toggle({ on, onChange, label, disabled = false, style }: ToggleProps) {
  const styles = useStyles();
  const { s } = useResponsive();
  const x = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(x, { toValue: on ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [on, x]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled || !onChange}
      onPress={() => onChange?.(!on)}
      hitSlop={s(8)}
      style={style}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: on ? colors.accent : colors.surface3,
            borderColor: on ? colors.accent : colors.line,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              backgroundColor: on ? colors.onAccent : colors.muted,
              transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, s(18)] }) }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

export type RadioProps = ToggleProps;

/** Single-choice selector. */
export function Radio({ on, onChange, label, disabled = false, style }: RadioProps) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled || !onChange}
      onPress={() => onChange?.(true)}
      style={[styles.radio, { borderColor: on ? colors.accent : colors.faint }, style]}
    >
      {on ? <View style={styles.radioDot} /> : null}
    </Pressable>
  );
}

export type CheckProps = ToggleProps;

/** Multi-select checkbox (contact picker). */
export function Check({ on, onChange, label, disabled = false, style }: CheckProps) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled || !onChange}
      onPress={() => onChange?.(!on)}
      style={[
        styles.check,
        { backgroundColor: on ? colors.accent : 'transparent', borderColor: on ? colors.accent : colors.faint },
        style,
      ]}
    >
      {on ? <Icon name="check" size={14} strokeWidth={3} color="onAccent" /> : null}
    </Pressable>
  );
}
