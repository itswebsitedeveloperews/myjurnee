import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const SectionHeader = ({ title, containerStyle, required = true }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.title}>{title} {required && <Text style={styles.requiredText}>*</Text>}</Text>

        </View>
    );
};

export default SectionHeader;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    title: {
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontSize: 16,
        color: COLORS.textColorSection,
    },
    requiredText: {
        color: COLORS.red,
    },
});
