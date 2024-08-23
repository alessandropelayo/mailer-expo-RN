import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, ViewProps } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	Easing,
	ReduceMotion,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { ThemedView } from "./ThemedView";

export type ZoomableImageProps = ViewProps & {
	uri: string;
};

const ZoomableImage = ({ style, uri, ...otherProps }: ZoomableImageProps) => {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const scale = useSharedValue(1);
	const pinchScale = useSharedValue(1);
	const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
	const windowDimensions = useWindowDimensions();

	const clampTranslate = (value: number, max: number) => {
		"worklet";
		return Math.max(Math.min(value, max), -max);
	};

	const doubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.onStart((event) => {
			const targetScale = scale.value === 1 ? 3 : 1;

			const tapX = event.x;
			const tapY = event.y;

			// Calculate the new translateX and translateY to center the tapped point
			const centerX = windowDimensions.width / 2;
			const centerY = windowDimensions.height / 2;

			const offsetX = (centerX - tapX) * (targetScale / scale.value);
			const offsetY = (centerY - tapY) * (targetScale / scale.value);

			const newTranslateX = translateX.value + offsetX;
			const newTranslateY = translateY.value + offsetY;

			// translateX.value = withTiming(0, { duration: 100 });
			// translateY.value = withTiming(0, { duration: 100 });
			scale.value = withTiming(targetScale, {
				duration: 300,
				easing: Easing.linear,
				reduceMotion: ReduceMotion.System,
			});
			const scaledWidth = imageLayout.width * targetScale;
			const scaledHeight = imageLayout.height * targetScale;
			const maxTranslateX = Math.max(
				(scaledWidth - windowDimensions.width) / 2,
				0
			);
			const maxTranslateY = Math.max(
				(scaledHeight - windowDimensions.height) / 2,
				0
			);

			translateX.value = withTiming(
				clampTranslate(newTranslateX, maxTranslateX),
				{
					duration: 300,
					easing: Easing.linear,
					reduceMotion: ReduceMotion.System,
				}
			);
			translateY.value = withTiming(
				clampTranslate(newTranslateY, maxTranslateY),
				{
					duration: 300,
					easing: Easing.linear,
					reduceMotion: ReduceMotion.System,
				}
			);
		});

	const drag = Gesture.Pan().onChange((event) => {
		const scaledWidth = imageLayout.width * scale.value;
		const scaledHeight = imageLayout.height * scale.value;

		const clampedX = Math.max(
			Math.min(
				translateX.value + event.changeX,
				Math.max((scaledWidth - windowDimensions.width) / 2, 0)
			),
			Math.min(-(scaledWidth - windowDimensions.width) / 2, 0)
		);
		const clampedY = Math.max(
			Math.min(
				translateY.value + event.changeY,
				Math.max((scaledHeight - windowDimensions.height) / 2, 0)
			),
			Math.min(-(scaledHeight - windowDimensions.height) / 2, 0)
		);

		translateX.value = clampedX;
		translateY.value = clampedY;
	});

	const pinch = Gesture.Pinch().onChange((event) => {
		pinchScale.value = event.scale;
		const targetScale = scale.value * pinchScale.value;

		// Clamp the final scale to ensure it doesn't go below 1
		const finalScale = Math.max(1, targetScale);

		// Calculate the new scaled width and height of the image
		const scaledWidth = imageLayout.width * finalScale;
		const scaledHeight = imageLayout.height * finalScale;

		// Calculate the maximum translation values to ensure the image stays within bounds
		const maxTranslateX = Math.max(
			(scaledWidth - windowDimensions.width) / 2,
			0
		);
		const maxTranslateY = Math.max(
			(scaledHeight - windowDimensions.height) / 2,
			0
		);

		// Calculate the center point of the pinch gesture
		const centerX = windowDimensions.width / 2;
		const centerY = windowDimensions.height / 2;

		// Calculate the offsets needed to keep the pinch focus point in place
		const offsetX = (centerX - event.focalX) * (targetScale / scale.value);
		const offsetY = (centerY - event.focalY) * (targetScale / scale.value);

		// Calculate the new translation values
		const newTranslateX = translateX.value + offsetX;
		const newTranslateY = translateY.value + offsetY;

		// Clamp the translation values to ensure the image stays within bounds
		translateX.value = withTiming(
			clampTranslate(newTranslateX, maxTranslateX),
			{
				duration: 300,
				easing: Easing.linear,
				reduceMotion: ReduceMotion.System,
			}
		);
		translateY.value = withTiming(
			clampTranslate(newTranslateY, maxTranslateY),
			{
				duration: 300,
				easing: Easing.linear,
				reduceMotion: ReduceMotion.System,
			}
		);

		// Animate the scale change
		scale.value = withTiming(finalScale, {
			duration: 300,
			easing: Easing.linear,
			reduceMotion: ReduceMotion.System,
		});

		// Reset the pinch scale value
		pinchScale.value = 1;
	});

	const containerStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: translateX.value,
				},
				{
					translateY: translateY.value,
				},
				{
					scale: scale.value,
				},
			],
		};
	});

	const onImageLayout = (event: {
		nativeEvent: { layout: { width: any; height: any } };
	}) => {
		const { width, height } = event.nativeEvent.layout;
		setImageLayout({ width, height });
	};
	return (
		<GestureHandlerRootView style={styles.mainContainer}>
			<Animated.View style={[containerStyle]}>
				<GestureDetector gesture={Gesture.Race(pinch, drag)}>
					<GestureDetector gesture={doubleTap}>
						<Animated.View
							style={[styles.imageContainer, style]}
							collapsable={true}
						>
							<Animated.Image
								style={[styles.pinchableImage]}
								source={{ uri }}
								onLayout={onImageLayout}
							/>
						</Animated.View>
					</GestureDetector>
				</GestureDetector>
			</Animated.View>
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
		backgroundColor: "black",
		justifyContent: "center",
		overflow: "scroll",
	},
	pinchableImage: {
		width: "100%",
		height: "100%",
		resizeMode: "contain",
	},
});
