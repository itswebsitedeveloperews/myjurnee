import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import { windowHeight } from '../../Utils/Dimentions';
import { ASSET_URL } from '../../Environment';

const AgencyTypeCard = ({ data, onViewAgency = () => { } }) => {
  const { agency_image, agency_name } = data || {};
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onViewAgency(data)}>
      <FastImage
        source={{ uri: `${ASSET_URL}${agency_image}` }}
        style={styles.img}
        resizeMode="cover"
      />
      <View style={styles.rightContainer}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {agency_name}
          </Text>
          <Text style={styles.subTitle} numberOfLines={1}>
            Type : Interior design{' '}
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
      </View>
      <View style={{ justifyContent: 'center', paddingRight: 14 }}>
        <FastImage
          source={IMAGES.IC_ARROW_DOWN}
          style={{ height: 24, width: 24, transform: [{ rotate: '-90deg' }] }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

export default AgencyTypeCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    // height: windowHeight / 8.7,
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
    fontFamily: FONTS.URBANIST_MEDIUM,
    color: COLORS.textColor,
    fontSize: 16,
    lineHeight: 18,
  },
  subTitle: {
    fontFamily: FONTS.URBANIST_REGULAR,
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
    fontFamily: FONTS.URBANIST_MEDIUM,
    color: COLORS.textColor,
    fontSize: 14,
    lineHeight: 18,
  },
  rating: {
    fontFamily: FONTS.URBANIST_REGULAR,
    color: COLORS.textColor,
    fontSize: 14,
    lineHeight: 18,
  },
});
