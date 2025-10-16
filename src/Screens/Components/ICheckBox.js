import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../../Common/Constants/images';

const ICheckBox = ({value = false, onCheckClick = () => {}, disabled}) => {
  const getImage = () => {
    if (value) {
      return (
        <FastImage
          source={IMAGES.FILLED_CHECKBOX}
          style={styles.img}
          resizeMode="contain"
        />
      );
    }
    return (
      <FastImage
        source={IMAGES.UNFILLED_CHECKBOX}
        style={styles.img}
        resizeMode="contain"
      />
    );
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onCheckClick()}
      disabled={disabled}
      activeOpacity={0.7}>
      {getImage()}
    </TouchableOpacity>
  );
};

export default ICheckBox;

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
  },
  img: {
    height: 20,
    width: 20,
  },
});
