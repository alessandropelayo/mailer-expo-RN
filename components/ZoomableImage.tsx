import { Image, ImageProps } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, ViewProps } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	clamp,
} from "react-native-reanimated";

export type ZoomableImageProps = ImageProps & {};

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

// Use library for image viewing :)
const ZoomableImage = ({
	style,
	source,
	...otherProps
}: ZoomableImageProps) => {
	const offset = useSharedValue({ x: 0, y: 0 });
	const start = useSharedValue({ x: 0, y: 0 });
	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);
	const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
	const windowDimensions = useWindowDimensions();

	const MIN_SCALE = 1;
	const MAX_SCALE = 4;

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: offset.value.x },

				{ translateY: offset.value.y },

				{ scale: scale.value },
			],
		};
	});

	const dragGesture = Gesture.Pan()

		.averageTouches(true)

		.onUpdate((e) => {
			const scaledWidth = imageLayout.width * scale.value;
			const scaledHeight = imageLayout.height * scale.value;
			const clampedX = Math.max(
				Math.min(
					e.translationX + start.value.x,
					Math.max((scaledWidth - windowDimensions.width) / 2, 0)
				),
				Math.min(-(scaledWidth - windowDimensions.width) / 2, 0)
			);
			const clampedY = Math.max(
				Math.min(
					e.translationY + start.value.y,
					Math.max((scaledHeight - windowDimensions.height) / 2, 0)
				),
				Math.min(-(scaledHeight - windowDimensions.height) / 2, 0)
			);
			offset.value = {
				x: clampedX,

				y: clampedY,
			};
		})

		.onEnd(() => {
			start.value = {
				x: offset.value.x,

				y: offset.value.y,
			};
		});

	const zoomGesture = Gesture.Pinch()

		.onUpdate((e) => {
			const newScale = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);

			const scaledWidth = imageLayout.width * scale.value;
			const scaledHeight = imageLayout.height * scale.value;
			const clampedX = Math.max(
				Math.min(
					start.value.x,
					Math.max((scaledWidth - windowDimensions.width) / 2, 0)
				),
				Math.min(-(scaledWidth - windowDimensions.width) / 2, 0)
			);
			const clampedY = Math.max(
				Math.min(
					start.value.y,
					Math.max((scaledHeight - windowDimensions.height) / 2, 0)
				),
				Math.min(-(scaledHeight - windowDimensions.height) / 2, 0)
			);
			offset.value = {
				x: clampedX,

				y: clampedY,
			};

			scale.value = newScale;
		})

		.onEnd(() => {
			savedScale.value = scale.value;
			start.value = {
				x: offset.value.x,

				y: offset.value.y,
			};
		});

	const composed = Gesture.Simultaneous(dragGesture, zoomGesture);

	const onImageLayout = (event: {
		nativeEvent: { layout: { width: any; height: any } };
	}) => {
		const { width, height } = event.nativeEvent.layout;
		setImageLayout({ width, height });
	};

	return (
		<GestureHandlerRootView style={styles.mainContainer}>
			<GestureDetector gesture={composed} touchAction="auto">
				<Animated.View
					style={[styles.imageContainer, style]}
					collapsable={true}
				>
					<AnimatedExpoImage
						style={[styles.pinchableImage, animatedStyles]}
						source={source}
						onLayout={onImageLayout}
						{...otherProps}
					></AnimatedExpoImage>
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
};

export default ZoomableImage;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	pinchableImage: {
		width: "100%",
		height: "100%",
	},
});
