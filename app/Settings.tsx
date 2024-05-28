import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/context/theme";
import { Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const insets = useSafeAreaInsets();

	const theme = useTheme().currentTheme;
	const toggleTheme = useTheme().toggleTheme;

	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: "flex-start",
				alignItems: "center",
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
			}}
		>
			<ThemedText>Settings</ThemedText>
			<Button
				onPress={toggleTheme}
				title={`Switch to Mode`}
				color={theme.link}
			/>
		</ThemedView>
	);
}
