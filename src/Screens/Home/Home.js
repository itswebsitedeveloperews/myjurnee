import React, { useState } from 'react';
import {
    FlatList,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { dashboadData } from '../../Utils/Data';
import { windowHeight, windowWidth } from '../../Utils/Dimentions';
import HightBox from '../Components/HightBox';
import ISearchBar from '../Components/ISearchBar';
import LocationNavBar from '../Components/LocationNavBar';
import { useEffect } from 'react';
import {
    getDashboardCategory,
    searchCategories,
} from '../../redux/dashboard/dashboardActions';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = props => {
    return (
        <SafeAreaView style={safeAreaStyle}>
            <Text>Home</Text>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({

});
