
import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Dimensions, Platform } from 'react-native';
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
import { FONTS } from '../../Common/Constants/fonts';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const isAndroid = Platform.OS === 'android';

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
    const lastUserSelectedValueRef = useRef<number | null>(null);
    const isUserScrollingRef = useRef<boolean>(false);
    const scrollEndHandledRef = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastScrollOffsetRef = useRef<number>(0);

    const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
        return <Item index={index} item={item} transX={transX} />;
    }, []);

    const keyExtractor = useCallback((item: any, index: number) => `${item.id}-${index}`, []);

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
        }),
        [],
    );

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            transX.value = event.contentOffset.x;
        },
    });

    const calculateSelectedItem = (scrollOffset: number, shouldSnap: boolean = false) => {
        // Prevent duplicate handling if both onScrollEndDrag and onMomentumScrollEnd fire
        if (scrollEndHandledRef.current) {
            return;
        }
        scrollEndHandledRef.current = true;

        // Calculate which item should be centered based on scroll offset
        // scrollOffset of 0 means item 0 is centered (due to paddingHorizontal)
        const itemIndex = Math.round(scrollOffset / ITEM_WIDTH);
        const clampedIndex = Math.max(0, Math.min(itemIndex, data.length - 1));

        // For Android, manually snap to the correct position
        if (shouldSnap && isAndroid && flatListRef.current) {
            const targetOffset = clampedIndex * ITEM_WIDTH;
            flatListRef.current.scrollToOffset({ offset: targetOffset, animated: true });
        }

        // Only call onChange if the index actually changed
        if (clampedIndex !== lastSelectedIndexRef.current && data[clampedIndex] && onChange) {
            lastSelectedIndexRef.current = clampedIndex;
            // Use item.id if available, otherwise parse item.text as number (supports decimals)
            const selectedValue = data[clampedIndex].id ?? parseFloat(data[clampedIndex].text);

            // Track this as user-selected value to prevent feedback loop
            lastUserSelectedValueRef.current = selectedValue;

            console.log('BoxCarousel - Selected:', {
                scrollOffset,
                itemIndex,
                clampedIndex,
                itemText: data[clampedIndex].text,
                itemId: data[clampedIndex].id,
                selectedValue,
            });
            onChange(selectedValue);
        }

        // Mark scrolling as ended and reset flag after a short delay
        isUserScrollingRef.current = false;
        setTimeout(() => {
            scrollEndHandledRef.current = false;
        }, 100);
    };

    const onScrollBeginDrag = () => {
        // User started scrolling - prevent value effect from interfering
        isUserScrollingRef.current = true;
        scrollEndHandledRef.current = false;

        // Clear any pending scroll timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }
    };

    const onScrollEndDrag = (e: any) => {
        // onScrollEndDrag fires when user releases finger
        const scrollOffset = e.nativeEvent.contentOffset.x;
        lastScrollOffsetRef.current = scrollOffset;

        // For Android, we need to handle the case where momentum scroll doesn't fire
        // Use a timeout to detect if momentum scroll will happen
        if (isAndroid) {
            scrollTimeoutRef.current = setTimeout(() => {
                // If momentum scroll didn't fire, handle the snap here
                if (!scrollEndHandledRef.current) {
                    calculateSelectedItem(scrollOffset, true);
                }
            }, 150);
        }
    };

    const onMomentumScrollBegin = () => {
        // Momentum scroll is starting - clear the timeout from onScrollEndDrag
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }
    };

    const onMomentumScrollEnd = (e: any) => {
        // onMomentumScrollEnd fires after momentum scrolling stops
        // This is the most reliable event - it fires after the user lifts their finger
        // and the scroll has completed, including any snap animations
        const scrollOffset = e.nativeEvent.contentOffset.x;

        // Clear any pending timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }

        // For Android, always snap to ensure proper alignment
        calculateSelectedItem(scrollOffset, isAndroid);
    };

    // Reset lastSelectedIndex when data changes (e.g., unit change)
    useEffect(() => {
        if (data.length !== lastDataLengthRef.current) {
            lastSelectedIndexRef.current = null;
            lastDataLengthRef.current = data.length;
            // Reset user selection tracking when data changes to allow value effect to work
            lastUserSelectedValueRef.current = null;
        }
    }, [data]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Scroll to the value when it changes (e.g., when unit changes)
    // But skip if user is actively scrolling or if this is the value they just selected
    useEffect(() => {
        // Don't interfere if user is actively scrolling
        if (isUserScrollingRef.current) {
            return;
        }

        // Don't scroll if this is the value the user just selected (prevents feedback loop)
        if (value !== null && value !== undefined && lastUserSelectedValueRef.current !== null) {
            const tolerance = 0.01; // Small tolerance for floating point comparison
            if (Math.abs(value - lastUserSelectedValueRef.current) < tolerance) {
                return;
            }
        }

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

                // Use scrollToOffset for consistent behavior across platforms
                // The offset is simply index * ITEM_WIDTH because paddingHorizontal handles centering
                const scrollDelay = isAndroid ? 300 : 200;
                setTimeout(() => {
                    const offset = closestIndex * ITEM_WIDTH;
                    flatListRef.current?.scrollToOffset({ offset, animated: false });
                    transX.value = offset;
                    lastSelectedIndexRef.current = closestIndex;
                }, scrollDelay);
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
                    onScrollBeginDrag={onScrollBeginDrag}
                    onScrollEndDrag={onScrollEndDrag}
                    onMomentumScrollBegin={onMomentumScrollBegin}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                    contentContainerStyle={{ paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2 }}
                    data={data}
                    decelerationRate={isAndroid ? 'normal' : 'fast'}
                    snapToInterval={ITEM_WIDTH}
                    scrollEventThrottle={16}
                    snapToAlignment="start"
                    disableIntervalMomentum={isAndroid}
                    pagingEnabled={false}
                    renderItem={renderItem}
                    getItemLayout={getItemLayout}
                    keyExtractor={keyExtractor}
                    removeClippedSubviews={isAndroid}
                    windowSize={isAndroid ? 5 : 21}
                    maxToRenderPerBatch={isAndroid ? 5 : 10}
                    initialNumToRender={isAndroid ? 10 : 20}
                    onScrollToIndexFailed={(info) => {
                        // Fallback: scroll to offset if scrollToIndex fails
                        const wait = new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
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
    const isCenter = useDerivedValue(() => {
        return (
            udv.value !== null &&
            Math.abs((udv.value as number) - index * ITEM_WIDTH) < ITEM_WIDTH * 0.25
        );
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacityAnimation(transX, index),
            transform: [
                {
                    scale: scaleAnimation(udv, index),
                },
            ],
            // Card visual to match Figma
            backgroundColor: isCenter.value ? '#9B5CF6' : COLORS.bg_color,
            borderWidth: 2,
            borderColor: '#9B5CF6',
        };
    });

    const textStyle = useAnimatedStyle(() => {
        return {
            color: isCenter.value ? 'white' : COLORS.black,
        };
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Animated.Text style={[styles.label, textStyle]}>{item.text}</Animated.Text>
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

const opacityAnimation = (transX: any, index: number) => {
    'worklet';

    return interpolate(
        transX.value,
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
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 6,
        // },
        // shadowOpacity: 0.37,
        // shadowRadius: 7.49,

        // elevation: 12,
    },
    label: {
        fontFamily: FONTS.URBANIST_REGULAR,
        fontSize: 18,

    },
});

export default BoxCarousel;