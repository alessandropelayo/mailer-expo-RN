import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { AccessRequest } from "@/types/interfaces/interfaces";
import { AccessRequestStatus } from "@/types/auth";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import api from "@/utils/axios";
import axios from "axios";

interface AccessRequestCardProps {
	request: AccessRequest;
	onPress?: (request: AccessRequest) => void;
	onRemove: any;
}

const formatDate = (date: Date) => {
	return new Date(date).toLocaleDateString();
};

const AccessRequestCard = ({
	request,
	onPress,
	onRemove,
}: AccessRequestCardProps) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const [error, setError] = useState("");

	const getStatusColor = (status: AccessRequestStatus) => {
		switch (status) {
			case "PENDING":
				return "#FFA500";
			case "APPROVED":
				return "#4CAF50";
			case "REJECTED":
				return "#F44336";
			default:
				return "inherit";
		}
	};

	const handleCancel = async () => {
		try {
			if (isRequesting) return;
			setIsRequesting(true);
			const response = await api.patch("/access/request/cancel", {
				id: request.id,
			});
			if (response.data.status === "Success") {
				// Notify the parent component to remove this card
				if (onRemove) onRemove(request.id);
			} else {
				setError("Failed to cancel the request. Please try again.");
			}
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

	return (
		<ThemedView style={styles.card}>
			<ThemedView style={styles.header}>
				<ThemedView style={styles.headerLeft}>
					<ThemedText style={styles.email}>{request.user.email}</ThemedText>
					<ThemedText style={styles.userId}>ID: {request.userId}</ThemedText>
				</ThemedView>
				<ThemedView
					style={[
						styles.statusBadge,
						{ backgroundColor: getStatusColor(request.status) },
					]}
				>
					<ThemedText style={styles.statusText}>{request.status}</ThemedText>
				</ThemedView>
			</ThemedView>

			<ThemedView style={styles.content}>
				<ThemedView style={styles.infoRow}>
					<ThemedText style={styles.label}>Current Level:</ThemedText>
					<ThemedText style={styles.value}>
						{request.user.accessLevel}
					</ThemedText>
				</ThemedView>

				<ThemedView style={styles.infoRow}>
					<ThemedText style={styles.label}>Requested Level:</ThemedText>
					<ThemedText style={styles.value}>{request.requestedLevel}</ThemedText>
				</ThemedView>

				<ThemedView style={styles.infoRow}>
					<ThemedText style={styles.label}>User Role:</ThemedText>
					<ThemedText style={styles.value}>{request.user.role}</ThemedText>
				</ThemedView>

				<ThemedView style={styles.infoRow}>
					<ThemedText style={styles.label}>Created:</ThemedText>
					<ThemedText style={styles.value}>
						{formatDate(request.createdAt)}
					</ThemedText>
				</ThemedView>

				<ThemedView style={styles.infoRow}>
					<ThemedText style={styles.label}>Updated:</ThemedText>
					<ThemedText style={styles.value}>
						{formatDate(request.updatedAt)}
					</ThemedText>
				</ThemedView>

				{request.status === "PENDING" ? (
					<TouchableOpacity
						style={[styles.button, isRequesting && styles.buttonDisabled]}
						onPress={handleCancel}
					>
						<ThemedText style={styles.buttonText}>
							{isRequesting ? "Requesting..." : `Cancel`}
						</ThemedText>
					</TouchableOpacity>
				) : null}
				{error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
			</ThemedView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		padding: 16,
		marginVertical: 8,
		marginHorizontal: 16,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	headerLeft: {
		flex: 1,
	},
	email: {
		fontSize: 16,
		fontWeight: "600",
	},
	userId: {
		fontSize: 12,
		marginTop: 4,
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		marginLeft: 8,
	},
	statusText: {
		color: "white",
		fontSize: 12,
		fontWeight: "600",
	},
	content: {
		gap: 8,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: {
		fontSize: 14,
		opacity: 0.7,
	},
	value: {
		fontSize: 14,
		fontWeight: "500",
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
	error: {
		color: "#ff6b6b",
		marginVertical: 8,
		textAlign: "center",
	},
});

export default AccessRequestCard;
