import {
	ActivityIndicator,
	FlatList,
	Modal,
	RefreshControl,
	View,
	type ViewProps,
} from "react-native";

import { ThemedView } from "./ThemedView";
import { useEffect, useState } from "react";
import { getRecentPackagesHomePage } from "@/utils/packageAPI";
import { ThemedText } from "./ThemedText";
import ThemedPackageCard from "./ThemedPackageCard";
import { Package } from "@/types/interfaces/interfaces";
import { ShippingCarrier } from "@/types/enums/enums";
import i18n from "@/hooks/localization";
import { getValueFor } from "@/hooks/accessStorage";
import ZoomableImage from "./ZoomableImage";

export type RecentPackagesProps = ViewProps & {};

export function RecentPackages({ style, ...otherProps }: RecentPackagesProps) {
	const [packages, setPackages] = useState<Package[]>([]); // Array to store fetched packages
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [after, setAfter] = useState(String);
	const [count, setCount] = useState(0);
	const [limit, setLimit] = useState(10);
	const [API_KEY, setAPI_KEY] = useState("");

	const fetchData = () => {
		if (hasMore) {
			getPackageList(count, limit, after);
		}
	};

	const getPackageList = (c: number, l: number, afterCompound: string) => {
		Promise.resolve(getRecentPackagesHomePage(c, l, afterCompound))
			.then((response) => {
				if (!response) {
					setIsLoading(true);
				}

				if (response.length < limit) {
					setHasMore(false);
				}
				if (response.length === 0) {
					return;
				}

				setPackages((prevPackages) => [...prevPackages, ...response]);

				const lastItem = response[response.length - 1];
				const parsedData = JSON.stringify({
					trackingId: lastItem.trackingId,
					carrier: lastItem.carrier,
				});

				setAfter(parsedData);
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(true);
				console.error("Error: ", error);
			});
	};

	const fetchNextPage = () => {
		if (after == null) {
			// End of data.
			return;
		}
		fetchData();
	};

	const refreshPage = () => {
		setAfter((prevText) => "");
		setPackages((prevPackages) => []);
		setHasMore(true);
		setIsLoading(true);
		getPackageList(count, limit, "");
	};

	const renderFooter = () => {
		if (hasMore) return <ActivityIndicator size={"large"} color={"white"} />;
		return (
			<ThemedView>
				<ThemedText>End</ThemedText>
			</ThemedView>
		);
	};

	const getAPI_KEY = async () => {
		const data = (await getValueFor("API_KEY")) || "";
		setAPI_KEY((prevState) => data);
	};

	useEffect(() => {
		fetchData();
		getAPI_KEY();
	}, []);

	if (isLoading) {
		return (
			<ThemedView
				style={{
					alignContent: "center",
					paddingTop: 10,
					height: "100%",
					width: "100%",
				}}
			>
				<ActivityIndicator
					style={{ justifyContent: "center" }}
					size={"large"}
					color={"white"}
				/>
			</ThemedView>
		);
	}

	return (
		<FlatList
			data={packages}
			renderItem={({ item, index }) => (
				<ThemedView>
					{(new Date(item?.statusHistory?.[0]?.statusTime).getDate() <
						new Date(
							packages[index - 1]?.statusHistory?.[0]?.statusTime
						).getDate() ||
						index === 0) && (
						<ThemedText
							type={"title"}
							style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 5 }}
						>
							{new Date(
								item?.statusHistory?.[0]?.statusTime
							).toLocaleDateString(i18n.locale, {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</ThemedText>
					)}
					<ThemedPackageCard
						key={item.trackingId + item.carrier}
						packageData={item}
						style={{
							justifyContent: "flex-start",
						}}
						API_KEY={API_KEY}
					/>
				</ThemedView>
			)}
			ItemSeparatorComponent={() => (
				<ThemedView style={{ height: 5 }}></ThemedView>
			)}
			keyExtractor={(item, index) => item.trackingId + index.toString()}
			refreshControl={
				<RefreshControl refreshing={isLoading} onRefresh={refreshPage} />
			}
			onEndReached={fetchNextPage}
			onEndReachedThreshold={0.5}
			ListFooterComponent={renderFooter}
		></FlatList>
	);
}
