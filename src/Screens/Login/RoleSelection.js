import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {safeAreaStyle} from '../../Common/CommonStyles';
import {COLORS} from '../../Common/Constants/colors';
import {FONTS} from '../../Common/Constants/fonts';
import {IMAGES} from '../../Common/Constants/images';
import {windowHeight, windowWidth} from '../../Utils/Dimentions';
import HightBox from '../Components/HightBox';
import IBackButton from '../Components/IBackButton';
import IButton from '../Components/IButton';
import {UpdateUserType} from '../../redux/auth/authActions';
import {useDispatch} from 'react-redux';
import {StorageKeys, localStorageHelper} from '../../Common/localStorageHelper';

var roles = [
  {
    id: 2,
    title: 'Architect / Interior',
    selected: true,
    img: IMAGES.IC_ARCHITECT,
  },
  {
    id: 3,
    title: 'Agency',
    selected: false,
    img: IMAGES.IC_AGENCY,
  },
  {
    id: 1,
    title: 'Customer',
    selected: false,
    img: IMAGES.IC_CUSTOMER,
  },
];

const RoleSelection = props => {
  const [role, setRole] = useState(roles);
  const [roleName, setRoleName] = useState('Architect / Interior');
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState('1');

  const dispatch = useDispatch();
  //CLICK EVENTS
  const onBackPress = () => {
    props.navigation.goBack();
  };

  const onContinue = () => {
    setLoading(true);
    dispatch(UpdateUserType({user_type: roleId, onSuccess, onFailure}));
  };

  const onSuccess = () => {
    setLoading(false);
    localStorageHelper
      .setStorageItem({key: StorageKeys.USER_TYPE, value: roleName})
      .then(res => {
        console.log('user type set success');
      });
    if (roleName == 'Architect / Interior') {
      props.navigation.replace('ArchitectStack');
    } else if (roleName == 'Customer') {
      props.navigation.replace('CustomerStack');
    } else if (roleName == 'Agency') {
      props.navigation.replace('AgencyStack');
    }
  };

  const onFailure = msg => {
    setLoading(false);
    alert(msg || 'Error');
  };

  const onRolePress = async (text, id) => {
    const role = roles.map(data => {
      if (data.title == text) {
        data.selected = true;
      } else {
        data.selected = false;
      }
      return data;
    });
    setRoleName(text);
    setRoleId(id);
    setRole(role);
  };

  //RENDER METHODS
  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.boxContainer,
          backgroundColor: item.selected ? COLORS.pr_blue : COLORS.white,
        }}
        onPress={() => onRolePress(item.title, item.id)}>
        <View
          style={{
            ...styles.iconContainer,
            backgroundColor: item.selected ? COLORS.white : COLORS.textColor14,
          }}>
          <FastImage
            source={item.img}
            style={{height: 30, width: 30}}
            resizeMode="contain"
          />
        </View>
        <HightBox height={10} />
        <Text
          style={{
            ...styles.boxText,
            color: item.selected ? COLORS.white : COLORS.textColor,
          }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={safeAreaStyle}>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{paddingHorizontal: 20}}>
          <IBackButton onPress={onBackPress} />
          <HightBox height={30} />
          <Text style={styles.titleText}>
            Hey there, down here 👋 Choose your role to continue
          </Text>

          <HightBox height={27} />

          <View style={{flexDirection: 'row'}}>
            {role.map(data => {
              return <RenderItem key={data.title} item={data} />;
            })}
          </View>
        </View>

        <View style={styles.bottomContainer}>
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
  );
};

export default RoleSelection;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    fontSize: 26,
    lineHeight: 34,
    color: COLORS.textColor,
    textAlign: 'center',
  },
  bottomContainer: {paddingHorizontal: 20, marginBottom: 30},
  boxContainer: {
    backgroundColor: COLORS.pr_blue,
    width: windowWidth / 3.55,
    height: windowHeight / 6,
    marginRight: 8,
    paddingTop: 25,
    alignItems: 'center',
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    height: 48,
    width: 48,
    borderRadius: 50,
  },
  boxText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 18,
  },
});
