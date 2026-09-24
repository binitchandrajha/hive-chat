import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, withAlpha } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';

export interface SheetProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: withAlpha(colors.black, 0.55) },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: ms(radius.xl),
    borderTopRightRadius: ms(radius.xl),
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: ms(18),
    paddingTop: ms(10),
  },
  grab: {
    width: s(40),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: colors.surface3,
    alignSelf: 'center',
    marginBottom: ms(14),
  },
  title: { marginBottom: ms(14) },
}));

/** Bottom sheet over a dimmed scrim. Tap the scrim or back button to close. */
export default function Sheet({ title, open, onClose, children, style }: SheetProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { ms, isTablet, contentWidth, width } = useResponsive();
  const [mounted, setMounted] = useState<boolean>(open);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) setMounted(true);
    Animated.timing(progress, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: true }).start(
      ({ finished }) => {
        if (finished && !open) setMounted(false);
      },
    );
  }, [open, progress]);

  const side = isTablet ? (width - contentWidth) / 2 : 0;

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[styles.scrim, { opacity: progress }]}>
        <Pressable accessibilityLabel="Close" style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + ms(24), left: side, right: side },
          {
            transform: [
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [ms(400), 0] }) },
            ],
          },
          style,
        ]}
      >
        <View style={styles.grab} />
        {title ? (
          <AppText variant="subtitle" style={styles.title} accessibilityRole="header">
            {title}
          </AppText>
        ) : null}
        {children}
      </Animated.View>
    </Modal>
  );
}
