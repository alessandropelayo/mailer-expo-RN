import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeContent, { useTheme } from "@/context/theme";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
	return (
		<ThemeContent>
			<SafeAreaProvider>
				<RootStack />
			</SafeAreaProvider>
		</ThemeContent>
	);
}

function RootStack() {
	const theme = useTheme().currentTheme;
	SystemUI.setBackgroundColorAsync(theme.background);

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.background,
				},
				headerTitleStyle: {
					color: theme.text,
				},
				headerTintColor: theme.tint,
				navigationBarColor: theme.foreground,
			}}
		>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="Settings"
				options={{ headerShown: true, navigationBarColor: theme.background }}
			/>
			<Stack.Screen name="+not-found" />
		</Stack>
	);
}
