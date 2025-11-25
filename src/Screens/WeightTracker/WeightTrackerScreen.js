import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { safeAreaStyle } from '../../Common/CommonStyles';
import WeightTrackerChart from '../Components/WeightTrackerChart';
import Card from '../Components/Card';
import Button from '../Components/Button';
import INavBar from '../Components/INavBar';
import ProgressPhotos from '../Components/ProgressPhotos';
import PhotoSlider from '../Components/PhotoSlider';
import WeightTrackingModal from '../Components/WeightTrackingModal';
import WeightTrackingService from '../../Services/WeightTrackingService';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';
import { FONTS } from '../../Common/Constants/fonts';
import { COLORS } from '../../Common/Constants/colors';
import SetGoalWeightModal from '../Components/SetGoalWeightModal';
import { getCurrentWeekDates, getFullWeekDatesArray } from '../../Utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { setWeightGoalAction, setWeightGoalProgessAction } from '../../redux/WeightLogs/weightLogActions';
import { getGoalWeight, getWeightLogs } from '../../api/weightGoalApi';

const WeightTrackerScreen = ({ navigation }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSetGoalWeightModalVisible, setIsSetGoalWeightModalVisible] = useState(false);
    const [weightStats, setWeightStats] = useState({
        currentWeight: 0,
        startingWeight: 0,
        goalWeight: 0,
        weightLost: 0,
        weightLost30Days: 0,
        weightLost90Days: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [recentPhotos, setRecentPhotos] = useState([]);
    const [weightLogs, setWeightLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch();
    const userId = useSelector(state => state.profile?.userId || '');
    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const isLoggedIn = await localStorageHelper.getItemFromStorage(StorageKeys.IS_LOGGED);
            if (isLoggedIn === 'true') {
                setIsAuthenticated(true);
                loadWeightData();
            } else {
                // Show dummy data for non-authenticated users
                loadDummyData();
            }
        } catch (error) {
            console.log('Error checking authentication:', error);
            loadDummyData();
        }
    };

    const loadDummyData = () => {
        setWeightStats({
            currentWeight: 89.5,
            startingWeight: 100.0,
            goalWeight: 75.0,
            weightLost: 10.5,
            weightLost30Days: 3.2,
            weightLost90Days: 8.7,
        });
        setChartData([]);
        setRecentPhotos([]);
        setLoading(false);
    };

    const loadWeightData = async () => {
        try {
            setLoading(true);

            localStorageHelper
                .getItemFromStorage(StorageKeys.USER_ID)
                .then(async userId => {
                    if (!userId) {
                        return;
                    }
                    const response = await getWeightLogs(userId);
                    const goalWeightResponse = await getGoalWeight(userId);
                    if (response?.success) {
                        setWeightLogs(response?.data || []);
                        await handleStatistics(response?.data || [], goalWeightResponse?.data);
                    }
                });
        } catch (error) {
            console.log('Error loading weight data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatistics = async (weightLogs, goalWeight) => {
        const stats = await WeightTrackingService.getWeightStatistics(weightLogs, goalWeight);
        const photos = await WeightTrackingService.getRecentPhotos(weightLogs);
        const chartData = await prepareChartData(weightLogs);

        setWeightStats(stats);
        setChartData(chartData);
        setRecentPhotos(photos);
    }

    const prepareChartData = async (weightLogs) => {
        try {
            const chart = await WeightTrackingService.getChartData(weightLogs);

            if (chart && chart.length == 0) {
                return [0, 0, 0, 0, 0, 0, 0]
            }
            const fullWeekDates = getFullWeekDatesArray();
            // Create a map of date to weight
            const weightMap = {};
            chart.forEach(entry => {
                weightMap[entry.date] = entry.weight;
            });
            // Map full dates to weights (null if no data)
            const data = fullWeekDates.map(date => weightMap[date] ?? 0);

            return data;
        } catch (error) {
            console.log('Error preparing chart data:', error);
            return [];
        }
    };

    const handleOpenModal = () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Authentication Required',
                'Please login to add weight entries and track your progress.',
                [
                    {
                        text: 'Login',
                        onPress: () => navigation.navigate('AuthStack')
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    }
                ]
            );
            return;
        }
        setIsModalVisible(true);
    };

    const handleSetGoalWeight = () => {
        setIsSetGoalWeightModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const handleCloseSetGoalWeightModal = () => {
        setIsSetGoalWeightModalVisible(false);
    };

    const handleWeightSubmit = async (data) => {
        try {
            localStorageHelper
                .getItemFromStorage(StorageKeys.USER_ID)
                .then(async userId => {
                    setLoading(true);
                    const payload = {
                        "user_id": userId,
                        "weight": data.weight,
                        "date": data.date,
                        "images": data.photos
                    }
                    dispatch(setWeightGoalProgessAction({
                        onSuccess, onFailure, payload
                    }))
                });
        } catch (error) {
            console.log('Error saving data:', error);
            Alert.alert(
                'Error',
                'Failed to save data. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const onSuccess = async () => {
        setLoading(false);
        await loadWeightData();
    };

    const onFailure = () => {
        setLoading(false);
    };

    const handleSetGoalWeightSubmit = async (data) => {
        try {
            localStorageHelper
                .getItemFromStorage(StorageKeys.USER_ID)
                .then(async userId => {
                    setLoading(true);
                    const payload = {
                        "user_id": userId,
                        "goal_weight": data.weight.toString()
                    }
                    dispatch(setWeightGoalAction({ payload, onSuccess, onFailure }));
                    await WeightTrackingService.setGoalWeight(data.weight);
                    await loadWeightData();
                });
        } catch (error) {
            console.log('Error setting goal weight:', error);
        }
    };
    // Remove the authentication check that blocks the entire screen
    // Now we show dummy data for non-authenticated users

    if (loading) {
        return (
            <SafeAreaView style={safeAreaStyle} edges={['top']} >
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.black} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[safeAreaStyle, { backgroundColor: COLORS.grayBg }]} edges={['top']} >
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
            <View style={{ paddingHorizontal: 20 }}>
                {/* <INavBar title="Weight Tracker" EmptyBackButton={true} /> */}
                <Text style={styles.headerTitle}>Weight Tracker</Text>
                {!isAuthenticated && (
                    <View style={styles.demoBanner}>
                        <Text style={styles.demoText}>📊 Demo Data - Login to track your progress</Text>
                    </View>
                )}
            </View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadWeightData} />}
            >

                {/* Top Row Cards */}
                <View style={styles.cardRow}>
                    <Card
                        title={`${weightStats.weightLost.toFixed(1)} kg`}
                        subtitle="Weight Lost"
                        style={styles.card}
                    />
                    <Card
                        title={`${weightStats.currentWeight.toFixed(1)} kg`}
                        subtitle="Current Weight"
                        style={styles.card}
                    />
                    <Card
                        title={`${weightStats.goalWeight.toFixed(1)} kg`}
                        subtitle="Goal Weight"
                        style={styles.card}
                    />
                </View>

                {/* Second Row Cards */}
                <View style={styles.cardRowTwo}>
                    <Card
                        title="Last 30 Days"
                        subtitle={`${weightStats.weightLost30Days.toFixed(1)} kg Lost`}
                        style={styles.cardTwo}
                    />
                    <Card
                        title="Last 90 Days"
                        subtitle={`${weightStats.weightLost90Days.toFixed(1)} kg Lost`}
                        style={styles.cardTwo}
                    />
                </View>

                {/* Update Progress Button */}
                <Button
                    title="Update Progress"
                    onPress={handleOpenModal}
                    style={styles.updateButton}
                />

                <Button
                    title="Set Goal Weight"
                    onPress={handleSetGoalWeight}
                    style={styles.logHistoryButton}
                />

                {/* Temporary Log History Button */}
                <Button
                    title="View Log History"
                    onPress={() => navigation.navigate('LogHistoryScreen', { onDataRefresh: loadWeightData })}
                    style={styles.logHistoryButton}
                />

                {/* Weight Tracker Chart */}
                <WeightTrackerChart
                    data={chartData}
                    goalWeight={weightStats.goalWeight}
                    selectedIndex={1}
                    onDataPointPress={(data) => {
                        console.log('Data point pressed:', data);
                    }}
                />

                {/* Progress Photos */}
                <ProgressPhotos
                    initialPhoto={recentPhotos.length > 0 ? recentPhotos[recentPhotos.length - 1]?.filePath : 'https://img.freepik.com/premium-vector/overweight-blonde-woman-icon-cartoon-overweight-blonde-woman-vector-icon-web-design-isolated-white-background_98402-34738.jpg'}
                    latestPhoto={recentPhotos.length > 0 ? recentPhotos[0]?.filePath : 'https://img.freepik.com/premium-vector/overweight-blonde-woman-icon-cartoon-overweight-blonde-woman-vector-icon-web-design-isolated-white-background_98402-34738.jpg'}
                    style={styles.progressPhotos}
                />

                {/* Photo Slider */}
                <PhotoSlider
                    photos={recentPhotos}
                    style={styles.photoSlider}
                />
            </ScrollView>

            {/* Weight Tracking Modal */}
            <WeightTrackingModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSubmit={handleWeightSubmit}
            />

            {/* Set Goal Weight Modal */}
            <SetGoalWeightModal
                isVisible={isSetGoalWeightModalVisible}
                onClose={handleCloseSetGoalWeightModal}
                onSubmit={handleSetGoalWeightSubmit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FONTS.URBANIST_BOLD,
        color: COLORS.textColor,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    cardRowTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        marginHorizontal: 5,
    },
    cardTwo: {
        marginHorizontal: 5,
    },
    updateButton: {
        marginTop: 20,
        width: '100%',
    },
    logHistoryButton: {
        marginTop: 10,
        width: '100%',
    },
    progressPhotos: {
        marginTop: 20,
    },
    photoSlider: {
        // marginTop: 20,
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    authText: {
        fontSize: 16,
        fontFamily: FONTS.URBANIST_MEDIUM,
        color: COLORS.textColor44,
        textAlign: 'center',
    },
    demoBanner: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    demoText: {
        fontSize: 14,
        fontFamily: FONTS.URBANIST_MEDIUM,
        color: '#1976D2',
        textAlign: 'center',
    },
});
export default WeightTrackerScreen;