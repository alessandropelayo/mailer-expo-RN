import { I18n } from "i18n-js";
import { getValueFor } from "./accessStorage";

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
	en: require("@/locales/en.json"),
	es: require("@/locales/es.json"),
});
const valueLocale = async () => {
	const val = (await getValueFor("locale")) || "en";
	i18n.locale = val;
};
valueLocale();

export default i18n;
