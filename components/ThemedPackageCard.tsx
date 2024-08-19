import { ViewProps, StyleSheet, Image, Animated } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/context/theme";
import { getTimeSince } from "@/utils/timeSince";
import { memo, useRef } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ThemedCardProps = ViewProps & {
	packageData: {
		trackingId: string;
		carrier: string;
		statusHistory?: {
			trackingId: string;
			statusTime: string;
			deliveryDate: string;
			status: string;
		}[];
		deliveryPhoto?: { fileLocation: string }[];
	};
};

const ThemedPackageCard = ({
	style,
	packageData,
	...otherProps
}: ThemedCardProps) => {
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
			backgroundColor: "#351C15",
		},
		FedExCard: {
			backgroundColor: "#4D148C",
		},
		default: {
			backgroundColor: useTheme().currentTheme.foreground,
		},
	});

	let contentCarrier;
	switch (packageData.carrier) {
		case "USPS":
			contentCarrier = styles.USPSCard;
			break;
		case "USPS_Daily":
			contentCarrier = styles.USPS_DailyCard;
			break;
		default:
			contentCarrier = styles.default;
	}

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
						borderTopLeftRadius: 0,
						borderTopRightRadius: 0,
						paddingTop: 0,
						paddingHorizontal: 0,
						flexDirection: "row",
						flexWrap: "wrap",
						alignContent: "flex-start",
					},
				]}
			>
				<ThemedView
					style={[
						{
							flexDirection: "column",
							flexWrap: "wrap",
							alignContent: "space-evenly",
							backgroundColor: "transparent",
							paddingHorizontal: 0,
						},
					]}
				>
					<Image
						source={require("@/assets/images/usps.jpg")}
						resizeMode="contain"
						style={{ width: 50, height: 50 }}
					></Image>
				</ThemedView>
			</ThemedView>
			<ThemedView
				style={{
					backgroundColor: useTheme().currentTheme.foreground,
					borderBottomLeftRadius: 0,
					borderBottomRightRadius: 0,
					flexDirection: "column",
					flexWrap: "wrap",
					justifyContent: "flex-start",
					flex: 1,
				}}
			>
				{packageData.statusHistory?.[0]?.status && (
					<ThemedText style={{ paddingLeft: "5%" }} type="defaultSemiBold">
						Status: {packageData.statusHistory[0].status}
					</ThemedText>
				)}

				{packageData.statusHistory?.[0]?.statusTime && (
					<ThemedText style={{ paddingLeft: "5%" }} type="default">
						Last Updated: {statusTimeFormat.toDateString()}{" "}
						{statusTimeFormat.toLocaleTimeString()}
					</ThemedText>
				)}
				{packageData.statusHistory?.[0]?.deliveryDate && (
					<ThemedText style={{ paddingLeft: "5%" }}>
						Delivery Date: {deliveryDateFormat.toDateString()}
					</ThemedText>
				)}
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
			</ThemedView>
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
