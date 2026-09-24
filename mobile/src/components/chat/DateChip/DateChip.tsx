import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, withAlpha } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';

export interface DateChipProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  chip: {
    alignSelf: 'center',
    marginTop: ms(10),
    marginBottom: ms(8),
    backgroundColor: withAlpha(colors.surface2, 0.9),
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: ms(5),
    paddingHorizontal: ms(12),
    borderRadius: s(999),
  },
}));

/** Day separator in a conversation ("Today"). */
export default function DateChip({ label, style }: DateChipProps) {
  const styles = useStyles();
  return (
    <View style={[styles.chip, style]} accessibilityRole="header">
      <AppText variant="caption" weight="bold" color="muted">
        {label}
      </AppText>
    </View>
  );
}
