import { FlatList, type ViewProps, View } from "react-native";

import { ThemedView } from "./ThemedView";

import { useTheme } from "@/context/theme";

import { ThemedText } from "./ThemedText";

import { Package } from "@/types/interfaces/interfaces";

import i18n from "@/hooks/localization";

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
						{i18n.t("status")}
						{": "}
						{i18n.t(packageData.statusHistory[0].status)}
					</ThemedText>
				)}
				{packageData?.from && (
					<ThemedText type="default">
						{i18n.t("from")}
						{": "}
						{packageData.from}
					</ThemedText>
				)}
				{packageData.statusHistory?.[0]?.statusTime && (
					<ThemedText type="default">
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
					<ThemedText type="default">
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
								paddingLeft: "5%",
								paddingBottom: 5,
							}}
						>
							<View
								style={{
									flexDirection: "row",
								}}
							>
								<ThemedText style={{}} type="default">
									{"" + (index + 1)}
								</ThemedText>
								<View style={{ paddingLeft: "5%" }}>
									<ThemedText style={{}} type="default">
										{i18n.t("status")}
										{": "}
										{i18n.t(item.status)}
									</ThemedText>
									<ThemedText style={{}} type="default">
										{i18n.t("status time")}
										{": "}
										{new Date(item.statusTime).toLocaleString(i18n.locale, {
											month: "numeric",
											day: "numeric",
											year: "numeric",
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										})}
									</ThemedText>
									<ThemedText style={{}} type="default">
										{i18n.t("delivery date")}
										{": "}
										{new Date(item.deliveryDate).toLocaleString(i18n.locale, {
											month: "numeric",
											day: "numeric",
											year: "numeric",
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										})}
									</ThemedText>
								</View>
							</View>
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
