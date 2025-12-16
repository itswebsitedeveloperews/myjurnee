import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import { windowHeight } from '../../Utils/Dimentions';
import { ASSET_URL } from '../../Environment';
import { noImag } from '../../Utils/Utils';

const AgencyCard = ({
  onViewAgency = () => { },
  onChooseAgency = () => { },
  data = {},
}) => {
  return (
    <TouchableOpacity style={styles.container} disabled>
      <FastImage
        source={{ uri: `${ASSET_URL}${data?.agency_image} || ${noImag}` }}
        style={styles.img}
        resizeMode="cover"
      />
      <View style={styles.rightContainer}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {data?.agency_name || ''}
          </Text>
          <Text style={styles.subTitle} numberOfLines={1}>
            Year of working: 2 yrs
          </Text>
          <View style={styles.ratingRow}>
            <FastImage
              source={IMAGES.IC_STAR}
              style={{ height: 14, width: 14 }}
              resizeMode="contain"
            />
            <Text style={styles.ratingText}> 4.9 </Text>
            <Text style={styles.rating}>Rating </Text>
          </View>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.filledBtn]}
            onPress={() => onChooseAgency(data)}>
            <Text style={styles.btnText} numberOfLines={1}>
              {'Choose this'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.unfilledBtn]}
            onPress={() => onViewAgency(data)}>
            <FastImage
              source={IMAGES.IC_EYE}
              style={{ height: 16, width: 16, marginRight: 5 }}
              resizeMode="contain"
            />
            <Text style={styles.title}>{'View'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AgencyCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    // height: windowHeight / 5.9,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    marginRight: 5,
  },
  img: {
    height: '100%',
    width: '35%',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  rightContainer: {
    marginHorizontal: 12,
    marginRight: 15,
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  title: {
    fontFamily: FONTS.BROTHER_1816_MEDIUM,
    color: COLORS.textColor,
    fontSize: 16,
    lineHeight: 18,
  },
  subTitle: {
    fontFamily: FONTS.BROTHER_1816_REGULAR,
    color: COLORS.textColor64,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontFamily: FONTS.BROTHER_1816_MEDIUM,
    color: COLORS.textColor,
    fontSize: 14,
    lineHeight: 18,
  },
  rating: {
    fontFamily: FONTS.BROTHER_1816_REGULAR,
    color: COLORS.textColor,
    fontSize: 14,
    lineHeight: 18,
  },
  btnRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filledBtn: {
    backgroundColor: COLORS.pr_blue,
    // height: 35,
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  unfilledBtn: {
    backgroundColor: COLORS.white,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 5,
    borderColor: COLORS.pr_blue,
    borderWidth: 1,
    flexDirection: 'row',
  },
  btnText: {
    fontFamily: FONTS.BROTHER_1816_MEDIUM,
    fontSize: 14,
    color: COLORS.white,
  },
});
