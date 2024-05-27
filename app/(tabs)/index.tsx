import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
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
			<ThemedText>Edit app/(tabs)/index.tsx to edit this screen.</ThemedText>
			<Link href="/Settings" style={{ marginTop: 15, paddingVertical: 15 }}>
				<ThemedText type="link">Go to settings!</ThemedText>
			</Link>
		</ThemedView>
	);
}
