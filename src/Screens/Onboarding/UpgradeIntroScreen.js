import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../Common/Constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FastImage from "react-native-fast-image";
import { IMAGES } from "../../Common/Constants/images";
import { windowHeight, windowWidth } from "../../Utils/Dimentions";
import { FONTS } from "../../Common/Constants/fonts";

const AVATAR_SIZE = 150;

const Ripple = ({ delay }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0.35)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 1.7,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        );

        const timeout = setTimeout(() => {
            animation.start();
        }, delay);

        return () => {
            clearTimeout(timeout);
            animation.stop();
        };
    }, []);

    return (
        <Animated.View
            style={[
                styles.ripple,
                {
                    transform: [{ scale }],
                    opacity,
                },
            ]}
        />
    );
};


export default function UpgradeIntroScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Avatar with Pulse */}
            <View style={styles.avatarWrapper}>
                <Ripple delay={0} />
                <Ripple delay={500} />
                <Ripple delay={1000} />
                <Ripple delay={1500} />
                {/* <Ripple delay={1300} /> */}


                <FastImage
                    source={IMAGES.ONBOARDING_1}
                    style={styles.avatar}
                    resizeMode="cover"
                />
            </View>

            {/* App logo and text */}
            <View style={styles.appLogoContainer}>
                <FastImage source={IMAGES.BLACK_LOGO} style={styles.appLogo} resizeMode="contain" />
            </View>

            <View style={styles.whiteTextContainer}>
                <Text style={styles.whiteText}>Your app just got upgraded</Text>
            </View>

            <View style={styles.brandTextContainer}>
                <Text style={styles.brandText}>Same Brand.</Text>
                <Text style={{ ...styles.brandText, color: COLORS.purple, marginTop: -12 }}>New Tools!</Text>
            </View>

            <View>
                <Text style={styles.descriptionText}>
                    We've built something special to support your whole weight-loss journey — not just your shopping.
                </Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={goNext}
                    style={[
                        styles.nextBtn,
                    ]}
                >
                    <Text style={styles.nextText}>
                        See What’s New
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.skip}>Skip Intro</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pr_lavender,
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 24,
    },

    avatarWrapper: {
        marginTop: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    ripple: {
        position: "absolute",
        width: AVATAR_SIZE + 10,
        height: AVATAR_SIZE + 10,
        borderRadius: 999,
        backgroundColor: COLORS.purple,
    },

    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },

    appLogoContainer: {
        marginTop: 22,
        alignItems: "center",
        // backgroundColor:'red'
    },

    appLogo: {
        width: windowWidth * 0.5,
        height: windowWidth * 0.2,
    },

    whiteTextContainer: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 26,
        paddingTop: 5,
        paddingBottom: 10,
        borderRadius: 28,
        marginTop: 14,
        alignItems: "center",
        width: '85%',
        alignSelf: 'center',
    },

    whiteText: {
        fontSize: 18,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.black,
    },

    brandTextContainer: {
        marginTop: 14,
        alignItems: "center",
        // backgroundColor:'red',
    },

    brandText: {
        fontSize: 44,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.black,
    },

    descriptionText: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12,
        paddingHorizontal: 20
    },

    skip: {
        marginTop: 18,
        textDecorationLine: "underline",
        color: "#333",
    },

    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingTop: 12,
        paddingBottom: 15,
        marginHorizontal: 50,
        width: '85%',
        borderRadius: 30,
        backgroundColor: COLORS.purple,
        alignSelf: 'center',
    },
    nextText: { color: 'white', fontSize: 18, fontFamily: FONTS.BROTHER_1816_MEDIUM, },
    skip: {
        marginTop: 18,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.black,
        paddingBottom: 0.001,
        color: COLORS.black,
        textAlign: 'center',
        alignSelf: 'center',
    },
});