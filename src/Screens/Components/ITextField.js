import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import FastImage from 'react-native-fast-image';

const ITextField = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused,
      { borderColor: isFocused ? COLORS.purple : COLORS.textColor64 },
      backgroundColor && { backgroundColor },
      mainViewStyle
    ]}>
      {leftIcon && (
        <View style={styles.leftIconContainer}>
          <FastImage
            source={leftIcon}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        </View>
      )}
      <TextInput
        style={[
          styles.inputStyle,
          leftIcon && styles.inputWithLeftIcon,
          backgroundColor && styles.inputDark
        ]}
        value={value}
        onChangeText={text => onChangeText(text)}
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
      {rightIcon && (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={onRightIconPress}
          activeOpacity={0.7}>
          <FastImage
            source={rightIcon}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ITextField;

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
  },
  containerFocused: {
    borderColor: COLORS.purple,
    borderWidth: 1,
  },
  inputStyle: {
    flex: 1,
    paddingHorizontal: 12,
    fontFamily: FONTS.OUTFIT_REGULAR,
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
    paddingLeft: 12,
    paddingRight: 8,
  },
  rightIconContainer: {
    paddingRight: 12,
    paddingLeft: 8,
  },
  iconStyle: {
    height: 20,
    width: 20,
  },
});
