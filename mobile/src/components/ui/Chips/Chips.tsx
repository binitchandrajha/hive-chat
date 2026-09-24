import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles } from '../../../utils/responsive';
import Chip from './Chip';

export interface ChipItem {
  label: string;
  count?: number | string;
}

export interface ChipsProps {
  items: readonly ChipItem[];
  /** Index of the selected chip. */
  active: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const useStyles = makeStyles(({ ms }) => ({
  row: { gap: ms(8), paddingHorizontal: ms(16), paddingTop: ms(12), paddingBottom: ms(6) },
}));

/** Horizontally scrolling filter chips (All · Unread · Groups…). */
export default function Chips({ items, active, onChange, style }: ChipsProps) {
  const styles = useStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={[{ flexGrow: 0 }, style]}
    >
      {items.map((item, i) => (
        <Chip
          key={item.label}
          label={item.label}
          count={item.count}
          active={i === active}
          onPress={() => onChange(i)}
        />
      ))}
    </ScrollView>
  );
}
