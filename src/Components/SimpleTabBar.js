import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
} from 'react-native';
import { COLORS } from '../Common/Constants/colors';
import { FONTS } from '../Common/Constants/fonts';
import { IMAGES } from '../Common/Constants/images';

const SimpleTabBar = ({ state, descriptors, navigation }) => {
    const tabData = [
        {
            name: 'Home',
            icon: IMAGES.IC_HOME,
            route: 'Dashboard',
        },
        {
            name: 'Courses',
            icon: IMAGES.IC_FILE,
            route: 'Projects',
        },
        {
            name: 'Weight',
            icon: IMAGES.IC_SCALE,
            route: 'WeightTracker',
        },
        {
            name: 'Profile',
            icon: IMAGES.IC_USER,
            route: 'Profile',
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const tabInfo = tabData[index];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                        >
                            <View style={[styles.tabContent, isFocused && styles.activeTabContent]}>
                                <View style={[styles.iconContainer,]}>
                                    <Image
                                        source={tabInfo.icon}
                                        style={[
                                            styles.icon,
                                            { tintColor: isFocused ? COLORS.pr_blue : COLORS.black }
                                        ]}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color: isFocused ? COLORS.pr_blue : COLORS.black,
                                            fontFamily: isFocused ? FONTS.BROTHER_1816_MEDIUM : FONTS.BROTHER_1816_MEDIUM,
                                        }
                                    ]}
                                >
                                    {tabInfo.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        height: 80,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        minWidth: 60,
    },
    activeTabContent: {
        // backgroundColor: 'rgba(0, 100, 229, 0.1)',
    },
    iconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    activeIconContainer: {
        // backgroundColor: COLORS.pr_blue,
        tintColor: COLORS.pr_blue,
        borderRadius: 12,
        width: 32,
        height: 32,
        shadowColor: COLORS.pr_blue,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    icon: {
        width: 20,
        height: 20,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export default SimpleTabBar;
