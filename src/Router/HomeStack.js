import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Home from '../Screens/Home/Home';
import CourseDetailScreen from '../Screens/Courses/CourseDetailScreen';
import LessonDetailScreen from '../Screens/Courses/LessonDetailScreen';
import TopicDetailScreen from '../Screens/Courses/TopicDetailScreen';

const DashStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <DashStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home">
      <DashStack.Screen name="Home" component={Home} />
      <DashStack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      <DashStack.Screen name="LessonDetailScreen" component={LessonDetailScreen} />
      <DashStack.Screen name="TopicDetailScreen" component={TopicDetailScreen} />
    </DashStack.Navigator>
  );
};

export default HomeStack;
