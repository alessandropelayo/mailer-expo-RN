import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { View, useColorScheme } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor:
					colorScheme === "light" ? Colors.light.tint : Colors.dark.tint,
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "light"
							? Colors.light.foreground
							: Colors.dark.foreground,
				},
				tabBarHideOnKeyboard: true,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "home" : "home-outline"}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
