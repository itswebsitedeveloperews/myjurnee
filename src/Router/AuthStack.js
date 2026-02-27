import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Login from '../Screens/Login/Login';
import Signup from '../Screens/Login/Signup';
import ForgotPassword from '../Screens/Login/ForgotPassword';
import FitnessOnboardingWizard from '../Screens/Components/fitness_onboarding_wizard';
import ResetPassword from '../Screens/Login/ResetPassword';
import UpgradeIntroScreen from '../Screens/Onboarding/UpgradeIntroScreen';

const AuthStack = createNativeStackNavigator();

const AuthStacks = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="UpgradeIntroScreen" component={UpgradeIntroScreen} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
      <AuthStack.Screen name="FitnessOnboardingWizard" component={FitnessOnboardingWizard} />
    </AuthStack.Navigator>
  );
};

export default AuthStacks;
