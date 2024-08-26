import * as SecureStore from "expo-secure-store";

// Set the key-value pairs for the different languages you want to support.

async function saveValue(key: string, value: string) {
	try {
		await SecureStore.setItemAsync(key, value);
	} catch (error) {
		console.log(error);
	}
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

export { saveValue, getValueFor };
