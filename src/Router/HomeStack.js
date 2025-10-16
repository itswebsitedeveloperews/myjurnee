import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Home from '../Screens/Home/Home';

const DashStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <DashStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home">
      <DashStack.Screen name="Home" component={Home} />
    </DashStack.Navigator>
  );
};

export default HomeStack;
