import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { COLORS } from '../../Common/Constants/colors';
import { IMAGES } from '../../Common/Constants/images';
import ProfileBox from '../Components/ProfileBox';
import MenuItem from '../Components/MenuItem';
import SectionHeader from '../Components/SectionHeader';
import IButton from '../Components/IButton';
import DeleteAccountModal from '../Components/DeleteAccountModal';
import Snackbar from '../Components/Snackbar';
import { DeleteUserAccount, LogUserOut } from '../../redux/auth/authActions';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';

const Profile = props => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const profileData = useSelector(state => state.profile?.profileData || {});

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Listen for navigation focus to show snackbar if profile was updated
  useFocusEffect(
    React.useCallback(() => {
      const params = props.route?.params;
      if (params?.profileUpdated) {
        setShowSnackbar(true);
        // Clear the param to prevent showing snackbar again on next focus
        props.navigation.setParams({ profileUpdated: undefined });
      }
    }, [props.route?.params])
  );

  const checkAuthentication = async () => {
    try {
      const isLoggedIn = await localStorageHelper.getItemFromStorage(StorageKeys.IS_LOGGED);
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
        // getUserDetailsFromLocalStorage();
      } else {
        setIsAuthenticated(false);

      }
    } catch (error) {
      console.log('Error checking authentication:', error);
    }
  };


  const onSettingsPress = () => {
    // Navigate to settings screen
    // props.navigation.navigate('Settings');
    console.log('Settings pressed');
  };

  const onCoursesPress = () => {
    // Navigate to Courses screen, resetting the stack to initial screen
    // props.navigation.navigate('CoursesStack', {
    //   screen: 'CoursesScreen',
    // });
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'CoursesStack' }],
    });
  };

  const onWeightTrackerPress = () => {
    // Navigate to Weight Tracker screen, resetting the stack to initial screen
    // props.navigation.navigate('WeightTrackerStack', {
    //   screen: 'WeightTrackerScreen',
    // });
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'WeightTrackerStack' }],
    });
  };

  const onDeleteAccountPress = () => {
    setIsDeleteAccountModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = await localStorageHelper.getItemFromStorage(StorageKeys.USER_ID);

      dispatch(DeleteUserAccount({
        userId,
        onSuccess: () => {
          Alert.alert(
            'Account Deleted',
            'Your account has been successfully deleted.',
            [
              {
                text: 'OK',
                onPress: () => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthStack' }],
                  });
                }
              }
            ]
          );
        },
        onFailure: (error) => {
          console.log('Delete account failed:', error);
          Alert.alert(
            'Error',
            error || 'Failed to delete account. Please try again later.',
            [{ text: 'OK' }]
          );
        }
      }));
    } catch (error) {
      console.log('Delete account error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again later.',
        [{ text: 'OK' }]
      );
    }
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
          routes: [{ name: 'Splash' }],
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
          profileImage={profileData?.profile_image || ''}
          username={profileData?.full_name || ''}
          handle={`@${profileData?.full_name || ''}`}
          onPress={onProfileBoxClick}
        />}

        {/* APP SETTINGS Section */}
        <SectionHeader title="APP SETTINGS" />
        <MenuItem
          icon={IMAGES.IC_SETTINGS}
          title="Settings"
          onPress={onProfileBoxClick}
        />

        {/* SHAKE THAT WEIGHT SHOP Section */}
        <SectionHeader title="SHAKE THAT WEIGHT SHOP" />
        <MenuItem
          icon={IMAGES.IC_SHOPPING_BASKET}
          title="Courses"
          onPress={onCoursesPress}
        />
        <MenuItem
          icon={IMAGES.IC_LIBRARY}
          title="Weight Tracker"
          onPress={onWeightTrackerPress}
        />

        {/* APP SETTINGS Section */}
        <SectionHeader title="DANGER ZONE" />
        <MenuItem
          icon={IMAGES.DELETE_ICON}
          title="Delete Account"
          onPress={onDeleteAccountPress}
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

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isVisible={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onConfirmDelete={handleDeleteAccount}
      />

      {/* Snackbar for profile update success */}
      <Snackbar
        visible={showSnackbar}
        message="Profile **successfully** updated"
        type="success"
        duration={3000}
        onDismiss={() => setShowSnackbar(false)}
        position="bottom"
      />
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
