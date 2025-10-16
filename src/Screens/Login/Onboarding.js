import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../../Common/Constants/colors';
import {IMAGES} from '../../Common/Constants/images';
import {FONTS} from '../../Common/Constants/fonts';

const Onboarding = props => {
  const [onBoarding1, setOnBoarding1] = useState(true);
  const [onBoarding2, setOnBoarding2] = useState(false);
  const [onBoarding3, setOnBoarding3] = useState(false);

  //CLICK EVENTS

  const onPressFirstOnBoardBtn = () => {
    setOnBoarding1(false);
    setOnBoarding2(true);
  };

  const onPressSecondOnBoardBtn = () => {
    setOnBoarding2(false);
    setOnBoarding3(true);
  };

  const onPressThirdOnBoardBtn = () => {
    props.navigation.replace('Login');
  };

  // RENDER METHODS

  const renderOnBoarding1 = () => {
    return (
      <>
        <Text style={styles.titleFont}>
          Track your project and reflect on your day
        </Text>
        <Text style={styles.subTitleFont}>
          Get an overview of how you are performing and motivate yourself to
          achieve even moew.
        </Text>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressFirstOnBoardBtn()}>
            <FastImage
              source={IMAGES.IC_ARROW_RIGHT}
              resizeMode="contain"
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderOnBoarding2 = () => {
    return (
      <>
        <Text style={styles.titleFont}>
          Track your project and reflect on your day 2
        </Text>
        <Text style={styles.subTitleFont}>
          Get an overview of how you are performing and motivate yourself to
          achieve even moew.
        </Text>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressSecondOnBoardBtn()}>
            <FastImage
              source={IMAGES.IC_ARROW_RIGHT}
              resizeMode="contain"
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderOnBoarding3 = () => {
    return (
      <>
        <Text style={styles.titleFont}>
          Track your project and reflect on your day 3
        </Text>
        <Text style={styles.subTitleFont}>
          Get an overview of how you are performing and motivate yourself to
          achieve even moew.
        </Text>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressThirdOnBoardBtn()}>
            <FastImage
              source={IMAGES.IC_ARROW_RIGHT}
              resizeMode="contain"
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topContainer}>
        <FastImage
          source={IMAGES.IC_ONBOARDING_TOP}
          resizeMode="contain"
          style={{height: '100%', width: '100%'}}
        />
      </View>
      <View style={styles.bottomContainer}>
        {onBoarding1
          ? renderOnBoarding1()
          : onBoarding2
          ? renderOnBoarding2()
          : onBoarding3
          ? renderOnBoarding3()
          : null}
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.onBoardingBG,
  },
  topContainer: {
    flex: 0.5,
    backgroundColor: COLORS.onBoardingBG,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    flex: 0.5,
    backgroundColor: COLORS.pr_background,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  titleFont: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    fontSize: 26,
    color: COLORS.textColor,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 33,
  },
  subTitleFont: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 21,
    color: COLORS.textColor,
    paddingHorizontal: 30,
  },
  button: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.pr_blue,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
