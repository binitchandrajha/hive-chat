import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Pressable, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontFamilies, withAlpha } from '../../../theme';
import { makeStyles, MAX_FONT_MULTIPLIER } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Hexagon from '../../ui/Hexagon/Hexagon';
import Icon from '../../ui/Icon/Icon';
import IconButton from '../../ui/IconButton/IconButton';

export type ComposerState = 'idle' | 'typing' | 'recording';

export interface ComposerReply {
  who: string;
  text: string;
}

export interface ComposerProps {
  /** Default: `typing` when `value` has text, else `idle`. */
  state?: ComposerState;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  replyTo?: ComposerReply;
  onCancelReply?: () => void;
  onAttach?: () => void;
  onCamera?: () => void;
  onEmoji?: () => void;
  /** Mic pressed (idle). Hold-to-record gestures are wired by the screen. */
  onRecord?: () => void;
  /** Elapsed time while recording, "0:07". */
  recordingTime?: string;
  placeholder?: string;
  /**
   * `overlay` = translucent field on photos / Buzz (no emoji/attach/camera,
   * always shows Send). `trailing` renders inside the field on the right.
   */
  variant?: 'default' | 'overlay';
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(8),
    paddingTop: ms(8),
    paddingHorizontal: ms(10),
    paddingBottom: ms(6),
  },
  box: {
    flex: 1,
    minHeight: s(46),
    borderRadius: s(23),
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    paddingHorizontal: ms(6),
  },
  overlayBox: {
    backgroundColor: withAlpha(colors.black, 0.35),
    borderColor: withAlpha(colors.white, 0.2),
    paddingLeft: ms(14),
  },
  input: {
    flex: 1,
    minWidth: 0,
    maxHeight: s(120),
    color: colors.text,
    fontSize: fs(14.5),
    fontFamily: fontFamilies.regular,
    paddingHorizontal: ms(4),
    paddingVertical: ms(10),
    // No browser focus ring on web (Chrome's 'auto' ring ignores width) — the box shows focus.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  reply: {
    marginHorizontal: ms(10),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.line,
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    paddingVertical: ms(8),
    paddingLeft: ms(12),
    paddingRight: ms(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
  },
  quote: { flex: 1, minWidth: 0, borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: ms(8) },
  rec: {
    flex: 1,
    height: s(46),
    borderRadius: s(23),
    backgroundColor: colors.surface2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    paddingHorizontal: ms(14),
  },
  redDot: { width: s(10), height: s(10), borderRadius: s(5), backgroundColor: colors.rose },
}));

/** Message input: idle (mic) · typing (send) · recording, with optional reply bar. */
export default function Composer({
  state,
  value,
  onChange,
  onSend,
  replyTo,
  onCancelReply,
  onAttach,
  onCamera,
  onEmoji,
  onRecord,
  recordingTime = '0:00',
  placeholder = 'Message',
  variant = 'default',
  trailing,
  style,
}: ComposerProps) {
  const styles = useStyles();
  const mode: ComposerState = state ?? (value.trim() ? 'typing' : 'idle');
  const overlay = variant === 'overlay';
  const showSend = overlay || mode === 'typing';

  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (mode !== 'recording') return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mode, blink]);

  const action = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={showSend ? 'Send' : mode === 'recording' ? 'Stop recording' : 'Record voice message'}
      onPress={showSend || mode === 'recording' ? onSend : onRecord}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Hexagon size={46} fill={[colors.accent, colors.accentDeep]}>
        <Icon name={showSend ? 'send' : 'mic'} size={21} color="onAccent" />
      </Hexagon>
    </Pressable>
  );

  return (
    <View style={style}>
      {replyTo && !overlay ? (
        <View style={styles.reply}>
          <View style={styles.quote}>
            <AppText variant="caption" weight="bold" color="accent" numberOfLines={1}>
              {replyTo.who}
            </AppText>
            <AppText variant="small" weight="regular" color="muted" numberOfLines={1}>
              {replyTo.text}
            </AppText>
          </View>
          <IconButton icon="close" label="Cancel reply" size={32} iconSize={18} color="muted" onPress={onCancelReply} />
        </View>
      ) : null}

      <View style={styles.row}>
        {mode === 'recording' ? (
          <View style={styles.rec} accessibilityLiveRegion="polite">
            <Animated.View style={[styles.redDot, { opacity: blink }]} />
            <AppText variant="body" weight="bold">
              {recordingTime}
            </AppText>
            <AppText variant="small" weight="regular" color="muted" numberOfLines={1} style={{ flex: 1 }}>
              ‹ slide to cancel
            </AppText>
          </View>
        ) : (
          <View style={[styles.box, overlay && styles.overlayBox]}>
            {!overlay ? <IconButton icon="smile" label="Emoji" size={36} color="muted" onPress={onEmoji} /> : null}
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={overlay ? withAlpha(colors.white, 0.8) : colors.muted}
              selectionColor={colors.accent}
              multiline
              accessibilityLabel={placeholder}
              maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}
              style={styles.input}
            />
            {!overlay ? (
              <IconButton icon="clip" label="Attach" size={36} iconSize={21} color="muted" onPress={onAttach} />
            ) : null}
            {!overlay && mode === 'idle' ? (
              <IconButton icon="camera" label="Camera" size={36} iconSize={21} color="muted" onPress={onCamera} />
            ) : null}
            {trailing}
          </View>
        )}
        {action}
      </View>
    </View>
  );
}
