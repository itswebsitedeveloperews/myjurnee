import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, ImageBackground } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { StorageKeys, localStorageHelper } from '../../Common/localStorageHelper';
import { IMAGES } from '../../Common/Constants/images';

const Splash = props => {
  useEffect(() => {

    setTimeout(() => {
      localStorageHelper
        .getItemsFromStorage([StorageKeys.IS_LOGGED, StorageKeys.USER_TYPE])
        .then(resp => {
          console.log('resp', resp);
          let loginPreserved = resp[StorageKeys.IS_LOGGED];
          let userType = resp[StorageKeys.USER_TYPE];

          // if (loginPreserved == 'true' && userType !== 'null') {
          //   if (userType == 'Architect / Interior') {
          //     props.navigation.replace('ArchitectStack', {
          //       initialRoute: 'ArchitectBottomTab',
          //     });
          //   } else if (userType == 'Customer') {
          //     props.navigation.replace('CustomerStack', {
          //       initialRoute: 'CustomerBottomTab',
          //     });
          //   } else if (userType == 'Agency') {
          //     // Add check for if already purchased plan
          //     props.navigation.replace('AgencyStack');
          //   }
          // } else {
          props.navigation.replace('DashboardStack'); //replace when completed with Authstack
          // }
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
