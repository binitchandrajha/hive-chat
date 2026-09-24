import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { ColorToken } from '../../../theme';
import { makeStyles, useResponsive } from '../../../utils/responsive';
import AppText from '../../ui/AppText/AppText';
import type { IconName } from '../../ui/Icon/Icon';
import IconButton, { type IconButtonVariant } from '../../ui/IconButton/IconButton';

export interface AppBarAction {
  icon: IconName;
  /** Accessibility label. */
  label: string;
  onPress?: () => void;
}

export interface AppBarProps {
  title?: string;
  sub?: string;
  /** Shows a leading back button. */
  onBack?: () => void;
  /** Glyph for the leading button: `back` (default), `close` (modals), `down` (minimise call). */
  backIcon?: Extract<IconName, 'back' | 'close' | 'down'>;
  actions?: readonly AppBarAction[];
  /** Big 24pt title for tab roots. Default: true when there is no back button. */
  large?: boolean;
  /** Button style for back + actions (`fill` on video). */
  buttonVariant?: IconButtonVariant;
  /** Text/icon colour, e.g. `onAccent` over a coloured background. */
  color?: ColorToken;
  /** Replaces the title block (e.g. a centred call label). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ s, ms }) => ({
  bar: {
    height: s(58),
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    paddingRight: ms(10),
  },
  titleBox: { flex: 1, minWidth: 0 },
}));

/** Top bar: large title for tab roots, compact with back button for inner pages. */
export default function AppBar({
  title = '',
  sub,
  onBack,
  backIcon = 'back',
  actions = [],
  large,
  buttonVariant = 'plain',
  color = 'text',
  children,
  style,
}: AppBarProps) {
  const styles = useStyles();
  const { ms } = useResponsive();
  const isLarge = large ?? !onBack;
  const backLabel = backIcon === 'close' ? 'Close' : backIcon === 'down' ? 'Minimise' : 'Back';

  return (
    <View style={[styles.bar, { paddingLeft: ms(onBack ? 6 : 16) }, style]}>
      {onBack ? (
        <IconButton icon={backIcon} label={backLabel} onPress={onBack} variant={buttonVariant} color={color} />
      ) : null}
      {children ?? (
        <View style={styles.titleBox}>
          <AppText variant={isLarge ? 'title' : 'subtitle'} color={color} numberOfLines={1} accessibilityRole="header">
            {title}
          </AppText>
          {sub ? (
            <AppText variant="caption" weight="medium" color="muted" numberOfLines={1}>
              {sub}
            </AppText>
          ) : null}
        </View>
      )}
      {actions.map((a) => (
        <IconButton
          key={a.label}
          icon={a.icon}
          label={a.label}
          onPress={a.onPress}
          variant={buttonVariant}
          color={color}
        />
      ))}
    </View>
  );
}
