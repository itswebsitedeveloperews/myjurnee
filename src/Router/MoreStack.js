import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Home from '../Screens/Home/Home';
import CourseDetailScreen from '../Screens/Courses/CourseDetailScreen';
import LessonDetailScreen from '../Screens/Courses/LessonDetailScreen';
import Profile from '../Screens/More/Profile';
import EditProfile from '../Screens/More/EditProfile';

const MoreStacks = createNativeStackNavigator();

const MoreStack = () => {
  return (
    <MoreStacks.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Profile">
      <MoreStacks.Screen name="Profile" component={Profile} />
      <MoreStacks.Screen name="EditProfile" component={EditProfile} />
    </MoreStacks.Navigator>
  );
};

export default MoreStack;
