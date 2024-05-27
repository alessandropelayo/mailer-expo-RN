import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<SafeAreaProvider>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack
					screenOptions={{
						headerStyle: {
							backgroundColor:
								colorScheme === "light"
									? Colors.light.foreground
									: Colors.dark.foreground,
						},
						headerTitleStyle: {
							color:
								colorScheme === "light" ? Colors.light.text : Colors.dark.text,
						},
						headerTintColor:
							colorScheme === "light" ? Colors.light.tint : Colors.dark.tint,
						navigationBarColor:
							colorScheme === "light"
								? Colors.light.foreground
								: Colors.dark.foreground,
					}}
				>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="Settings" options={{ headerShown: true }} />
					<Stack.Screen name="+not-found" />
				</Stack>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
