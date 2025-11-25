import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const MenuItem = ({
    icon,
    title,
    onPress,
    containerStyle,
    iconStyle
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, containerStyle]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <FastImage
                source={icon}
                style={[styles.icon, iconStyle]}
                resizeMode="contain"
            />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    title: {
        fontFamily: FONTS.URBANIST_REGULAR,
        fontSize: 16,
        color: COLORS.textColor,
        flex: 1,
    },
});
