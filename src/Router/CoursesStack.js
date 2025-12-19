import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import Home from '../Screens/Home/Home';
import CoursesScreen from '../Screens/Courses/Courses';
import CourseDetailScreen from '../Screens/Courses/CourseDetailScreen';
import LessonDetailScreen from '../Screens/Courses/LessonDetailScreen';
import TopicDetailScreen from '../Screens/Courses/TopicDetailScreen';

const Courses = createNativeStackNavigator();

const CoursesStack = () => {
    return (
        <Courses.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="CoursesScreen">
            <Courses.Screen name="CoursesScreen" component={CoursesScreen} />
            <Courses.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
            <Courses.Screen name="LessonDetailScreen" component={LessonDetailScreen} />
            <Courses.Screen name="TopicDetailScreen" component={TopicDetailScreen} />
        </Courses.Navigator>
    );
};

export default CoursesStack;
