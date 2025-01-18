import { AuthResponse, User } from "@/types/auth";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export const storeAuthData = async (authResponse: AuthResponse) => {
	try {
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, authResponse.accessToken);
		if (authResponse.user) {
			await SecureStore.setItemAsync(
				USER_KEY,
				JSON.stringify(authResponse.user)
			);
		}
		return true;
	} catch (error) {
		console.error("Error storing auth data:", error);
		return false;
	}
};

export const getAccessToken = async () => {
	try {
		return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
	} catch (error) {
		console.error("Error getting access token:", error);
		return null;
	}
};

export const getUser = async () => {
	try {
		const userStr = await SecureStore.getItemAsync(USER_KEY);
		return userStr ? (JSON.parse(userStr) as User) : null;
	} catch (error) {
		console.error("Error getting user:", error);
		return null;
	}
};

export const clearAuthData = async () => {
	try {
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
		await SecureStore.deleteItemAsync(USER_KEY);
		return true;
	} catch (error) {
		console.error("Error clearing auth data:", error);
		return false;
	}
};
