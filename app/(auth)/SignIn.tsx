import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme";
import { AuthInput } from "@/components/TextAuthInput";
import { storeAuthData } from "@/utils/auth";
import { api } from "@/utils/axios";
import { AuthResponse } from "@/types/auth";
import axios from "axios";

export default function SignIn() {
	const router = useRouter();
	const theme = useTheme().currentTheme;
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignIn = async () => {
		try {
			const response = await api.post<AuthResponse>("/auth/login", {
				email,
				password,
			});

			await storeAuthData(response.data);
			router.replace("/(tabs)/Home");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data?.message || "An error occurred");
			} else {
				setError("An unexpected error occurred");
			}
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

			{error ? (
				<Text style={[styles.error, { color: "red" }]}>{error}</Text>
			) : null}

			<AuthInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<AuthInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity
				style={[styles.button, { backgroundColor: theme.foreground }]}
				onPress={handleSignIn}
			>
				<Text style={[styles.buttonText, { color: theme.text }]}>Sign In</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => router.replace("/Register")}
				style={styles.linkButton}
			>
				<Text style={[styles.linkText, { color: theme.tint }]}>
					Don't have an account? Register
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 24,
		textAlign: "center",
	},
	error: {
		marginBottom: 16,
		textAlign: "center",
	},
	button: {
		height: 50,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	linkButton: {
		marginTop: 16,
		alignItems: "center",
	},
	linkText: {
		fontSize: 16,
	},
});
