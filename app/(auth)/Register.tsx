import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme";
import { AuthInput } from "@/components/TextAuthInput";
import { storeAuthData } from "@/utils/auth";
import { AuthResponse } from "@/types/auth";
import { api } from "@/utils/axios";
import axios from "axios";
import i18n from "@/hooks/localization";

export default function Register() {
	const router = useRouter();
	const theme = useTheme().currentTheme;
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleRegister = async () => {
		try {
			const response = await api.post<AuthResponse>("/auth/register", {
				email,
				password,
			});
			await storeAuthData(response.data);
			router.replace("/(tabs)/Home");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response?.data)
				setError(error.response?.data?.message || "An error occurred");
			} else {
				setError("An unexpected error occurred");
				console.log(error);
			}
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<Text style={[styles.title, { color: theme.text }]}>{i18n.t("register")}</Text>

			{error ? (
				<Text style={[styles.error, { color: "red" }]}>{error}</Text>
			) : null}

			<AuthInput
				placeholder={i18n.t("email")}
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<AuthInput
				placeholder={i18n.t("password")}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity
				style={[styles.button, { backgroundColor: theme.foreground }]}
				onPress={handleRegister}
			>
				<Text style={[styles.buttonText, { color: theme.text }]}>{i18n.t("register")}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => router.replace("/SignIn")}
				style={styles.linkButton}
			>
				<Text style={[styles.linkText, { color: theme.text }]}>
					{i18n.t("already have an account? sign in")}
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
