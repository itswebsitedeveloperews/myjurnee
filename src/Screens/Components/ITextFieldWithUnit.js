// ITextFieldWithUnit.js
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const ITextFieldWithUnit = ({
    mainViewStyle,
    value,
    onChangeText = () => { },
    numberOfLines,
    placeholder,
    keyboardType,
    autoCapitalize,
    maxLength,
    onSubmitEditing,
    multiline = false,
    leftIcon,
    rightIcon,
    onRightIconPress,
    secureTextEntry = false,
    placeholderTextColor = COLORS.black,
    backgroundColor,
    showUnitToggle = false,        // NEW: when true shows kg/lbs toggle
    unit: unitProp,                // optional controlled prop ('kg' | 'lbs')
    onUnitChange = () => { },       // callback when unit changes
    defaultUnit = 'kg',            // default if uncontrolled
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [unit, setUnit] = useState(unitProp ?? defaultUnit);

    // keep internal state in sync when controlled
    useEffect(() => {
        if (unitProp) setUnit(unitProp);
    }, [unitProp]);

    function handleUnitChange(next) {
        if (unitProp) {
            // controlled - forward only
            onUnitChange(next);
        } else {
            setUnit(next);
            onUnitChange(next);
        }
    }

    const renderRight = () => {
        if (showUnitToggle) {
            return (
                <View style={styles.unitWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleUnitChange('lbs')}
                        style={[
                            styles.unitBtn,
                            unit === 'lbs' ? styles.unitBtnActive : styles.unitBtnInactiveLeft,
                        ]}
                    >
                        <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>LBS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleUnitChange('kg')}
                        style={[
                            styles.unitBtn,
                            unit === 'kg' ? styles.unitBtnActiveRight : styles.unitBtnInactiveRight,
                        ]}
                    >
                        <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>KG</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    return (
        <View
            style={[
                styles.container,
                isFocused && styles.containerFocused,
                { borderColor: isFocused ? COLORS.purple : COLORS.textColor64 },
                backgroundColor && { backgroundColor },
                mainViewStyle,
            ]}
        >
            {leftIcon && (
                <View style={styles.leftIconContainer}>
                    <FastImage source={leftIcon} style={styles.iconStyle} resizeMode="contain" />
                </View>
            )}

            <TextInput
                style={[
                    styles.inputStyle,
                    leftIcon && styles.inputWithLeftIcon,
                    backgroundColor && styles.inputDark,
                ]}
                value={value}
                onChangeText={(text) => onChangeText(text)}
                numberOfLines={numberOfLines}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                maxLength={maxLength}
                onSubmitEditing={onSubmitEditing}
                multiline={multiline}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {renderRight()}
        </View>
    );
};

export default ITextFieldWithUnit;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 56,
        borderColor: COLORS.textColor64,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    containerFocused: {
        borderColor: COLORS.purple,
        borderWidth: 1,
    },
    inputStyle: {
        flex: 1,
        // paddingHorizontal: 8,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        fontSize: 16,
        color: COLORS.black,
    },
    inputDark: {
        color: COLORS.black,
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    leftIconContainer: {
        paddingLeft: 4,
        paddingRight: 8,
    },
    rightIconContainer: {
        paddingRight: 8,
        paddingLeft: 8,
    },
    iconStyle: {
        height: 20,
        width: 20,
    },

    /* Unit toggle */
    unitWrapper: {
        // small pill container on right
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 4,
        // subtle background behind selected area (so both segments fit inside)
        backgroundColor: COLORS.purple ?? '#7C3AED22', // fallback if not in COLORS
        // keep it visually inside the input; spacing
        marginLeft: 8,
        height: 45,

    },
    unitBtn: {
        minWidth: 46,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    unitBtnActive: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
    },
    // when left not selected we show transparent so pill looks split
    unitBtnInactiveLeft: {
        backgroundColor: 'transparent',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    // when right not selected show white rounded
    unitBtnInactiveRight: {
        // backgroundColor: COLORS.white,
        borderRadius: 8,
    },
    unitBtnActiveRight: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
    },
    unitText: {
        fontSize: 13,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.white,
    },
    unitTextActive: {
        color: COLORS.black,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
    },
});
