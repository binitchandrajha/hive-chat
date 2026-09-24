import { Children, Fragment, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '../../../theme';
import { makeStyles } from '../../../utils/responsive';

export interface SettingsGroupProps {
  /** SettingsRow elements; dividers are added between them. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  group: {
    marginHorizontal: ms(16),
    marginVertical: ms(8),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: ms(radius.lg),
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: colors.line },
}));

/** Rounded card grouping SettingsRows. */
export default function SettingsGroup({ children, style }: SettingsGroupProps) {
  const styles = useStyles();
  const rows = Children.toArray(children);
  return (
    <View style={[styles.group, style]}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 ? <View style={styles.divider} /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}
