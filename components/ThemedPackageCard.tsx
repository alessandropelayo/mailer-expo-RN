import {
	ViewProps,
	StyleSheet,
	Image,
	Animated,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/context/theme";
import { getTimeSince } from "@/utils/timeSince";
import { memo, useRef, useState } from "react";
import { Package } from "@/types/interfaces/interfaces";
import { Link } from "expo-router";
import { ThemedPackageExpand } from "./ThemedPackageExpand";
import ZoomableImage from "./ZoomableImage";
import { ThemedIcons } from "./ThemedIcons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ThemedCardProps = ViewProps & {
	packageData: Package;
};

const ThemedPackageCard = ({
	style,
	packageData,
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

	const handlePackagePress = () => {
		setIsVisible((prevState) => !prevState);
	};
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => {
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
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
						resizeMode="contain"
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
						{packageData.statusHistory?.[0]?.status && (
							<ThemedText style={{ paddingLeft: "5%" }} type="defaultSemiBold">
								Status: {packageData.statusHistory[0].status}
							</ThemedText>
						)}

						{packageData.statusHistory?.[0]?.statusTime && (
							<ThemedText style={{ paddingLeft: "5%" }} type="default">
								Last Updated:{" "}
								{statusTimeFormat.toLocaleString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "numeric",
									minute: "2-digit",
								})}
							</ThemedText>
						)}
						{packageData.statusHistory?.[0]?.deliveryDate && (
							<ThemedText style={{ paddingLeft: "5%" }}>
								Delivery Date: {deliveryDateFormat.toDateString()}
							</ThemedText>
						)}
						<TouchableOpacity onPress={openModal} style={{ paddingLeft: "5%" }}>
							{packageData.deliveryPhoto?.[0]?.fileLocation && (
								<Image
									resizeMode="contain"
									style={{ width: 300, height: 150, alignSelf: "center" }}
									source={{
										uri: `${
											API_URL +
											"/packages/file/get?fileLocation=" +
											packageData.deliveryPhoto[0].fileLocation
										}`,
									}}
								></Image>
							)}
						</TouchableOpacity>
						{packageData.deliveryPhoto?.[0]?.fileLocation && (
							<Modal
								transparent={true}
								visible={isModalVisible}
								onRequestClose={closeModal}
							>
								<TouchableHighlight
									onPress={closeModal}
									style={{
										backgroundColor: useTheme().currentTheme.foreground,
									}}
								>
									<ThemedIcons
										iconName={"arrow-back"}
										size={"10%"}
									></ThemedIcons>
								</TouchableHighlight>

								<ZoomableImage
									uri={`${
										API_URL +
										"/packages/file/get?fileLocation=" +
										packageData.deliveryPhoto[0].fileLocation
									}`}
									style={{
										backgroundColor: useTheme().currentTheme.foreground,
									}}
								></ZoomableImage>
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
{
	/* {(!(packageData.carrier === "USPS_Daily") && (
						<ThemedText
							style={{
								color: "#ECEDEE",
							}}
							type="subtitle"
						>
							{packageData.trackingId}
						</ThemedText>
					)) || (
						<ThemedText
							style={{
								color: "#ECEDEE",
							}}
							type="subtitle"
						>
							{statusTimeFormat.toLocaleDateString()}
						</ThemedText>
					)} */
}
{
	/* <ThemedText
						style={{
							color: "#ECEDEE",
						}}
						type="subtitle"
					>
						{statusTimeFormat.toLocaleDateString()}
					</ThemedText>
					<ThemedText
						style={{
							color: "#ECEDEE",
						}}
						type="subtitle"
					>
						{getTimeSince(statusTimeFormat.getTime())}
					</ThemedText> */
}

export default memo(ThemedPackageCard);
