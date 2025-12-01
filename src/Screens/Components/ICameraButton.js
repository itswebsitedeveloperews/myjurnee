import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { IMAGES } from '../../Common/Constants/images';

const ICameraButton = ({ onPress = () => { } }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress()}>
      <FastImage
        source={IMAGES.IC_CAMERA}
        style={{ height: 18, width: 18 }}
        resizeMode="contain"
      // tintColor={COLORS.white}
      />
    </TouchableOpacity>
  );
};

export default ICameraButton;

const styles = StyleSheet.create({
  container: {
    padding: 6,
    backgroundColor: COLORS.purple,
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});
