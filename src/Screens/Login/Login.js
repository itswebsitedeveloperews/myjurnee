import React, {useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {safeAreaStyle} from '../../Common/CommonStyles';
import {COLORS} from '../../Common/Constants/colors';
import {FONTS} from '../../Common/Constants/fonts';
import {IMAGES} from '../../Common/Constants/images';
import HightBox from '../Components/HightBox';
import IButton from '../Components/IButton';
import ITextField from '../Components/ITextField';
import {LogUserIn} from '../../redux/auth/authActions';
import {useDispatch} from 'react-redux';

const Login = props => {
  const [mobileNum, setMobileNum] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onContinue = () => {
    if (!mobileNum) {
      alert('Please Enter mobile num');
    } else if (mobileNum.length !== 10) {
      alert('Please Enter valid mobile num');
    } else {
      setLoading(true);
      dispatch(
        LogUserIn({mobileNum, onSuccess: onSuccess, onFailure: onFailure}),
      );
    }
  };

  const onSuccess = data => {
    alert(data.otp);
    setLoading(false);
    props.navigation.navigate('OTP_Verify', {mobileNum});
  };

  const onFailure = () => {
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={safeAreaStyle}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={{paddingHorizontal: 20, paddingTop: 70}}>
            <Text style={styles.titleText}>Enter your mobile number</Text>
            <Text style={styles.subTitleText}>
              We’ll send you an OTP on given mobile number
            </Text>
            <HightBox height={27} />
            <Text style={styles.subTitleText}>Your mobile number</Text>

            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View style={styles.countryCode}>
                <Text style={styles.codeText}>+91</Text>
                <FastImage
                  source={IMAGES.IC_CHEVRON_RIGHT}
                  style={{height: 20, width: 20, marginLeft: 5}}
                  resizeMode="contain"
                />
              </View>
              <ITextField
                keyboardType="phone-pad"
                onChangeText={text => setMobileNum(text)}
                value={mobileNum}
                maxLength={10}
                mainViewStyle={{
                  backgroundColor: COLORS.pr_background,
                  marginLeft: 7,
                }}
              />
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>
              By registering, you accept our{' '}
              <Text style={styles.underlineText}>Terms of Use</Text> and{' '}
              <Text style={styles.underlineText}>Privacy Policy</Text>
            </Text>
            <View style={{marginTop: 30}}>
              <IButton
                title={'Continue'}
                onPress={onContinue}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    fontSize: 26,
    lineHeight: 34,
    color: COLORS.textColor,
  },
  subTitleText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textColor64,
    marginTop: 8,
  },
  countryCode: {
    height: 48,
    borderColor: COLORS.textColor64,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.pr_background,
  },
  codeText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 16,
    color: COLORS.textColor,
  },
  bottomContainer: {paddingHorizontal: 20, marginBottom: 30},
  bottomText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 15,
    color: COLORS.textColor,
  },
  underlineText: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    textDecorationLine: 'underline',
  },
});
