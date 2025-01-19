import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import api from "@/utils/axios";
import { AccessRequest } from "@/types/interfaces/interfaces";
import axios from "axios";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import AccessRequestCard from "./ThemedRequestCard";

export interface AccessRequestsListRef {
	refreshRequests: () => void;
}

export const AccessRequestsList = forwardRef<AccessRequestsListRef>(
	(_, ref) => {
		const [requests, setRequests] = useState<AccessRequest[]>([]);
		const [isLoading, setIsLoading] = useState(true);
		const [error, setError] = useState("");

		const fetchRequests = async () => {
			setIsLoading(true);
			setError("");
			try {
				const response = await api.get<AccessRequest[]>("/access/my-requests");
				setRequests(response.data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.response?.data?.message || "Failed to load requests");
				} else {
					setError("An unexpected error occurred");
					console.error(err);
				}
			} finally {
				setIsLoading(false);
			}
		};

		useEffect(() => {
			fetchRequests();
		}, []);

		// Expose the fetchRequests function to the parent via ref
		useImperativeHandle(ref, () => ({
			refreshRequests: fetchRequests,
		}));

		if (isLoading) {
			return (
				<ThemedView style={styles.centerContainer}>
					<ActivityIndicator size="large" />
				</ThemedView>
			);
		}

		if (error) {
			return (
				<ThemedView style={styles.centerContainer}>
					<ThemedText style={styles.errorText}>{error}</ThemedText>
				</ThemedView>
			);
		}

		if (requests.length === 0) {
			return (
				<ThemedView style={styles.centerContainer}>
					<ThemedText style={styles.noDataText}>
						No access requests found
					</ThemedText>
				</ThemedView>
			);
		}

		const handleRemoveRequest = (id: string) => {
			setRequests((prevRequests) =>
				prevRequests.filter((req) => req.id !== id)
			);
		};

		return (
			<FlatList
				data={requests}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<AccessRequestCard request={item} onRemove={handleRemoveRequest} />
				)}
				contentContainerStyle={styles.listContainer}
				refreshing={isLoading}
				onRefresh={fetchRequests}
			/>
		);
	}
);

const styles = StyleSheet.create({
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	listContainer: {
		paddingVertical: 8,
	},
	errorText: {
		fontSize: 16,
		textAlign: "center",
		opacity: 0.7,
	},
	noDataText: {
		fontSize: 16,
		textAlign: "center",
		opacity: 0.7,
	},
});
