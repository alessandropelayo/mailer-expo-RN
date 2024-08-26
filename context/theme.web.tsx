import React, { createContext, useEffect, useState } from "react";
import { ImageStyle, TextStyle, ViewStyle, useColorScheme } from "react-native";

export type Theme = { [key: string]: ViewStyle | TextStyle | ImageStyle };

const ThemeContext = createContext<any>({
	theme: "",
	toggleTheme: () => {},
});

const tintColorLight = "#151718";
const tintColorDark = "#fff";

const lightTheme = {
	text: "#11181C",
	background: "#dbdbdb",
	tint: tintColorLight,
	icon: "#2b2e30",
	tabIconDefault: "#687076",
	tabIconSelected: tintColorLight,
	foreground: "#e9e9e9",
};

const darkTheme = {
	text: "#ECEDEE",
	background: "#151718",
	tint: tintColorDark,
	icon: "#d5dce2",
	tabIconDefault: "#9BA1A6",
	tabIconSelected: tintColorDark,
	foreground: "#1d1f21",
};

async function save(key: string, value: string) {
	try {
		//await SecureStore.setItemAsync(key, value);
		localStorage.setItem(key, value);
	} catch (error) {
		console.log(error);
	}
}

async function getValueFor(key: string, userPreferedTheme: string) {
	try {
		//let result = await SecureStore.getItemAsync(key);
		let result = localStorage.getItem(key);
		//console.log("RUNNING THEME:", result);

		if (result) {
			return result;
		} else {
		}
	} catch (error) {
		console.log(error);
	}
}
export default function ThemeContent({ children }: { children: any }) {
	//const colorScheme = useColorScheme();
	const [theme, setTheme] = useState<"light" | "dark">(
		useColorScheme() ?? "light"
	);
	const getTheme = async () =>
		getValueFor("theme", theme).then((value) =>
			setTheme((value as "light") || "dark")
		);
	//getTheme();

	useEffect(() => {
		getTheme();
	});

	const toggleTheme = async () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		save("theme", newTheme);
	};

	const checkTheme = theme;

	const currentTheme = theme === "dark" ? darkTheme : lightTheme;

	return (
		<ThemeContext.Provider value={{ currentTheme, toggleTheme, checkTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => React.useContext(ThemeContext);
