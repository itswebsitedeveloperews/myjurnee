import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { FONTS } from '../../Common/Constants/fonts';
import { COLORS } from '../../Common/Constants/colors';
import HightBox from '../Components/HightBox';
import { IMAGES } from '../../Common/Constants/images';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData } from '../../redux/profile/profileActions';
import { logoutAction } from '../../redux/auth/authActions';

const profileData = [
  {
    id: 1,
    title: 'Selected agencies list',
    subTitle: 'View your selected agencies for projects',
    logo: IMAGES.IC_BRIEFCASE,
  },
  {
    id: 2,
    title: 'Past projects',
    subTitle: 'See your past completed projects',
    logo: IMAGES.IC_FILE,
  },
  {
    id: 3,
    title: 'Account',
    subTitle: 'Manage your account related information',
    logo: IMAGES.IC_USER,
  },
  {
    id: 4,
    title: 'Logout',
    subTitle: 'Logout from your Okay account on this device',
    logo: IMAGES.IC_LOGOUT,
  },
];

const Profile = props => {
  // const [loading, setLoading] = useState(false);
  // const [userType, setUserType] = useState('');
  // const dispatch = useDispatch();

  // const userProfileData = useSelector(
  //   state => state.profile?.profileData || {},
  // );

  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(getProfileData({onSuccess, onFailure}));

  //   localStorageHelper
  //     .getItemFromStorage(StorageKeys.USER_TYPE)
  //     .then(async type => {
  //       setUserType(type);
  //     });
  // }, []);

  // const onSuccess = () => {
  //   setLoading(false);
  // };

  // const onFailure = () => {
  //   setLoading(false);
  // };

  // const onSuccessLogout = () => {
  //   localStorageHelper.clearStorage().then(resp => {
  //     console.log('Logout done');
  //     props.navigation.replace('Splash');
  //   });
  // };
  // const onFailureLogout = () => {};

  // //CLICK EVENTS
  // const onEditProfile = () => {
  //   props.navigation.navigate('EditProfile', {userProfileData});
  // };

  // const onLogout = () => {
  //   dispatch(
  //     logoutAction({onSuccess: onSuccessLogout, onFailure: onFailureLogout}),
  //   );
  // };

  // const onProfileSettingClick = id => {
  //   switch (id) {
  //     case 1:
  //       props.navigation.navigate('SelectedAgencies');
  //       break;
  //     case 2:
  //       props.navigation.navigate('PastProjects');
  //       break;
  //     case 3:
  //       props.navigation.navigate('AccountDelete');
  //       break;
  //     case 4:
  //       onLogout();
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // //RENDER METHOD
  // const renderProfileContainer = () => {
  //   return (
  //     <View style={styles.profileContainer}>
  //       <FastImage
  //         source={require('../../assets/temp/profileTemp.png')}
  //         style={styles.img}
  //         resizeMode="contain"
  //       />
  //       <View style={{...styles.rightContainer, marginLeft: 12}}>
  //         <Text style={styles.title} numberOfLines={1}>
  //           {userProfileData?.full_name || 'Name'}
  //         </Text>
  //         <Text style={styles.subTitle} numberOfLines={1}>
  //           {userType || 'Architect / Interior'}
  //         </Text>
  //       </View>
  //       <View>
  //         <TouchableOpacity
  //           style={styles.editBtn}
  //           onPress={() => onEditProfile()}>
  //           <FastImage
  //             source={IMAGES.IC_PENCIL}
  //             style={{height: 13, width: 13}}
  //             resizeMode="contain"
  //           />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };

  // const renderProfileItems = ({item}) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => onProfileSettingClick(item.id)}
  //       style={{...styles.profileContainer, alignItems: 'flex-start'}}>
  //       <FastImage
  //         source={item.logo}
  //         style={{height: 24, width: 24}}
  //         resizeMode="contain"
  //       />
  //       <View style={styles.profileRightContainer}>
  //         <View style={[styles.rightContainer]}>
  //           <Text style={styles.title} numberOfLines={1}>
  //             {item.title}
  //           </Text>
  //           <HightBox height={8} />
  //           <Text style={styles.subTitle} numberOfLines={1}>
  //             {item.subTitle}
  //           </Text>
  //         </View>
  //         <View>
  //           <FastImage
  //             source={IMAGES.IC_ARROW_DOWN}
  //             style={{height: 24, width: 24, transform: [{rotate: '-90deg'}]}}
  //             resizeMode="contain"
  //           />
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  // const renderProfileSettings = () => {
  //   return (
  //     <FlatList
  //       data={profileData}
  //       renderItem={renderProfileItems}
  //       keyExtractor={({id}) => id.toString()}
  //       style={{flex: 1}}
  //       showsVerticalScrollIndicator={false}
  //       scrollEnabled={false}
  //       ItemSeparatorComponent={() => <HightBox height={15} />}
  //       // ListFooterComponent={() => <HightBox height={15} />}
  //     />
  //   );
  // };

  return (
    <SafeAreaView style={safeAreaStyle}>
      <Text>Profile</Text>
      {/* <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <HightBox height={30} />
        {renderProfileContainer()}
        <View style={styles.border} />
        <Text style={styles.title}>Profile settings</Text>
        <HightBox height={22} />
        {renderProfileSettings()}
        <Text style={styles.versionText}>Okay v1.0</Text>
        <HightBox height={30} />
      </View> */}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    color: COLORS.textColor,
    fontSize: 18,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(16, 22, 35, 0.12)',
    borderBottomWidth: 1,
    marginLeft: 12,
    paddingBottom: 20,
  },
  img: {
    height: 64,
    width: 64,
    borderRadius: 50,
  },
  rightContainer: {
    flex: 1,
  },
  subTitle: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    color: COLORS.textColor,
    fontSize: 14,
  },
  editBtn: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderColor: 'rgba(0, 100, 229, 0.12)',
    borderWidth: 1,
    padding: 12,
  },
  border: {
    borderColor: 'rgba(16, 22, 35, 0.12)',
    borderWidth: 1,
    marginVertical: 20,
  },
  versionText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    color: COLORS.textColor64,
    fontSize: 12,
    textAlign: 'center',
  },
});
