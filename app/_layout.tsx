import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeContent, { useTheme } from "@/context/theme";

export default function RootLayout() {
	
	return (
		<SafeAreaProvider>
			<ThemeContent>
				<RootStack/>
			</ThemeContent>
		</SafeAreaProvider>
	);
}

function RootStack() {

	const theme = useTheme().currentTheme;

	return (<Stack
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
		<Stack.Screen name="Settings" options={{ headerShown: true, navigationBarColor: theme.background }} />
		<Stack.Screen name="+not-found" />
	</Stack>);
}