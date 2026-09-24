import { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';

export interface TypingProps {
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  bubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: ms(4),
    backgroundColor: colors.surface2,
    borderRadius: ms(18),
    borderBottomLeftRadius: ms(6),
    paddingVertical: ms(12),
    paddingHorizontal: ms(14),
    marginVertical: ms(2),
  },
  dot: { width: s(7), height: s(7), borderRadius: s(4), backgroundColor: colors.muted },
}));

/** Incoming "typing…" bubble with three bobbing dots. */
export default function Typing({ style }: TypingProps) {
  const styles = useStyles();
  const { s } = useResponsive();
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const anims = dots.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(v, { toValue: 1, duration: 360, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 360, useNativeDriver: true }),
          Animated.delay(480 - i * 150),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [dots]);

  return (
    <Animated.View style={[styles.bubble, style]} accessibilityLabel="Typing">
      {dots.map((v, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
              transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -s(4)] }) }],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}
