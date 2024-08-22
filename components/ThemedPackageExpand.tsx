import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Image,
	type ViewProps,
	TouchableOpacity,
	View,
} from "react-native";

import { ThemedView } from "./ThemedView";
import {
	JSXElementConstructor,
	ReactElement,
	ReactNode,
	ReactPortal,
	useEffect,
	useState,
} from "react";
import { useTheme } from "@/context/theme";
import { getRecentPackagesHomePage } from "@/utils/packageAPI";
import { ThemedText } from "./ThemedText";
import ThemedPackageCard from "./ThemedPackageCard";
import { Package } from "@/types/interfaces/interfaces";
import { ShippingCarrier } from "@/types/enums/enums";

export type RecentPackagesProps = ViewProps & {
	packageData: Package;
};

export function ThemedPackageExpand({
	packageData,
	style,
	...otherProps
}: RecentPackagesProps) {
	const statusTimeFormat = new Date(
		packageData?.statusHistory?.[0]?.statusTime || ""
	);
	const deliveryDateFormat = new Date(
		packageData?.statusHistory?.[0]?.deliveryDate || ""
	);
	return (
		<ThemedView
			style={{
				flex: 1,
				backgroundColor: useTheme().currentTheme.foreground,
			}}
		>
			<ThemedView
				style={{
					backgroundColor: "transparent",
					flex: 1,
					paddingLeft: "5%",
				}}
			>
				{packageData?.carrier !== "USPS_Daily" && (
					<ThemedText type="defaultSemiBold">
						{packageData.trackingId}
					</ThemedText>
				)}
				{packageData.statusHistory?.[0]?.status && (
					<ThemedText type="default">
						Status: {packageData.statusHistory[0].status}
					</ThemedText>
				)}
				{packageData?.from && (
					<ThemedText type="default">From: {packageData.from}</ThemedText>
				)}
				{packageData.statusHistory?.[0]?.statusTime && (
					<ThemedText type="default">
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
					<ThemedText type="default">
						Delivery Date: {deliveryDateFormat.toDateString()}
					</ThemedText>
				)}
			</ThemedView>
			<ThemedView
				style={{
					flex: 1,
					backgroundColor: "transparent",
				}}
			>
				<FlatList
					data={packageData.statusHistory}
					keyExtractor={(item) => item.statusTime}
					renderItem={({ item, index }) => (
						<View
							style={{
								paddingLeft: "10%",
							}}
						>
							<ThemedText type="default">Status: {item.status}</ThemedText>
							<ThemedText type="default">
								Status Time: {new Date(item.statusTime).toLocaleString()}
							</ThemedText>
							<ThemedText type="default">
								Delivery Date: {new Date(item.deliveryDate).toLocaleString()}
							</ThemedText>
						</View>
					)}
					ItemSeparatorComponent={() => (
						<ThemedView style={{ height: 5 }}></ThemedView>
					)}
					ListHeaderComponent={() => (
						<ThemedView style={{ height: 5 }}></ThemedView>
					)}
				/>
			</ThemedView>
		</ThemedView>
	);
}
