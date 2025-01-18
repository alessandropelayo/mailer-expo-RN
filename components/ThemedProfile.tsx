import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { AccessLevel, AuthResponse } from "@/types/auth";
import { storeAuthData } from "@/utils/auth";
import api from "@/utils/axios";
import axios from "axios";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACCESS_LEVEL_INFO: Record<
	AccessLevel,
	{
		next: AccessLevel | null;
		label: string;
	}
> = {
	NO_ACCESS: { next: "BASIC", label: "No Access" },
	BASIC: { next: "ADVANCED", label: "Basic Access" },
	ADVANCED: { next: "FULL_ACCESS", label: "Advanced Access" },
	FULL_ACCESS: { next: null, label: "Full Access" },
} as const;

export function ThemedProfileScreen() {
	const insets = useSafeAreaInsets();
	const { isLoading, user } = useAuth();
	const [error, setError] = useState("");
	const [isRequesting, setIsRequesting] = useState(false);

	if (isLoading) {
		return (
			<ThemedView
				style={[
					styles.container,
					styles.centerContent,
					{ paddingTop: insets.top },
				]}
			>
				<ActivityIndicator size="large" color="white" />
			</ThemedView>
		);
	}

	const requestAccessLevel = async (reqLevel: AccessLevel) => {
		if (isRequesting) return;

		setIsRequesting(true);
		setError("");

		try {
			const response = await api.post<AuthResponse>("/access/request", {
				requestedLevel: reqLevel,
			});
			await storeAuthData(response.data);
			Alert.alert(
				"Request Submitted",
				`Your request for ${ACCESS_LEVEL_INFO[reqLevel].label} has been submitted successfully.`
			);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || "An error occurred");
			} else {
				setError("An unexpected error occurred");
				console.error(err);
			}
		} finally {
			setIsRequesting(false);
		}
	};

	const currentLevel = user?.accessLevel || "NO_ACCESS";
	const nextLevel = ACCESS_LEVEL_INFO[currentLevel as AccessLevel].next;
    console.log("Cur Levl:", user)
	return (
		<>
			<ThemedView style={styles.header}>
				<ThemedText style={[styles.title, { paddingVertical: 5 }]}>
					Profile
				</ThemedText>
				{error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
			</ThemedView>

			{user ? (
				<ThemedView style={[styles.profileCard]}>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Email</ThemedText>
						<ThemedText style={styles.value}>{user.email || "N/A"}</ThemedText>
					</ThemedView>

					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Role</ThemedText>
						<ThemedText style={styles.value}>{user.role || "N/A"}</ThemedText>
					</ThemedView>

					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Access Level</ThemedText>
						<ThemedText style={styles.value}>
							{ACCESS_LEVEL_INFO[currentLevel as AccessLevel].label}
						</ThemedText>
					</ThemedView>

					{nextLevel && (
						<TouchableOpacity
							style={[styles.button, isRequesting && styles.buttonDisabled]}
							onPress={() => requestAccessLevel(nextLevel)}
							disabled={isRequesting}
						>
							<ThemedText style={styles.buttonText}>
								{isRequesting
									? "Requesting..."
									: `Request ${ACCESS_LEVEL_INFO[nextLevel].label}`}
							</ThemedText>
						</TouchableOpacity>
					)}
				</ThemedView>
			) : (
				<ThemedView style={styles.errorContainer}>
					<ThemedText style={styles.noDataText}>
						No user data available
					</ThemedText>
					<Link href="../(auth)/Register" asChild>
						<TouchableOpacity style={styles.button}>
							<ThemedText style={styles.buttonText}>Go to Login</ThemedText>
						</TouchableOpacity>
					</Link>
				</ThemedView>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContent: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		paddingTop: 40,
		alignItems: "center",
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
	},
	profileCard: {
		borderRadius: 12,
		padding: 20,
		marginBottom: 24,
		marginHorizontal: 10,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
	},
	label: {
		fontSize: 16,
		opacity: 0.7,
	},
	value: {
		fontSize: 16,
		fontWeight: "500",
	},
	error: {
		color: "#ff6b6b",
		marginVertical: 8,
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noDataText: {
		fontSize: 16,
		opacity: 0.7,
		marginBottom: 16,
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
