import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
	en: require("@/locales/en.json"),
	es: require("@/locales/es.json"),
});

i18n.locale = "en";
export default i18n;
