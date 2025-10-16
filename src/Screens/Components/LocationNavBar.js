import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../../Common/Constants/colors';
import {FONTS} from '../../Common/Constants/fonts';
import {IMAGES} from '../../Common/Constants/images';

const LocationNavBar = () => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FastImage
          source={IMAGES.IC_LOCATION}
          style={{height: 24, width: 24}}
          resizeMode="contain"
        />
        <View style={{marginLeft: 7}}>
          <Text style={styles.titleText}>Science City Rd</Text>
          <Text style={styles.subtitleText}>Sola, Ahmedabad, Gujarat</Text>
        </View>
      </View>
      <View>
        <FastImage
          source={IMAGES.IC_BELL}
          style={{height: 24, width: 24}}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default LocationNavBar;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS == 'android' ? 10 : 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    color: COLORS.textColor,
    fontSize: 16,
    lineHeight: 22,
  },
  subtitleText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    color: COLORS.textColor64,
    fontSize: 12,
    lineHeight: 16,
  },
});
