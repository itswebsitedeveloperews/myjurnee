
import React, { useEffect, useRef } from 'react';
import { StyleSheet, FlatList, View, Text, Dimensions } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import { COLORS } from '../../Common/Constants/colors';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(SCREEN_WIDTH / 5);

const BoxCarousel = ({
    data,
    onChange,
    value
}: {
    data: any;
    onChange?: (value: number) => void;
    value?: number | null;
}) => {

    const transX = useSharedValue(0);
    const lastSelectedIndexRef = useRef<number | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const lastDataLengthRef = useRef<number>(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        return <Item index={index} item={item} transX={transX} />;
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            transX.value = event.contentOffset.x;
        },
    });

    const calculateSelectedItem = (scrollOffset: number) => {
        // Clear any pending timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }

        // Use a longer delay to ensure scroll has fully settled
        // This is especially important for fast scrolling - we wait longer to ensure
        // the snap animation has completely finished
        scrollTimeoutRef.current = setTimeout(() => {
            // Calculate the expected snap position
            // With snapToInterval={ITEM_WIDTH}, the scroll will snap to the nearest multiple of ITEM_WIDTH
            const snappedOffset = Math.round(scrollOffset / ITEM_WIDTH) * ITEM_WIDTH;
            const itemIndex = Math.round(snappedOffset / ITEM_WIDTH);
            const clampedIndex = Math.max(0, Math.min(itemIndex, data.length - 1));

            // Only call onChange if the index actually changed
            if (clampedIndex !== lastSelectedIndexRef.current && data[clampedIndex] && onChange) {
                lastSelectedIndexRef.current = clampedIndex;
                // Use item.id if available, otherwise parse item.text as number (supports decimals)
                const selectedValue = data[clampedIndex].id ?? parseFloat(data[clampedIndex].text);
                console.log('BoxCarousel - Selected (settled):', {
                    scrollOffset,
                    snappedOffset,
                    itemIndex,
                    clampedIndex,
                    itemText: data[clampedIndex].text,
                    itemId: data[clampedIndex].id,
                    selectedValue,
                    dataLength: data.length,
                });
                onChange(selectedValue);
            }
            scrollTimeoutRef.current = null;
        }, 500); // Longer delay (500ms) to ensure fast scrolling is fully settled
    };

    const onMomentumScrollEnd = (e: any) => {
        // onMomentumScrollEnd fires after momentum scrolling stops
        // This is the most reliable event - it fires after the user lifts their finger
        // and the scroll has completed, including any snap animations
        // We use a longer delay (500ms) to ensure fast scrolling is fully settled
        const scrollOffset = e.nativeEvent.contentOffset.x;
        calculateSelectedItem(scrollOffset);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Reset lastSelectedIndex when data changes (e.g., unit change)
    useEffect(() => {
        if (data.length !== lastDataLengthRef.current) {
            lastSelectedIndexRef.current = null;
            lastDataLengthRef.current = data.length;
        }
    }, [data]);

    // Scroll to the value when it changes (e.g., when unit changes)
    useEffect(() => {
        if (value !== null && value !== undefined && data.length > 0 && flatListRef.current) {
            // Find the closest match in the data array
            let closestIndex = -1;
            let closestDiff = Infinity;

            data.forEach((item: any, index: number) => {
                const itemValue = item.id ?? parseFloat(item.text);
                const diff = Math.abs(itemValue - value);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestIndex = index;
                }
            });

            if (closestIndex >= 0 && closestIndex < data.length) {
                const selectedItem = data[closestIndex];
                const selectedValue = selectedItem.id ?? parseFloat(selectedItem.text);

                // Log nearby values for debugging
                const nearbyValues = [];
                for (let i = Math.max(0, closestIndex - 2); i <= Math.min(data.length - 1, closestIndex + 2); i++) {
                    const item = data[i];
                    const itemValue = item.id ?? parseFloat(item.text);
                    nearbyValues.push({ index: i, value: itemValue, diff: Math.abs(itemValue - value) });
                }

                console.log('BoxCarousel - Scrolling to value:', {
                    targetValue: value,
                    foundValue: selectedValue,
                    foundIndex: closestIndex,
                    difference: closestDiff,
                    nearbyValues,
                });

                // Scroll to the index after a small delay to ensure the list is rendered
                setTimeout(() => {
                    try {
                        flatListRef.current?.scrollToIndex({
                            index: closestIndex,
                            animated: false, // Use false for immediate positioning
                            viewPosition: 0.5,
                        });
                        // Update transX to match
                        transX.value = closestIndex * ITEM_WIDTH;
                        lastSelectedIndexRef.current = closestIndex;
                    } catch (error) {
                        console.log('BoxCarousel - scrollToIndex failed, using scrollToOffset');
                        // Fallback: scroll to offset
                        const offset = closestIndex * ITEM_WIDTH;
                        flatListRef.current?.scrollToOffset({ offset, animated: false });
                        transX.value = offset;
                        lastSelectedIndexRef.current = closestIndex;
                    }
                }, 200);
            }
        }
    }, [value, data, onChange]);

    return (
        <View style={styles.container}>
            {/* Center arrow indicator */}
            <View style={{ position: 'absolute', top: 10, zIndex: 10, alignItems: 'center', width: '100%' }}>
                <View
                    style={{
                        width: 0,
                        height: 0,
                        borderLeftWidth: 8,
                        borderRightWidth: 8,
                        borderTopWidth: 12,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderTopColor: COLORS.purple,
                    }}
                />
            </View>
            <View style={styles.listContainer}>
                <AnimatedFlatList
                    ref={flatListRef}
                    onScroll={scrollHandler}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                    contentContainerStyle={{ paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2 }}
                    data={data}
                    decelerationRate="fast"
                    snapToInterval={ITEM_WIDTH}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: number) => `${item.id}-${index}`}
                    onScrollToIndexFailed={(info) => {
                        // Fallback: scroll to offset if scrollToIndex fails
                        const wait = new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
                        wait.then(() => {
                            if (flatListRef.current && info.index >= 0 && info.index < data.length) {
                                const offset = info.index * ITEM_WIDTH;
                                flatListRef.current.scrollToOffset({ offset, animated: true });
                                transX.value = offset;
                            }
                        });
                    }}
                />
            </View>
        </View>
    );
};

