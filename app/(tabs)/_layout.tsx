import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "@/context/theme";
import i18n from "@/hooks/localization";


export default function TabLayout() {

	const theme = useTheme().currentTheme;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.tint,
				headerShown: false,
				tabBarStyle: {
					borderColor: theme.foreground,
					backgroundColor: theme.foreground,
				},
				tabBarHideOnKeyboard: true,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: i18n.t("mail"),
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "mail" : "mail-outline"}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Video"
				options={{
					title: "Calendar",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? "tv" : "tv-outline"} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
