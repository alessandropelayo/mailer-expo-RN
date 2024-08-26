import { RecentPackages } from "@/components/RecentItemsList";

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
				justifyContent: "flex-start",
				flexDirection: "column",
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
				flex: 1,
			}}
		>
			<ThemedView
				style={{
					alignItems: "flex-end",
					width: "100%",
					paddingRight: "1%",
					flexDirection: "column",
				}}
			>
				<Link
					href="/Settings"
					style={{
						marginTop: 15,
						paddingVertical: 15,
						paddingHorizontal: 15,
					}}
				>
					<FloatingIcon name={"ellipsis-vertical"} color={theme.icon} />
				</Link>
			</ThemedView>
			<RecentPackages></RecentPackages>
		</ThemedView>
	);
}
