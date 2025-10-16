import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Home from '../Screens/Home/Home';
import CoursesScreen from '../Screens/Courses/Courses';

const Courses = createNativeStackNavigator();

const CoursesStack = () => {
    return (
        <Courses.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="CoursesScreen">
            <Courses.Screen name="CoursesScreen" component={CoursesScreen} />
        </Courses.Navigator>
    );
};

export default CoursesStack;
