import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Login from '../Screens/Login/Login';
import Signup from '../Screens/Login/Signup';
import ForgotPassword from '../Screens/Login/ForgotPassword';

const AuthStack = createNativeStackNavigator();

const AuthStacks = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};

export default AuthStacks;
