import React, { createContext, useState } from "react";
import { Button, ImageStyle, TextStyle, ViewStyle, useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";

export type Theme = { [key: string]: ViewStyle | TextStyle | ImageStyle };

const ThemeContext = createContext<any>({
    theme: '',
    toggleTheme: () => {}
});

const tintColorLight = '#151718';
const tintColorDark = '#fff';

const lightTheme = {
	text: '#11181C',
    background: '#dbdbdb',
    tint: tintColorLight,
    icon: '#2b2e30',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    foreground: '#e9e9e9',
};

const darkTheme = {
	text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#d5dce2',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    foreground: '#1d1f21',
};

async function save(key: string, value: string) {
	try {
		await SecureStore.setItemAsync(key, value);
	} catch (error) {
		console.log(error);
	}
}

async function getValueFor(key: string, userPreferedTheme: string) {
	try {
		let result = await SecureStore.getItemAsync(key);
		if (result) {
			return result;
		} else {
		}
	} catch (error) {
		console.log(error);
	}
}
export default function ThemeContent({ children }: { children: any  }) {
	//const colorScheme = useColorScheme();
    const [theme, setTheme] = useState<"light" | "dark">(
		useColorScheme() ?? "light"
	);
    const getTheme = async () => getValueFor("theme", theme).then((value) =>
        setTheme((value as "light") || "dark")
    );
    getTheme();

    const toggleTheme = async () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
        save("theme", newTheme);
    };

    const currentTheme = theme === "dark" ? darkTheme : lightTheme

	return (
		<ThemeContext.Provider
			value={{ currentTheme , toggleTheme}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => React.useContext(ThemeContext);
