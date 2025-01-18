import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageProps, View } from "react-native";
import { loadHeaders } from "@/utils/packageAPI";
import api from "@/utils/axios";
import { Buffer } from "buffer";
import { ThemedText } from "./ThemedText";

interface AuthImageProps extends Omit<ImageProps, "source"> {
	imageLocation: string;
}

export const AuthImage: React.FC<AuthImageProps> = ({
	imageLocation,
	...imageProps
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [base64Img, setBase64Img] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadImage = async () => {
			try {
				// Fetch image data with authentication
				const response = await api.get("/packages/file/get", {
					params: { fileLocation: imageLocation },
					responseType: "arraybuffer",
				});

				// Get content type from the response headers
				const contentType = response.headers["content-type"];
				const base64Data = `data:${contentType};base64,${Buffer.from(
					response.data,
					"binary"
				).toString("base64")}`;

				setBase64Img(base64Data);
			} catch (err) {
				console.error("Error loading image:", err);
				setError("Failed to load image");
			} finally {
				setIsLoading(false);
			}
		};

		loadImage();
	}, [imageLocation]);

	if (isLoading) {
		// Render a loading indicator or placeholder while loading
		return (
			<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
				<ActivityIndicator size="small" color="#0000ff" />
			</View>
		);
	}

	if (error || !base64Img) {
		return (
			<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
				<ThemedText style={{ color: "red" }}>
					{error || "Error"}
				</ThemedText>
			</View>
		);
	}

	return (
		<Image
			{...imageProps}
			source={{
				uri: base64Img,
			}}
		/>
	);
};
