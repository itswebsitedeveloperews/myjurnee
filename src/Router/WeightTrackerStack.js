import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import WeightTrackerScreen from '../Screens/WeightTracker/WeightTrackerScreen';
import LogHistoryScreen from '../Screens/WeightTracker/LogHistoryScreen';

const WeightTracker = createNativeStackNavigator();

const WeightTrackerStack = () => {
    return (
        <WeightTracker.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="WeightTrackerScreen">
            <WeightTracker.Screen name="WeightTrackerScreen" component={WeightTrackerScreen} />
            <WeightTracker.Screen name="LogHistoryScreen" component={LogHistoryScreen} />
        </WeightTracker.Navigator>
    );
};

export default WeightTrackerStack;
