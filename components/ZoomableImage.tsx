import React, { useRef, createRef, useState } from "react";
import {
	Animated,
	LayoutChangeEvent,
	StyleSheet,
	ViewProps,
} from "react-native";
import {
	GestureHandlerRootView,
	PanGestureHandler,
	PinchGestureHandler,
	TapGestureHandler,
	State,
	PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";


export type ZoomableImageProps = ViewProps & {
	uri: string;
};

const ZoomableImage = ({ style, uri, ...otherProps }: ZoomableImageProps) => {
	const [panEnabled, setPanEnabled] = useState(false);

	const pinchRef = createRef();
	const panRef = createRef();
	const doubleTapRef = createRef();

	const baseScale = useRef(new Animated.Value(1)).current;
	const pinchScale = useRef(new Animated.Value(1)).current;
	const scale = useRef(Animated.multiply(baseScale, pinchScale)).current;

	const translateX = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(0)).current;
	const focalX = useRef(new Animated.Value(0)).current;
	const focalY = useRef(new Animated.Value(0)).current;
	let lastOffset = { x: 0, y: 0 };
	let lastFocalOffset = { x: 0, y: 0 };

	const onPinchEvent = Animated.event(
		[
			{
				nativeEvent: {
					scale: pinchScale,
				},
			},
		],
		{ useNativeDriver: true }
	);

	const onPanEvent = Animated.event(
		[
			{
				nativeEvent: {
					translationX: translateX,
					translationY: translateY,
				},
			},
		],
		{ useNativeDriver: true }
	);

	const handlePinchStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
		if (nativeEvent.state === State.ACTIVE) {
			setPanEnabled(true);
		}

		const nScale = nativeEvent.scale;
		if (nativeEvent.state === State.END) {
			if (nScale < 1) {
				Animated.spring(pinchScale, {
					toValue: 1,
					useNativeDriver: true,
				}).start();
				Animated.spring(translateX, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
				Animated.spring(translateY, {
					toValue: 0,
					useNativeDriver: true,
				}).start();

				setPanEnabled(false);
			} else {
			}
		}
	};

	const handlePanStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
		if (nativeEvent.state === State.END) {
			// When the gesture ends, update the last offset with the final translation values

			lastOffset.x += nativeEvent.translationX;
			lastOffset.y += nativeEvent.translationY;

			// Set the final offset values
			translateX.setOffset(lastOffset.x);
			translateY.setOffset(lastOffset.y);

			// Reset the translation values to zero to prepare for the next gesture
			translateX.setValue(0);
			translateY.setValue(0);
		}
	};

	const handleDoubleTap = ({ nativeEvent }: { nativeEvent: any }) => {
		if (nativeEvent.state === State.ACTIVE) {
			console.log("Double tap detected!");
		}
	};

	return (
		<GestureHandlerRootView style={styles.mainContainer}>
			<PanGestureHandler
				ref={panRef}
				onGestureEvent={onPanEvent}
				onHandlerStateChange={handlePanStateChange}
				enabled={panEnabled}
				shouldCancelWhenOutside
			>
				<Animated.View style={[styles.wrapper]}>
					<PinchGestureHandler
						ref={pinchRef}
						onGestureEvent={onPinchEvent}
						simultaneousHandlers={[panRef]}
						onHandlerStateChange={handlePinchStateChange}
					>
						<Animated.View style={[styles.wrapper]}>
							<TapGestureHandler
								ref={doubleTapRef}
								numberOfTaps={2}
								onHandlerStateChange={handleDoubleTap}
							>
								<Animated.View
									style={[styles.imageContainer, style]}
									collapsable={false}
								>
									<Animated.Image
										style={[
											styles.pinchableImage,
											{
												transform: [
													{ scale: scale },
													{ translateX },
													{ translateY },
												],
											},
										]}
										source={{ uri }}
									/>
								</Animated.View>
							</TapGestureHandler>
						</Animated.View>
					</PinchGestureHandler>
				</Animated.View>
			</PanGestureHandler>
		</GestureHandlerRootView>
	);
};

export default ZoomableImage;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		overflow: "hidden",
	},
	imageContainer: {
		backgroundColor: "black",
		alignItems: "center",
		justifyContent: "center",
		overflow: "scroll",
	},
	pinchableImage: {
		width: "100%",
		height: "100%",
		resizeMode: "contain",
	},
	wrapper: {
		flex: 1,
	},
});
