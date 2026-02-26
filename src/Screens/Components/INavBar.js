import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { windowWidth } from '../../Utils/Dimentions';
import IBackButton from './IBackButton';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';

const INavBar = ({ onBackPress = () => { }, title = '', EmptyBackButton = false, showCalendar = false, onCalendarPress = () => { } }) => {
  return (
    <View style={styles.container}>
      {EmptyBackButton ? <View style={styles.EmptyBackButton} /> : <IBackButton onPress={onBackPress} />}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showCalendar ? (
        <TouchableOpacity onPress={onCalendarPress} style={styles.calendarButton}>
          {/* <Text style={styles.calendarIcon}>📅</Text> */}
          <FastImage source={IMAGES.IC_CALENDAR} style={styles.calendarIcon} resizeMode="contain" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: windowWidth / 10.5 }} />
      )}
    </View>
  );
};

export default INavBar;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS == 'android' ? 10 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  EmptyBackButton: {
    // marginTop: Platform.OS == 'android' ? 10 : 0,
    // padding: 7,
    width: 38,
    height: 38,
    borderRadius: 50,
  },
  title: {
    fontFamily: FONTS.BROTHER_1816_MEDIUM,
    color: COLORS.textColor,
    fontSize: 18,
  },
  calendarButton: {
    width: 38,
    height: 38,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    height: 20,
    width: 20,
  },
});
