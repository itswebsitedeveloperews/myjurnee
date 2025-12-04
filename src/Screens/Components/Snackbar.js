import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, X, AlertCircle, Info, XCircle } from 'lucide-react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const Snackbar = ({
    visible = false,
    message = '',
    type = 'success', // 'success', 'error', 'info', 'warning'
    duration = 3000,
    onDismiss = () => { },
    position = 'top', // 'top' or 'bottom'
}) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(visible ? 0 : (position === 'top' ? -100 : 100))).current;
    const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto dismiss
            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleDismiss();
                }, duration);

                return () => clearTimeout(timer);
            }
        } else {
            // Hide animation
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: position === 'top' ? -100 : 100,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, duration, position]);

    const handleDismiss = () => {
        onDismiss();
    };

    const getIcon = () => {
        const iconSize = 20;
        const iconColor = COLORS.white;

        switch (type) {
            case 'success':
                return <FastImage source={IMAGES.IC_SUCCESS} style={{ width: 20, height: 20 }} resizeMode="contain" />;
            case 'error':
                return <XCircle size={iconSize} color={iconColor} fill={iconColor} />;
            case 'warning':
                return <AlertCircle size={iconSize} color={iconColor} fill={iconColor} />;
            case 'info':
                return <Info size={iconSize} color={iconColor} fill={iconColor} />;
            default:
                return <CheckCircle size={iconSize} color={iconColor} fill={iconColor} />;
        }
    };

    // Parse message to support **bold** text
    const renderMessage = () => {
        const parts = message.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                    <Text key={index} style={styles.boldText}>
                        {boldText}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    if (!visible) {
        return null;
    }

    const topOffset = position === 'top' ? Math.max(insets.top, 10) + 10 : undefined;
    const bottomOffset = position === 'bottom' ? Math.max(insets.bottom, 10) + 10 : undefined;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    top: topOffset,
                    bottom: bottomOffset,
                },
            ]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>{getIcon()}</View>
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>{renderMessage()}</Text>
                </View>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleDismiss}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <X size={18} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default Snackbar;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        backgroundColor: COLORS.purple,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
    },
    iconContainer: {
        marginRight: 12,
    },
    messageContainer: {
        flex: 1,
        marginRight: 8,
    },
    message: {
        fontFamily: FONTS.URBANIST_REGULAR,
        fontSize: 14,
        color: COLORS.white,
        lineHeight: 20,
    },
    boldText: {
        fontFamily: FONTS.URBANIST_BOLD,
        color: COLORS.white,
    },
    closeButton: {
        padding: 4,
    },
});

