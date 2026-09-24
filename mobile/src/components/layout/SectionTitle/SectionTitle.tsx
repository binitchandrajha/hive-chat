import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';

export interface SectionTitleProps {
  title: string;
  /** Optional link on the right, e.g. "148 ›" or "See all". */
  action?: { label: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(6),
  },
}));

/** Small uppercase heading above a list section. */
export default function SectionTitle({ title, action, style }: SectionTitleProps) {
  const styles = useStyles();
  return (
    <View style={[styles.row, style]}>
      <AppText variant="overline" color="faint" accessibilityRole="header" numberOfLines={1}>
        {title}
      </AppText>
      {action ? (
        <Pressable accessibilityRole="link" onPress={action.onPress} hitSlop={8}>
          <AppText variant="small" weight="bold" color="accent">
            {action.label}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
