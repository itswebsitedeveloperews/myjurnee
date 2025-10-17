import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const SectionHeader = ({ title, containerStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default SectionHeader;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 12,
    },
    title: {
        fontFamily: FONTS.OUTFIT_MEDIUM,
        fontSize: 12,
        color: COLORS.textColor64,
        letterSpacing: 1,
    },
});
