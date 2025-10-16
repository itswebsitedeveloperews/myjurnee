import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//Screens
import Onboarding from '../Screens/Login/Onboarding';
import Login from '../Screens/Login/Login';
// import OTP_Verify from '../Screens/Login/OTP_Verify';
import RoleSelection from '../Screens/Login/RoleSelection';

const AuthStack = createNativeStackNavigator();

const AuthStacks = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      {/* <AuthStack.Screen name="OTP_Verify" component={OTP_Verify} /> */}
      <AuthStack.Screen name="RoleSelection" component={RoleSelection} />
    </AuthStack.Navigator>
  );
};

export default AuthStacks;
