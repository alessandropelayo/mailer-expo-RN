import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "@/context/theme";
import { useRouter } from "expo-router";
import { AuthResponse, User } from "@/types/auth";
import api from "@/utils/axios";
import { storeAuthData } from "@/utils/auth";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";

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
			<TouchableOpacity
				style={[styles.button, { backgroundColor: theme.foreground }]}
				onPress={() => router.navigate("/(auth)/SignIn")}
			>
				<ThemedText style={styles.buttonText}>Sign In</ThemedText>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, { backgroundColor: theme.foreground }]}
				onPress={() => router.navigate("/(auth)/Register")}
			>
				<ThemedText style={styles.buttonText}>Register</ThemedText>
			</TouchableOpacity>
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
	button: {
		backgroundColor: "#4a9eff",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginTop: 16,
		minWidth: 200,
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
