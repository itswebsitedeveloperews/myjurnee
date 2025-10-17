import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../Screens/Splash/Splash';
import AuthStack from './AuthStack';
import DashboardStack from './DashboardStack';

// import CustomerStack from './CustomerStack';
// import AgencyStack from './AgencyStack';

const Stack = createNativeStackNavigator();

const SwitchStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="DashboardStack" component={DashboardStack} />
      {/*<Stack.Screen name="CustomerStack" component={CustomerStack} />
      <Stack.Screen name="AgencyStack" component={AgencyStack} /> */}
    </Stack.Navigator>
  );
};

export default SwitchStack;
