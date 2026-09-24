import { memo, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha, type ColorToken } from '../../../theme';
import type { Tick } from '../../../types/person';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Gradient from '../../ui/Gradient/Gradient';
import Icon from '../../ui/Icon/Icon';
import MediaThumb, { type MediaSource } from '../../ui/MediaThumb/MediaThumb';
import Waveform from '../Waveform/Waveform';

export type BubbleDir = 'in' | 'out';

export interface BubbleQuote {
  who: string;
  text: string;
}
export interface BubbleVoice {
  /** Played fraction 0–1. */
  progress: number;
  /** "0:18" */
  duration: string;
  playing?: boolean;
}
export interface BubbleDoc {
  /** "PDF" */
  ext: string;
  name: string;
  /** "2.4 MB · 12 pages" */
  size: string;
}
export interface BubbleLink {
  title: string;
  domain: string;
  image?: MediaSource;
}
export interface BubblePollOption {
  label: string;
  votes: number;
  selected?: boolean;
}
export interface BubblePoll {
  question: string;
  /** "Select one" */
  hint?: string;
  options: readonly BubblePollOption[];
}

export interface BubbleProps {
  dir: BubbleDir;
  text?: string;
  time: string;
  /** Delivery state, outgoing only. */
  tick?: Tick;
  /** Group chats: sender name above the text (incoming). */
  sender?: string;
  /** Colour for `sender` (from `senderColors`). */
  senderColor?: string;
  quote?: BubbleQuote;
  /** Reaction summary, e.g. "❤️ 🔥" or "👍 2". */
  reactions?: string;
  /** Follows a bubble from the same sender — squares the top corner. */
  grouped?: boolean;
  image?: MediaSource;
  voice?: BubbleVoice;
  doc?: BubbleDoc;
  link?: BubbleLink;
  poll?: BubblePoll;
  onPress?: () => void;
  onLongPress?: () => void;
  onPlayVoice?: () => void;
  onVote?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms, fs }) => ({
  bubble: {
    paddingTop: ms(8),
    paddingHorizontal: ms(11),
    paddingBottom: ms(6),
    borderRadius: ms(18),
  },
  wrap: { marginVertical: ms(2) },
  wrapReact: { marginBottom: ms(16) },
  inBg: { backgroundColor: colors.surface2 },
  withReact: { paddingBottom: ms(14) },
  metaAboveReact: { bottom: ms(11) },
  pollHint: { opacity: 0.7, marginTop: ms(2), marginBottom: ms(8) },
  sender: { fontSize: fs(12.5), marginBottom: ms(2) },
  quote: {
    borderLeftWidth: 3,
    borderRadius: ms(8),
    paddingVertical: ms(6),
    paddingHorizontal: ms(8),
    marginTop: ms(2),
    marginHorizontal: -ms(3),
    marginBottom: ms(6),
  },
  image: { marginTop: -ms(4), marginHorizontal: -ms(7), marginBottom: ms(6), borderRadius: ms(14), height: s(170) },
  link: {
    marginTop: -ms(4),
    marginHorizontal: -ms(7),
    marginBottom: ms(6),
    borderRadius: ms(14),
    overflow: 'hidden',
    backgroundColor: withAlpha(colors.black, 0.14),
  },
  linkImg: { height: s(90) },
  linkText: { paddingVertical: ms(8), paddingHorizontal: ms(10) },
  doc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    backgroundColor: withAlpha(colors.black, 0.12),
    borderRadius: ms(12),
    padding: ms(10),
    marginTop: -ms(2),
    marginHorizontal: -ms(4),
    marginBottom: ms(4),
    minWidth: s(200),
  },
  docIcon: {
    width: s(38),
    height: s(44),
    borderRadius: ms(8),
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docExt: { fontSize: fs(10) },
  voice: { flexDirection: 'row', alignItems: 'center', gap: ms(10), minWidth: s(200), paddingVertical: ms(2) },
  play: { width: s(34), height: s(34), borderRadius: s(17), alignItems: 'center', justifyContent: 'center' },
  pollOption: { marginBottom: ms(8) },
  pollHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ms(4) },
  pollLabel: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
  pollRadio: { width: s(16), height: s(16), borderRadius: s(8), borderWidth: 2 },
  pollTrack: { height: s(5), borderRadius: s(3), backgroundColor: withAlpha(colors.black, 0.15), overflow: 'hidden' },
  pollFill: { height: '100%', borderRadius: s(3) },
  meta: { flexDirection: 'row', alignItems: 'center', gap: ms(3) },
  metaFloat: { position: 'absolute', right: ms(11), bottom: ms(5) },
  metaBlock: { alignSelf: 'flex-end', marginTop: ms(2) },
  metaText: { fontSize: fs(10.5) },
  react: {
    position: 'absolute',
    bottom: -ms(12),
    flexDirection: 'row',
    backgroundColor: colors.surface3,
    borderWidth: 2,
    borderColor: colors.bg,
    borderRadius: s(999),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
  reactText: { fontSize: fs(12) },
}));

