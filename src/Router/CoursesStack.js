import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Home from '../Screens/Home/Home';
import CoursesScreen from '../Screens/Courses/Courses';
import CourseDetailScreen from '../Screens/Courses/CourseDetailScreen';

const Courses = createNativeStackNavigator();

const CoursesStack = () => {
    return (
        <Courses.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="CoursesScreen">
            <Courses.Screen name="CoursesScreen" component={CoursesScreen} />
            <Courses.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
        </Courses.Navigator>
    );
};

export default CoursesStack;
