import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import Hexagon from '../../ui/Hexagon/Hexagon';
import Icon, { type IconName } from '../../ui/Icon/Icon';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  text: string;
  /** Buttons under the text. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms, fs }) => ({
  root: { alignItems: 'center', gap: ms(10), paddingVertical: ms(40), paddingHorizontal: ms(30) },
  title: { fontSize: fs(19) },
  text: { lineHeight: fs(21) },
  action: { alignSelf: 'stretch', gap: ms(8), marginTop: ms(8) },
}));

/** Friendly empty screen: hexagon icon, title, text and optional actions. */
export default function EmptyState({ icon = 'chat', title, text, action, style }: EmptyStateProps) {
  const styles = useStyles();
  return (
    <View style={[styles.root, style]}>
      <Hexagon size={96} fill={[colors.surface3, colors.surface]}>
        <Icon name={icon} size={40} strokeWidth={1.8} color="accent" />
      </Hexagon>
      <AppText weight="heavy" align="center" style={styles.title} accessibilityRole="header">
        {title}
      </AppText>
      <AppText variant="body" color="muted" align="center" style={styles.text}>
        {text}
      </AppText>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}
