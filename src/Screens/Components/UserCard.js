import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import { windowHeight } from '../../Utils/Dimentions';

const UserCard = ({ onViewCustomer = () => { }, data }) => {
  return (
    <TouchableOpacity style={styles.container} disabled>
      <FastImage
        source={require('../../assets/temp/tempprofilePic.png')}
        style={styles.img}
        resizeMode="stretch"
      />
      <View style={styles.rightContainer}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {data?.full_name || ''}
          </Text>
          <Text style={styles.subTitle} numberOfLines={2}>
            {data?.address || ''}
          </Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.unfilledBtn]}
            onPress={() => onViewCustomer(data)}>
            <FastImage
              source={IMAGES.IC_EYE}
              style={{ height: 16, width: 16, marginRight: 5 }}
              resizeMode="contain"
            // tintColor={COLORS.pr_blue}
            />
            <Text style={styles.btnText}>{'View'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

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

  btnRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  unfilledBtn: {
    backgroundColor: COLORS.white,
    // width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 20,
    borderColor: COLORS.pr_blue,
    borderWidth: 1,
    paddingVertical: 7,
    flexDirection: 'row',
  },
  btnText: {
    fontFamily: FONTS.BROTHER_1816_MEDIUM,
    fontSize: 14,
    color: COLORS.pr_blue,
  },
});