/** Split "@Name" mentions out so they render bold in the accent colour. */
function withMentions(text: string, mention: ColorToken): ReactNode[] {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@') ? (
      <AppText key={i} weight="bold" color={mention}>
        {part}
      </AppText>
    ) : (
      part
    ),
  );
}

/** Chat message bubble — text, reply quote, image, voice, document, link, poll and reactions. */
function Bubble({
  dir,
  text,
  time,
  tick,
  sender,
  senderColor,
  quote,
  reactions,
  grouped = false,
  image,
  voice,
  doc,
  link,
  poll,
  onPress,
  onLongPress,
  onPlayVoice,
  onVote,
  style,
}: BubbleProps) {
  const styles = useStyles();
  const { ms, wp, contentWidth, isTablet } = useResponsive();
  const out = dir === 'out';
  const fg: ColorToken = out ? 'onAccent' : 'text';
  const tail = ms(6);
  const full = ms(18);
  const maxWidth = isTablet ? contentWidth * 0.7 : wp(78);

  const corners: ViewStyle = out
    ? { borderBottomRightRadius: tail, borderTopRightRadius: grouped ? tail : full }
    : { borderBottomLeftRadius: tail, borderTopLeftRadius: grouped ? tail : full };

  const metaColor: ColorToken = out ? 'onAccent' : 'muted';
  const meta = (
    <View style={styles.meta}>
      <AppText weight="semibold" color={metaColor} style={[styles.metaText, { opacity: out ? 0.75 : 0.9 }]}>
        {time}
      </AppText>
      {out && tick ? (
        <Icon
          name={tick === 'sent' ? 'check' : 'dcheck'}
          size={15}
          strokeWidth={2.2}
          color={tick === 'read' ? 'tick' : withAlpha(colors.onAccent, 0.75)}
        />
      ) : null}
    </View>
  );
  // Invisible copy of the meta reserves room on the last text line (WhatsApp-style float).
  const metaSpacer = ` ${time}${out && tick ? '  ' : ''}`;
  const totalVotes = poll ? poll.options.reduce((n, o) => n + o.votes, 0) : 0;

  const body = (
    <>
      {sender && !out ? (
        <AppText weight="heavy" style={[styles.sender, { color: senderColor ?? colors.accent }]} numberOfLines={1}>
          {sender}
        </AppText>
      ) : null}

      {quote ? (
        <View
          style={[
            styles.quote,
            {
              borderLeftColor: out ? colors.onAccent : colors.accent,
              backgroundColor: withAlpha(colors.black, out ? 0.08 : 0.18),
            },
          ]}
        >
          <AppText variant="caption" weight="bold" color={fg} numberOfLines={1}>
            {quote.who}
          </AppText>
          <AppText variant="small" weight="regular" color={fg} numberOfLines={2} style={{ opacity: 0.85 }}>
            {quote.text}
          </AppText>
        </View>
      ) : null}

      {image ? <MediaThumb source={image} style={styles.image} /> : null}

      {link ? (
        <View style={styles.link}>
          <MediaThumb source={link.image ?? { tint: 'blue' }} style={styles.linkImg} />
          <View style={styles.linkText}>
            <AppText variant="small" weight="bold" color={fg} numberOfLines={1}>
              {link.title}
            </AppText>
            <AppText variant="caption" weight="regular" color={fg} style={{ opacity: 0.7 }}>
              {link.domain}
            </AppText>
          </View>
        </View>
      ) : null}

      {doc ? (
        <View style={styles.doc}>
          <View style={styles.docIcon}>
            <AppText weight="heavy" color="white" style={styles.docExt}>
              {doc.ext}
            </AppText>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText variant="small" weight="bold" color={fg} numberOfLines={1}>
              {doc.name}
            </AppText>
            <AppText variant="caption" weight="regular" color={fg} style={{ opacity: 0.7 }}>
              {doc.size}
            </AppText>
          </View>
        </View>
      ) : null}

      {voice ? (
        <View style={styles.voice}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={voice.playing ? 'Pause voice message' : 'Play voice message'}
            onPress={onPlayVoice}
            style={[styles.play, { backgroundColor: out ? colors.onAccent : colors.accent }]}
          >
            <Icon name={voice.playing ? 'pause' : 'play'} size={14} color={out ? 'accent' : 'onAccent'} />
          </Pressable>
          <Waveform progress={voice.progress} color={fg} />
          <AppText variant="caption" weight="bold" color={fg} style={{ opacity: 0.8 }}>
            {voice.duration}
          </AppText>
        </View>
      ) : null}

      {poll ? (
        <View>
          <AppText variant="body" weight="bold" color={fg}>
            {poll.question}
          </AppText>
          {poll.hint ? (
            <AppText variant="caption" weight="regular" color={fg} style={styles.pollHint}>
              {poll.hint}
            </AppText>
          ) : null}
          {poll.options.map((o, i) => {
            const bar = out ? colors.onAccent : colors.accent;
            const pct = totalVotes ? (o.votes / totalVotes) * 100 : 0;
            return (
              <Pressable
                key={o.label}
                accessibilityRole="radio"
                accessibilityState={{ checked: !!o.selected }}
                accessibilityLabel={`${o.label}, ${o.votes} votes`}
                onPress={onVote ? () => onVote(i) : undefined}
                style={styles.pollOption}
              >
                <View style={styles.pollHead}>
                  <View style={styles.pollLabel}>
                    <View style={[styles.pollRadio, { borderColor: bar, backgroundColor: o.selected ? bar : 'transparent' }]} />
                    <AppText variant="small" weight="semibold" color={fg}>
                      {o.label}
                    </AppText>
                  </View>
                  <AppText variant="small" weight="semibold" color={fg}>
                    {o.votes}
                  </AppText>
                </View>
                <View style={styles.pollTrack}>
                  <View style={[styles.pollFill, { width: `${pct}%`, backgroundColor: bar }]} />
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {text ? (
        <AppText variant="body" color={fg}>
          {withMentions(text, out ? 'tick' : 'accent')}
          <AppText variant="caption" style={{ color: 'transparent' }}>
            {metaSpacer}
          </AppText>
        </AppText>
      ) : null}

      <View style={text ? [styles.metaFloat, reactions ? styles.metaAboveReact : null] : styles.metaBlock}>{meta}</View>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      disabled={!onPress && !onLongPress}
      accessibilityLabel={`${out ? 'You' : sender ?? 'Them'}: ${text ?? (voice ? 'voice message' : doc ? doc.name : image ? 'photo' : poll ? poll.question : '')}, ${time}`}
      style={[
        styles.wrap,
        reactions ? styles.wrapReact : null,
        { maxWidth, alignSelf: out ? 'flex-end' : 'flex-start', minWidth: poll ? Math.min(maxWidth, ms(250)) : undefined },
        style,
      ]}
    >
      {out ? (
        <Gradient
          colors={[colors.accent, colors.accentDeep]}
          angle={160}
          style={[styles.bubble, corners, reactions ? styles.withReact : null]}
        >
          {body}
        </Gradient>
      ) : (
        <View style={[styles.bubble, styles.inBg, corners, reactions ? styles.withReact : null]}>{body}</View>
      )}
      {reactions ? (
        <View style={[styles.react, out ? { right: ms(10) } : { left: ms(10) }]}>
          <AppText style={styles.reactText}>{reactions}</AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

export default memo(Bubble);
