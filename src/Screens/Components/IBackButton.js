import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../../Common/Constants/colors';
import {IMAGES} from '../../Common/Constants/images';

const IBackButton = ({onPress = () => {}}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress()}>
      <FastImage
        source={IMAGES.IC_ARROW_LEFT}
        style={{height: 24, width: 24}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default IBackButton;

const styles = StyleSheet.create({
  container: {
    // marginTop: Platform.OS == 'android' ? 10 : 0,
    padding: 7,
    backgroundColor: COLORS.textColor14,
    width: 38,
    height: 38,
    borderRadius: 50,
  },
});
