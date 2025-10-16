import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SwitchStack from './SwitchStack';

const Router = () => {
  return (
    <NavigationContainer>
      <SwitchStack />
    </NavigationContainer>
  );
};

export default Router;
