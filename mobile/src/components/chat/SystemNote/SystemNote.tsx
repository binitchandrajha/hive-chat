import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export interface SystemNoteProps {
  text: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms, fs }) => ({
  note: {
    alignSelf: 'center',
    maxWidth: '84%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: ms(6),
    marginBottom: ms(10),
    paddingVertical: ms(7),
    paddingHorizontal: ms(12),
    borderRadius: ms(12),
    backgroundColor: withAlpha(colors.accent, 0.08),
    borderWidth: 1,
    borderColor: withAlpha(colors.accent, 0.2),
  },
  text: { flexShrink: 1, lineHeight: fs(16.5) },
}));

/** Centred system message ("Messages are end-to-end encrypted", "Kiran created the group"). */
export default function SystemNote({ text, icon = 'lock', style }: SystemNoteProps) {
  const styles = useStyles();
  return (
    <View style={[styles.note, style]}>
      <Icon name={icon} size={14} color="accent" />
      <AppText variant="caption" weight="medium" color="accent" align="center" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}
