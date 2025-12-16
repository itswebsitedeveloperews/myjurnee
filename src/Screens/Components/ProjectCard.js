import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import { windowHeight } from '../../Utils/Dimentions';
import HightBox from './HightBox';

const ProjectCard = ({ onPress = () => { }, data = {} }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(data)}>
      <FastImage
        source={require('../../assets/temp/agencyPic.png')}
        style={styles.img}
        resizeMode="cover"
      />
      <View style={{ padding: 14 }}>
        <Text style={styles.title}>{data?.project_name || ''}</Text>
        <HightBox height={14} />
        <View style={styles.row}>
          <FastImage
            source={IMAGES.IC_LOCATION}
            style={{ height: 16, width: 16, marginTop: 2 }}
            resizeMode="contain"
          />

          <View style={{ width: '90%', marginLeft: 10 }}>
            <Text style={styles.address}>{data?.location || ''}</Text>
          </View>
        </View>

        <HightBox height={14} />

        <View style={styles.row}>
          <FastImage
            source={IMAGES.IC_USER}
            style={{ height: 16, width: 16, marginTop: 1 }}
            resizeMode="contain"
          />

          <View style={{ width: '90%', marginLeft: 10 }}>
            <Text style={styles.address}>
              Client: {data?.client_name || ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    marginRight: 5,
  },
  img: {
    height: windowHeight / 6,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontFamily: FONTS.BROTHER_1816_MEDIUM,
    color: COLORS.textColor,
    fontSize: 16,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
  },
  address: {
    fontFamily: FONTS.BROTHER_1816_REGULAR,
    color: COLORS.grayText,
    fontSize: 14,
    // lineHeight: 22,
  },
});
