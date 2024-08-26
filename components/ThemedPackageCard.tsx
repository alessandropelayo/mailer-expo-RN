import {
	ViewProps,
	StyleSheet,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
	View,
	ActivityIndicator,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/context/theme";
import { memo, useEffect, useState } from "react";
import { Package } from "@/types/interfaces/interfaces";
import { ThemedPackageExpand } from "./ThemedPackageExpand";
import ZoomableImage from "./ZoomableImage";
import { ThemedIcons } from "./ThemedIcons";
import i18n from "@/hooks/localization";
import { Image } from "expo-image";
import { getValueFor } from "@/hooks/accessStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ThemedCardProps = ViewProps & {
	packageData: Package;
	API_KEY: string;
};

const ThemedPackageCard = ({
	style,
	packageData,
	API_KEY,
	...otherProps
}: ThemedCardProps) => {
	const [isVisible, setIsVisible] = useState(true);

	const statusTimeFormat = new Date(
		packageData?.statusHistory?.[0]?.statusTime || ""
	);
	const deliveryDateFormat = new Date(
		packageData?.statusHistory?.[0]?.deliveryDate || ""
	);

	const styles = StyleSheet.create({
		USPSCard: {
			backgroundColor: "#004B87",
		},
		USPS_DailyCard: {
			backgroundColor: "#004B87",
		},
		UPSCard: {
			backgroundColor: "white",
		},
		FedExCard: {
			backgroundColor: "#4D148C",
		},
		default: {
			backgroundColor: useTheme().currentTheme.foreground,
		},
	});

	let contentCarrier;
	let carrierImage;
	switch (packageData.carrier) {
		case "USPS":
			contentCarrier = styles.USPSCard;
			carrierImage = require("@/assets/images/USPS.jpg");
			break;
		case "USPS_Daily":
			contentCarrier = styles.USPS_DailyCard;
			carrierImage = require("@/assets/images/USPS_Daily.jpg");
			break;
		case "UPS":
			contentCarrier = styles.UPSCard;
			carrierImage = require("@/assets/images/UPS.jpg");
			break;
		default:
			contentCarrier = styles.default;
	}

	//Handle bug when rapidly double pressing in the modal
	const [isPackagePressEnabled, setIsPackagePressEnabled] = useState(true);

	const handlePackagePress = () => {
		if (isPackagePressEnabled) {
			setIsVisible((prevState) => !prevState);
		}
	};
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => {
		setIsPackagePressEnabled(false);
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
		setIsPackagePressEnabled(true);
	};

	return (
		<ThemedView
			style={[
				{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				},
				style,
			]}
			{...otherProps}
		>
			<ThemedView
				style={[
					contentCarrier,
					{
						flexDirection: "row",
						flexWrap: "wrap",
					},
				]}
			>
				<ThemedView
					style={[
						{
							flexDirection: "column",
							flexWrap: "wrap",
						},
					]}
				>
					<Image
						source={carrierImage}
						contentFit="contain"
						style={{ width: 50, height: 50 }}
					></Image>
				</ThemedView>
			</ThemedView>

			<TouchableOpacity
				onPress={handlePackagePress}
				style={{
					backgroundColor: "transparent",
					flex: 1,
				}}
			>
				{isVisible ? (
					<ThemedView
						style={{
							backgroundColor: useTheme().currentTheme.foreground,
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							flexDirection: "column",
							flexWrap: "wrap",
							justifyContent: "flex-start",
						}}
					>
						{packageData?.from && (
							<ThemedText
								style={{ paddingLeft: "5%", flexWrap: "wrap" }}
								type="defaultSemiBold"
							>
								{i18n.t("from")}
								{": "}
								{packageData.from}
							</ThemedText>
						)}
						{packageData.statusHistory?.[0]?.status && (
							<ThemedText style={{ paddingLeft: "5%" }} type="defaultSemiBold">
								{i18n.t("status")}
								{": "}
								{i18n.t(packageData.statusHistory[0].status)}
							</ThemedText>
						)}

						{packageData.statusHistory?.[0]?.statusTime && (
							<ThemedText style={{ paddingLeft: "5%" }} type="default">
								{i18n.t("last updated")}
								{": "}
								{statusTimeFormat.toLocaleString(i18n.locale, {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})}
							</ThemedText>
						)}
						{packageData.statusHistory?.[0]?.deliveryDate && (
							<ThemedText style={{ paddingLeft: "5%" }}>
								{i18n.t("delivery date")}
								{": "}
								{deliveryDateFormat.toLocaleString(i18n.locale, {
									weekday: "short",
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})}
							</ThemedText>
						)}
						<TouchableOpacity onPress={openModal} style={{ paddingLeft: "5%" }}>
							{packageData.deliveryPhoto?.[0]?.fileLocation && (
								<Image
									contentFit="contain"
									style={{ width: 300, height: 150, alignSelf: "center" }}
									source={{
										uri: `${
											API_URL +
											"/packages/file/get?fileLocation=" +
											packageData.deliveryPhoto[0].fileLocation
										}`,
										headers: {
											API_KEY: "" + API_KEY,
										},
									}}
								></Image>
							)}
						</TouchableOpacity>
						{packageData.deliveryPhoto?.[0]?.fileLocation && (
							<Modal
								transparent={false}
								visible={isModalVisible}
								onRequestClose={closeModal}
							>
								<View
									style={{
										width: "100%",
										height: "100%",
									}}
								>
									<TouchableHighlight
										onPress={closeModal}
										style={{
											backgroundColor: useTheme().currentTheme.foreground,
											zIndex: 1,
										}}
									>
										<ThemedIcons
											iconName={"arrow-back"}
											size={"10%"}
										></ThemedIcons>
									</TouchableHighlight>

									<ZoomableImage
										source={{
											uri: `${
												API_URL +
												"/packages/file/get?fileLocation=" +
												packageData.deliveryPhoto[0].fileLocation
											}`,
											headers: {
												API_KEY: "" + API_KEY,
											},
										}}
										contentFit="contain"
										style={{
											backgroundColor: useTheme().currentTheme.foreground,
										}}
									></ZoomableImage>
								</View>
							</Modal>
						)}
					</ThemedView>
				) : (
					ThemedPackageExpand({ packageData })
				)}
			</TouchableOpacity>
		</ThemedView>
	);
};

export default memo(ThemedPackageCard);
