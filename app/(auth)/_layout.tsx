import { useTheme } from "@/context/theme";
import { Stack } from "expo-router";

export default function AuthLayout() {
	const theme = useTheme().currentTheme;

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
			<Stack.Screen name="SignIn" options={{ headerShown: false }} />
			<Stack.Screen name="Register" options={{ headerShown: false }} />
		</Stack>
	);
}
