import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';

const ISearchBar = ({ value, onChangeText = () => { }, searchIcon, placeholder = 'Search here', containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <FastImage
        source={searchIcon || IMAGES.IC_SEARCH}
        style={{ height: 24, width: 24 }}
        resizeMode="contain"
      />

      <TextInput
        value={value}
        onChangeText={text => onChangeText(text)}
        style={styles.inputStyle}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textColor44}
      />
    </View>
  );
};

export default ISearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderColor: COLORS.textColor44,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: Platform.OS == 'ios' ? 15 : 0,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    fontFamily: FONTS.BROTHER_1816_REGULAR,
    color: COLORS.textColor,
  },
});
