import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FloatingIcon } from "@/components/navigation/FloatingIcon";
import { useTheme } from "@/context/theme";

import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
	const insets = useSafeAreaInsets();

	const theme = useTheme().currentTheme;

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
			<ThemedView
				style={{
					alignItems: "flex-end",
					width: "100%",
					paddingRight: "4%",
				}}
			>
				<Link href="/Settings" style={{ marginTop: 15, paddingVertical: 15 }}>
					<FloatingIcon name={"ellipsis-vertical"} color={theme.icon}/>
				</Link>
			</ThemedView>
		</ThemedView>
	);
}
