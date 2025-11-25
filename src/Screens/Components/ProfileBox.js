import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const ProfileBox = ({
    profileImage,
    username,
    handle,
    imageStyle,
    containerStyle
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <FastImage
                source={profileImage}
                style={[styles.profileImage, imageStyle]}
                resizeMode="cover"
            />
            <View style={styles.textContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.handle}>{handle}</Text>
            </View>
        </View>
    );
};

export default ProfileBox;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    username: {
        fontFamily: FONTS.URBANIST_BOLD,
        fontSize: 18,
        color: COLORS.textColor,
        marginBottom: 4,
    },
    handle: {
        fontFamily: FONTS.URBANIST_REGULAR,
        fontSize: 14,
        color: COLORS.textColor64,
    },
});
