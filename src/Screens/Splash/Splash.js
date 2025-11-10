import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, ImageBackground } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { IMAGES } from '../../Common/Constants/images';
import { useDispatch } from 'react-redux';
import { onUserIdSuccess } from '../../redux/profile/profileSlice';

const Splash = props => {

  const dispatch = useDispatch();
  useEffect(() => {

    setTimeout(() => {
      localStorageHelper
        .getItemsFromStorage([StorageKeys.IS_LOGGED, StorageKeys.USER_ID, StorageKeys.ONBOARDING_SHOWN])
        .then(resp => {
          console.log('resp', resp);
          const onboardingShown = resp[StorageKeys.ONBOARDING_SHOWN];

          // Check if onboarding has been shown
          if (onboardingShown !== 'true') {
            props.navigation.replace('Onboarding');
            return;
          }

          // Proceed with normal flow
          let loginPreserved = resp[StorageKeys.IS_LOGGED];

          if (loginPreserved == 'true') {
            dispatch(onUserIdSuccess(resp[StorageKeys.USER_ID]));
            props.navigation.replace('DashboardStack');
          } else {
            props.navigation.replace('AuthStack'); //replace when completed with Authstack
          }
        });
    }, 1500);
  }, []);

  return (
    <ImageBackground source={IMAGES.SPLASH_BG} style={styles.container} resizeMode='cover'>
      <ActivityIndicator size="large" color={COLORS.white} />
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
