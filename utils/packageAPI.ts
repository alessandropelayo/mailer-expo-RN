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

const getRecentPackagesHomePage = async (
	count?: number,
	limit?: number,
	after?: string
): Promise<Package[]> => {
	return new Promise((resolve, reject) => {
		axios({
			method: "get",
			url: API_URL + "/packages/home",
			params: {
				count: count,
				limit: limit,
				after: after,
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
};

const loadImage = async (imgLocation: string) => {
	return new Promise((resolve, reject) => {
		axios({
			method: "get",
			url: API_URL + "/packages/file/get",
			params: {
				fileLocation: imgLocation,
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
};

export { getRecentPackagesHomePage, loadImage };
