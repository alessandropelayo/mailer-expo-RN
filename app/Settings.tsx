import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const insets = useSafeAreaInsets();

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
		</ThemedView>
	);
}
