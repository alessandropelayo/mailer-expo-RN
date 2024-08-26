import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/context/theme";
import {
	Alert,
	Button,
	FlatList,
	Keyboard,
	Switch,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "@/hooks/localization";
import { useState } from "react";
import { ThemedIcons } from "@/components/ThemedIcons";

export default function SettingsScreen() {
	const insets = useSafeAreaInsets();

	const toggleTheme = useTheme().toggleTheme;

	const locales = Object.keys(i18n.translations);

	const handleLocaleChange = (locale: string) => {
		i18n.locale = locale;
		save("locale", locale);
		setShowLanguages(false);
		createAlert();
	};

	const createAlert = () => {
		Alert.alert(
			i18n.t("change language alert"),
			i18n.t("change language alert message"),
			[{ text: "OK" }]
		);
	};

	async function save(key: string, value: string) {
		try {
            localStorage.setItem(key, value)
		} catch (error) {
			console.log(error);
		}
	}

	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => {
		setIsEnabled((previousState) => !previousState);
		toggleTheme();
	};

	const [showLanguages, setShowLanguages] = useState(false);
	const selectLanguage = () => {
		setShowLanguages((previousState) => !previousState);
	};

	const getLanguageName = (langShort: string) => {
		switch (langShort) {
			case "en":
				return "English";
			case "es":
				return "Español";
		}
	};

	const [text, onChangeText] = useState("");
	const [isCheckMark, setIsCheckMark] = useState(false);
	const selectTextBox = () => {
		setIsCheckMark((previousState) => !previousState);
	};
	const enterApiKey = () => {
		save("API_KEY", text);
	};

	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: "flex-start",
				alignItems: "center",
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
			}}
		>
			<ThemedText type="title" style={{ paddingVertical: "5%" }}>
				{i18n.t("settings")}
			</ThemedText>

			<TouchableOpacity onPress={toggleSwitch}>
				<ThemedView
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					{useTheme().checkTheme === "dark" && (
						<ThemedIcons
							iconName={"dark-mode"}
							size={40}
							style={{ paddingRight: "5%" }}
						></ThemedIcons>
					)}
					{useTheme().checkTheme !== "dark" && (
						<ThemedIcons
							iconName={"light-mode"}
							size={40}
							style={{ paddingRight: "5%" }}
						></ThemedIcons>
					)}
					<Switch
						trackColor={{
							false: useTheme().currentTheme.icon,
							true: useTheme().currentTheme.icon,
						}}
						thumbColor={
							isEnabled
								? useTheme().currentTheme.icon
								: useTheme().currentTheme.icon
						}
						style={{
							height: 40,
							width: 40,
						}}
                        onTouchEnd={toggleSwitch}
						value={isEnabled}
					></Switch>
				</ThemedView>
			</TouchableOpacity>

			<ThemedView
				style={{
					paddingVertical: "5%",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<ThemedText type="subtitle" style={{ paddingRight: "2%" }}>
					{i18n.t("API KEY")}
				</ThemedText>
				<TextInput
					style={{
						height: 40,
						width: 110,
						borderTopWidth: 2,
						borderColor: useTheme().currentTheme.tint,
						borderBottomWidth: 2,
						color: useTheme().currentTheme.text,
					}}
					onChangeText={onChangeText}
					value={text}
					onFocus={selectTextBox}
				></TextInput>
				{isCheckMark && (
					<TouchableOpacity onPress={enterApiKey}>
						<ThemedIcons
							style={{ paddingLeft: "5%" }}
							iconName={"check"}
							size={40}
						></ThemedIcons>
					</TouchableOpacity>
				)}
			</ThemedView>

			<TouchableOpacity onPress={selectLanguage}>
				<ThemedView
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<ThemedIcons iconName={"language"} size={40}></ThemedIcons>
					{!showLanguages && (
						<ThemedIcons iconName={"arrow-drop-down"} size={40}></ThemedIcons>
					)}
					{showLanguages && (
						<ThemedIcons iconName={"arrow-drop-up"} size={40}></ThemedIcons>
					)}
				</ThemedView>
			</TouchableOpacity>

			{showLanguages && (
				<FlatList
					data={locales}
					renderItem={({ item }) => (
						<TouchableOpacity onPress={() => handleLocaleChange(item)}>
							<ThemedView
								style={{
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<ThemedText type="defaultSemiBold">
									{getLanguageName(item)}
								</ThemedText>
							</ThemedView>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item}
					ItemSeparatorComponent={() => (
						<ThemedView style={{ height: 5 }}></ThemedView>
					)}
				></FlatList>
			)}
		</ThemedView>
	);
}
