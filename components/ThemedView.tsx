import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/context/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, children, ...otherProps }: ThemedViewProps) {
  //const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const backgroundColor = useTheme().currentTheme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps}>{children}</View>;
}
