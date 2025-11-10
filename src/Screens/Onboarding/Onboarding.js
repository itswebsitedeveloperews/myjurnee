import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const onboardingData = [
    {
        id: '1',
        title: 'Weight Tracker',
        description: 'Welcome to The Ultimate Exercise Library\nPlus, the ultimate resource for\ncomprehensive exercise guidance!',
        image: IMAGES.ONBOARDING_1,
        buttonText: 'NEXT',
    },
    {
        id: '2',
        title: 'Nutrition Courses',
        description: 'Welcome to The Ultimate Exercise Library\nPlus, the ultimate resource for\ncomprehensive exercise guidance!',
        image: IMAGES.ONBOARDING_2,
        buttonText: 'NEXT',
    },
    {
        id: '3',
        title: 'Track Your Progress',
        description: 'Welcome to The Ultimate Exercise Library\nPlus, the ultimate resource for\ncomprehensive exercise guidance!',
        image: IMAGES.ONBOARDING_3,
        buttonText: 'GO AHEAD',
    },
];

const Onboarding = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        try {
            await localStorageHelper.setStorageItem({
                key: StorageKeys.ONBOARDING_SHOWN,
                value: 'true',
            });

            // Navigate to auth stack after onboarding
            navigation.replace('AuthStack');
        } catch (error) {
            console.log('Error saving onboarding status:', error);
            navigation.replace('AuthStack');
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slideContainer}>
                <ImageBackground
                    source={item.image}
                    style={styles.backgroundImage}
                    resizeMode="cover">
                    {/* <View style={styles.overlay} /> */}
                    <View style={styles.contentContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>

                        <View style={styles.paginationContainer}>
                            {onboardingData.map((_, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.paginationDot,
                                        idx === index && styles.paginationDotActive,
                                    ]}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleNext}
                            activeOpacity={0.8}>
                            <Text style={styles.buttonText}>{item.buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEnabled={true}
                getItemLayout={(data, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
            />
        </View>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slideContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 50,
        paddingTop: 100,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        // paddingBottom: 60,
    },
    title: {
        fontSize: 52,
        lineHeight: 60,
        letterSpacing: 1,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.white,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.white,
        lineHeight: 18,
    },
    paginationContainer: {
        flexDirection: 'row',
        marginTop: 30,
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 60,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.white,
        opacity: 1,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 22,
        backgroundColor: COLORS.purple,
        opacity: 1,
    },
    button: {
        backgroundColor: COLORS.purple,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        // width: '100%',
        marginHorizontal: 80
    },
    buttonText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.white,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});

