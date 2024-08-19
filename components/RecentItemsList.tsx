import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Image,
	type ViewProps,
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
import { getRecentPackagesHomePage } from "@/utils/packageAPI";
import { ThemedText } from "./ThemedText";
import ThemedPackageCard from "./ThemedPackageCard";

export type RecentPackagesProps = ViewProps & {};

interface Package {
	trackingId: string;
	carrier: string;
	statusHistory: {
		trackingId: string;
		statusTime: string;
		deliveryDate: string;
		status: string;
	}[];
	deliveryPhoto: {
		fileLocation: string;
	}[];
}

export enum ShippingCarrier {
	USPS = "USPS",
	UPS = "UPS",
	FEDEX = "FedEx",
	USPS_Daily = "USPS_Daily",
}

export function RecentPackages({ style, ...otherProps }: RecentPackagesProps) {
	const [packages, setPackages] = useState<Package[]>([]); // Array to store fetched packages
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [after, setAfter] = useState(String);
	const [count, setCount] = useState(0);
	const [limit, setLimit] = useState(10);

	const [seenDates, setSeenDates] = useState([""]);
	const [shouldShowDate, setShouldShowDate] = useState([true]);

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
				setIsLoading(false);
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
				<ThemedText>End of Messages</ThemedText>
			</ThemedView>
		);
	};

	useEffect(() => {
		fetchData();
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
					{new Date(item?.statusHistory?.[0]?.statusTime).getDate() <
						new Date(
							packages[index - 1]?.statusHistory?.[0]?.statusTime
						).getDate() && (
						<ThemedText type={"title"} style={{}}>
							{new Date(
								item?.statusHistory?.[0]?.statusTime
							).toLocaleDateString()}
						</ThemedText>
					)}
					<ThemedPackageCard
						key={item.trackingId + item.carrier}
						packageData={item}
						style={{
							justifyContent: "flex-start",
						}}
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
