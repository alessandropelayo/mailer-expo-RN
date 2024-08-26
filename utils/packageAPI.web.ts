import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
		let result = localStorage.getItem(key);

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
	return new Promise((resolve, reject) => {
		getValueFor("API_KEY").then((data) => {
			let API_KEY = data;

			axios({
				method: "get",
				url: API_URL + "/packages/home",
				params: {
					count: count,
					limit: limit,
					after: after,
				},
				headers: {
					API_KEY: API_KEY,
				},
			})
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => {
					console.log(err);

					reject(err);
				});
		});
	});
};

const loadImage = async (imgLocation: string) => {
	return new Promise((resolve, reject) => {
		getValueFor("API_KEY").then((data) => {
			let API_KEY = data;
			axios({
				method: "get",
				url: API_URL + "/packages/file/get",
				params: {
					fileLocation: imgLocation,
				},
				headers: {
					API_KEY: API_KEY,
				},
			})
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => {
					console.log(err);

					reject(err);
				});
		});
	});
};

export { getRecentPackagesHomePage, loadImage };
