import React, {useState} from 'react';
import {ImageBackground, SafeAreaView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {safeAreaStyle} from '../../Common/CommonStyles';
import INavBar from '../Components/INavBar';
import HightBox from '../Components/HightBox';
import {IMAGES} from '../../Common/Constants/images';
import {windowHeight, windowWidth} from '../../Utils/Dimentions';
import FastImage from 'react-native-fast-image';
import ICameraButton from '../Components/ICameraButton';
import {COLORS} from '../../Common/Constants/colors';
import ITextField from '../Components/ITextField';
import {FONTS} from '../../Common/Constants/fonts';
import IButton from '../Components/IButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {saveUserDetails} from '../../redux/profile/profileActions';
import {useDispatch} from 'react-redux';
import {validateEmail} from '../../Utils/Utils';

const EditProfile = props => {
  const {userProfileData} = props.route?.params || {};
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userProfileData?.full_name || '');
  const [email, setEmail] = useState(userProfileData?.email || '');
  const [mobileNum, setMobileNum] = useState(userProfileData?.mobile || '');

  const dispatch = useDispatch();

  //CLICK EVENTS
  const onBackPress = () => {
    props.navigation.goBack();
  };
  const onSaveChanges = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!name) {
      alert('Please Add Name!');
    } else if (!email) {
      alert('Please Add Email!');
    } else if (!regex.test(email)) {
      alert('Please Add Valid Email!');
    } else if (!mobileNum) {
      alert('Please Add Mobile Number!');
    } else {
      setLoading(true);
      dispatch(saveUserDetails({name, email, mobileNum, onSuccess, onFailure}));
    }
  };

  const onSuccess = () => {
    setLoading(false);
    onBackPress();
  };

  const onFailure = () => {
    setLoading(false);
  };

  return (
    <SafeAreaView style={safeAreaStyle}>
      <View style={{paddingHorizontal: 20}}>
        <INavBar title="Edit profile" onBackPress={onBackPress} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          scrollEnabled={true}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 20, flex: 1}}>
            <HightBox height={10} />
            <ImageBackground
              source={IMAGES.IC_PROFILE_DOTS}
              resizeMode="contain"
              style={styles.imgBackground}>
              <View style={{borderRadius: 50}}>
                <FastImage
                  source={require('../../assets/temp/profileTemp.png')}
                  style={styles.img}
                  resizeMode="contain"
                />
                <View style={styles.cameraBtn}>
                  <ICameraButton />
                </View>
              </View>
            </ImageBackground>
            {/* <HightBox height={22} /> */}
            <Text style={styles.subTitleText}>Full name</Text>
            <ITextField
              value={name}
              onChangeText={text => setName(text)}
              mainViewStyle={{
                marginTop: 5,
              }}
            />
            <HightBox height={24} />
            <Text style={styles.subTitleText}>Email address</Text>
            <ITextField
              value={email}
              onChangeText={text => setEmail(text)}
              mainViewStyle={{
                marginTop: 5,
              }}
              keyboardType={'email-address'}
            />
            <HightBox height={24} />
            <Text style={styles.subTitleText}>Mobile number</Text>
            <ITextField
              value={mobileNum}
              onChangeText={text => setMobileNum(text)}
              mainViewStyle={{
                marginTop: 5,
              }}
              keyboardType={'numeric'}
              maxLength={10}
            />
            <HightBox height={25} />
          </View>
          <View style={{height: '23%'}} />
          <View style={styles.bottomContainer}>
            <View style={{}}>
              <IButton
                title={'Save changes'}
                onPress={onSaveChanges}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  imgBackground: {
    height: windowHeight / 4,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 50,
  },
  subTitleText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textColor64,
  },
  bottomContainer: {paddingHorizontal: 20, marginBottom: 10},
});
