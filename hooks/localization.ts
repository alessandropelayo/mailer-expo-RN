import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
	en: require("@/locales/en.json"),
	es: require("@/locales/es.json"),
});

const valueLocale = async () => {
	const val = (await SecureStore.getItemAsync("locale")) || "en";
	i18n.locale = val;
};

valueLocale();

export default i18n;
