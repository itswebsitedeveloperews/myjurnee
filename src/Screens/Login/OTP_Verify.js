import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {safeAreaStyle} from '../../Common/CommonStyles';
import {COLORS} from '../../Common/Constants/colors';
import {FONTS} from '../../Common/Constants/fonts';
import HightBox from '../Components/HightBox';
import IBackButton from '../Components/IBackButton';
import IButton from '../Components/IButton';
import {useDispatch} from 'react-redux';
import {VerifyOTP} from '../../redux/auth/authActions';
import {setAgencyDocData} from '../../redux/agency/agencySlice';
import {setAgencyProjectData} from '../../redux/agency/agencySlice';

const CELL_COUNT = 4;

const OTP_Verify = props => {
  const {mobileNum} = props.route.params || {};

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  //CLICK EVENTS
  const onBackPress = () => {
    props.navigation.goBack();
  };

  const onVerify = () => {
    if (!value) {
      alert('Please Enter OTP');
    } else if (value.length !== 4) {
      alert('Please Enter valid OTP');
    } else {
      setLoading(true);
      dispatch(VerifyOTP({mobileNum, otpValue: value, onSuccess, onFailure}));
    }
  };

  const onSuccess = data => {
    setLoading(false);
    if (data?.user_type_name !== null) {
      if (data?.user_type_name == 'Architect / Interior') {
        props.navigation.replace('ArchitectStack', {
          initialRoute: 'ArchitectBottomTab',
        });
      } else if (data?.user_type_name == 'Customer') {
        props.navigation.replace('CustomerStack', {
          initialRoute: 'CustomerBottomTab',
        });
      } else if (data?.user_type_name == 'Agency') {
        var route = 'PurchasePlan';
        if (data?.payment_status == '0' && data?.flag == '3') {
          route = 'AgencyBottomTab';
        } else if (data?.payment_status == '0' && data?.flag == '1') {
          route = 'Documents';
          const data = {
            agencyName: 'temp',
          };
          dispatch(setAgencyDocData(data));
        } else if (data?.payment_status == '0' && data?.flag == '2') {
          route = 'Documents';
          const data = {
            projectName: 'temp',
          };
          dispatch(setAgencyProjectData(data));
        }
        props.navigation.replace('AgencyStack', {
          initialRoute: route,
        });
      }
    } else {
      props.navigation.navigate('RoleSelection');
    }
  };

  const onFailure = msg => {
    setLoading(false);
    alert(msg || 'Error');
  };

  return (
    <SafeAreaView style={safeAreaStyle}>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{paddingHorizontal: 20}}>
          <IBackButton onPress={onBackPress} />
          <HightBox height={30} />
          <Text style={styles.titleText}>We just sent you an OTP</Text>
          <Text style={styles.subTitleText}>
            To log in, enter the security code we sent to{'\n'}*******
            {mobileNum ? mobileNum.substr(mobileNum.length - 4) : 1234}.
          </Text>
          <HightBox height={27} />

          <CodeField
            ref={ref}
            {...prop}
            value={value}
            onChangeText={setValue}
            // onSubmitEditing={() => checking()}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          <HightBox height={20} />
          <TouchableOpacity style={{width: '40%', paddingVertical: 5}}>
            <Text
              style={{
                fontFamily: FONTS.OUTFIT_REGULAR,
                fontSize: 14,
                color: COLORS.pr_blue,
                textDecorationLine: 'underline',
              }}>
              I didn’t receive a code
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <View style={{marginTop: 30}}>
            <IButton title={'Verify'} onPress={onVerify} loading={loading} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTP_Verify;

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
    backgroundColor: COLORS.white,
  },
  codeText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 16,
    color: COLORS.textColor,
  },
  bottomContainer: {paddingHorizontal: 20, marginBottom: 30},
  //CODE FIELD
  codeFieldRoot: {
    width: '70%',
    alignSelf: 'center',
  },
  cellRoot: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.textColor64,
    borderWidth: 1,
    borderRadius: 10,
  },
  cellText: {
    color: COLORS.textColor,
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 25,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: COLORS.textColor,
    borderWidth1: 1.5,
  },
});
