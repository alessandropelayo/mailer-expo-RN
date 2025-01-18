import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import * as SecureStore from "expo-secure-store";
import { api } from "@/utils/axios";

interface Package {
	trackingId: string;
	carrier: string;
	statusHistory: {
		trackingId: string;
		statusTime: string;
		deliveryDate: string;
		status: string;
	}[];
	deliveryPhoto: {
		fileLocation: string;
	}[];
}

async function getValueFor(key: string) {
	try {
		let result = await SecureStore.getItemAsync(key);
		if (result) {
			return result;
		} else {
			return "";
		}
	} catch (error) {
		console.log(error);
		return "";
	}
}

const getRecentPackagesHomePage = async (
	count?: number,
	limit?: number,
	after?: string
): Promise<Package[]> => {
	try {
		const response = await api.get("/packages/home", {
			params: {
				count,
				limit,
				after,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const loadImage = async (imgLocation: string): Promise<any> => {
	try {
		const response = await api.get("/packages/file/get", {
			params: { fileLocation: imgLocation },
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const loadHeaders = async () => {
	try {
		const [accessToken, refreshToken] = await Promise.all([
			SecureStore.getItemAsync("accessToken"),
			SecureStore.getItemAsync("refreshToken"),
		]);

		const newHeaders: { [key: string]: string } = {};
		if (accessToken) {
			newHeaders["Authorization"] = `Bearer ${accessToken}`;
		}
		if (refreshToken) {
			newHeaders["Cookie"] = `refreshToken=${refreshToken}`;
		}

		return newHeaders;
	} catch (error) {
		console.error("Error loading auth headers:", error);
	}
};

export { getRecentPackagesHomePage, loadImage, loadHeaders };
