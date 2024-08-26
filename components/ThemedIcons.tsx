import { useTheme } from "@/context/theme";
import { MaterialIcons } from "@expo/vector-icons";

import { Dimensions, ViewProps } from "react-native";

export type ThemedIconsProps = ViewProps & {
	iconName: keyof typeof MaterialIcons.glyphMap;
	size?: number | string;
	color?: string;
};

export const ThemedIcons = ({
	iconName,
	size,
	style,
	...otherProps
}: ThemedIconsProps) => {
	const resolvedSize =
		typeof size === "string" && size.endsWith("%")
			? (Dimensions.get("window").width * parseFloat(size)) / 100
			: (size as number);
	return (
		<MaterialIcons
			name={iconName}
			adjustsFontSizeToFit={true}
			size={resolvedSize}
			style={style}
			color={useTheme().currentTheme.icon}
			{...otherProps}
		></MaterialIcons>
	);
};
