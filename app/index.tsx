import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "@/context/theme";
import { useRouter } from "expo-router";
import { AuthResponse, User } from "@/types/auth";
import api from "@/utils/axios";
import { storeAuthData } from "@/utils/auth";
import axios from "axios";

export default function IndexScreen() {
	const router = useRouter();
	const { user } = useAuth(); // Replace with your actual auth logic
	const theme = useTheme().currentTheme;

	const refreshLogin = async () => {
		try {
			const response = await api.post<AuthResponse>("/auth/refresh-token", {});
			const userResponse = await api.get<User>("/access/my-level", {});
			const combinedData: AuthResponse = {
				...response.data,
				user: userResponse.data,
			};
			await storeAuthData(combinedData);
			router.replace("/(tabs)/Home");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response?.data);
			} else {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		if (user) {
			refreshLogin();
			router.replace("/(tabs)/Home");
		}
	}, [user]);

	if (user) {
		return null; // Render nothing if redirecting
	}

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<Text style={[styles.title, { color: theme.text }]}>Welcome</Text>
			<Button
				title="Sign In"
				onPress={() => router.navigate("/(auth)/SignIn")}
				color={theme.foreground}
			/>
			<Button
				title="Register"
				onPress={() => router.navigate("/(auth)/Register")}
				color={theme.foreground}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		fontWeight: "bold",
	},
});
