import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { COLORS } from '../../Common/Constants/colors';
import { IMAGES } from '../../Common/Constants/images';
import ProfileBox from '../Components/ProfileBox';
import MenuItem from '../Components/MenuItem';
import SectionHeader from '../Components/SectionHeader';
import IButton from '../Components/IButton';
import { LogUserOut } from '../../redux/auth/authActions';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';

const Profile = props => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userData, setUserData] = useState({
    username: 'educatebystw',
    handle: '@educatebystw',
    profileImage: IMAGES.IC_USER_PROFILE, // Using user icon as placeholder
  });

  useEffect(() => {
    checkAuthentication();
  }, [])

  const checkAuthentication = async () => {
    try {
      const isLoggedIn = await localStorageHelper.getItemFromStorage(StorageKeys.IS_LOGGED);
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
        getUserDetailsFromLocalStorage();
      } else {
        setIsAuthenticated(false);

      }
    } catch (error) {
      console.log('Error checking authentication:', error);
    }
  };

  const getUserDetailsFromLocalStorage = () => {
    localStorageHelper
      .getItemsFromStorage([StorageKeys.USER_NAME, StorageKeys.USER_NICKNAME])
      .then(resp => {
        console.log('resp', resp);
        let userName = resp[StorageKeys.USER_NAME];
        let userNickName = resp[StorageKeys.USER_NICKNAME];

        setUserData({
          username: userName,
          handle: `@${userNickName || ''}`,
          profileImage: IMAGES.IC_USER_PROFILE,
        })
      });
  }

  const onSettingsPress = () => {
    // Navigate to settings screen
    // props.navigation.navigate('Settings');
    console.log('Settings pressed');
  };

  const onBuildBoxPress = () => {
    // Navigate to build a box screen
    // props.navigation.navigate('BuildBox');
    console.log('Build a box pressed');
  };

  const onMyLibraryPress = () => {
    // Navigate to my library screen
    // props.navigation.navigate('MyLibrary');
    console.log('My Library pressed');
  };

  const onProfileBoxClick = () => {
    props.navigation.navigate('EditProfile')
  }

  const onLogoutPress = () => {
    dispatch(LogUserOut({
      onSuccess: () => {
        // Navigate to AuthStack after successful logout
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'AuthStack' }],
        });
      },
      onFailure: (error) => {
        console.log('Logout failed:', error);
        // You can show an alert or toast here if needed
      }
    }));
  };

  return (
    <SafeAreaView style={[safeAreaStyle, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Box */}
        {isAuthenticated && <ProfileBox
          profileImage={userData.profileImage}
          username={userData.username}
          handle={userData.handle}
          onPress={onProfileBoxClick}
        />}

        {/* APP SETTINGS Section */}
        <SectionHeader title="APP SETTINGS" />
        <MenuItem
          icon={IMAGES.IC_SETTINGS}
          title="Settings"
          onPress={onSettingsPress}
        />

        {/* SHAKE THAT WEIGHT SHOP Section */}
        <SectionHeader title="SHAKE THAT WEIGHT SHOP" />
        <MenuItem
          icon={IMAGES.IC_SHOPPING_BASKET}
          title="Build a box"
          onPress={onBuildBoxPress}
        />
        <MenuItem
          icon={IMAGES.IC_LIBRARY}
          title="My Library"
          onPress={onMyLibraryPress}
        />

        {/* Logout Button */}
        {
          isAuthenticated &&
          <View style={styles.logoutContainer}>
            <IButton
              title="Logout"
              onPress={onLogoutPress}
              customContainer={styles.logoutButton}
            />
          </View>}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg_color,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  logoutContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#FF4444', // Red color for logout button
  },
});