const Item = ({ index, item, transX }: { index: number; item: any; transX: any }) => {
    const udv = useDerivedValue(() => {
        if (
            transX.value >= (index - 3) * ITEM_WIDTH &&
            transX.value <= (index + 3) * ITEM_WIDTH
        ) {
            return transX.value;
        } else if (transX.value < (index - 3) * ITEM_WIDTH) {
            return null;
        } else if (transX.value > (index + 3) * ITEM_WIDTH) {
            return null;
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        // Determine if this card is centered
        const isCenter =
            udv.value !== null &&
            Math.abs((udv.value as number) - index * ITEM_WIDTH) < ITEM_WIDTH * 0.25;

        return {
            opacity: opacityAnimation(udv, index),
            transform: [
                {
                    scale: scaleAnimation(udv, index),
                },
            ],
            // Card visual to match Figma
            backgroundColor: isCenter ? '#9B5CF6' : 'transparent',
            borderWidth: 2,
            borderColor: '#9B5CF6',
        };
    });
    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={[styles.label, { color: 'white' }]}>{item.text}</Text>
        </Animated.View>
    );
};

const scaleAnimation = (udv: any, index: number) => {
    'worklet';

    return udv.value === null
        ? 0
        : interpolate(
            udv.value,
            [
                (index - 2) * ITEM_WIDTH,
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
                (index + 2) * ITEM_WIDTH,
            ],
            [0.7, 0.7, 1, 0.7, 0.7],
            Extrapolate.CLAMP,
        );
};

const opacityAnimation = (udv: any, index: number) => {
    'worklet';

    return udv.value === null
        ? 0
        : interpolate(
            udv.value,
            [
                (index - 3) * ITEM_WIDTH,
                (index - 2) * ITEM_WIDTH,
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
                (index + 2) * ITEM_WIDTH,
                (index + 3) * ITEM_WIDTH,
            ],
            [0, 0.7, 0.8, 1, 0.8, 0.7, 0],
            Extrapolate.CLAMP,
        );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: 'red',
    },
    arrowRow: {
        position: 'absolute',
        top: '28%',
        width: '100%',
        alignItems: 'center',
        zIndex: 5,
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#9B5CF6',
    },
    listContainer: {
        height: ITEM_WIDTH + 250,
        alignItems: 'center',
        marginTop: 40,
        // justifyContent: 'center',
    },
    list: {
        height: ITEM_WIDTH * 2,
        flexGrow: 0,
    },
    card: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#fff',
    },
});

export default BoxCarousel;