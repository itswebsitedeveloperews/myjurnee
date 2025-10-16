import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//Screens
import HomeStack from './HomeStack';
import SimpleTabBar from '../Components/SimpleTabBar';
import Profile from '../Screens/More/Profile';
import CoursesStack from './CoursesStack';
import WeightTrackerStack from './WeightTrackerStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const DashboardBottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <SimpleTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        initialParams={{ rightNavButtons: [] }}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="CoursesStack"
        component={CoursesStack}
        options={{
          tabBarLabel: 'Courses',
        }}
      />
      <Tab.Screen
        name="WeightTrackerStack"
        component={WeightTrackerStack}
        options={{
          tabBarLabel: 'Weight',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const DashboardStack = props => {
  // const { initialRoute } = props.route.params || {};
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={'DashboardBottomTab'}
    >
      <Stack.Screen name="DashboardBottomTab" component={DashboardBottomTab} />
    </Stack.Navigator>
  );
};


export default DashboardStack;
