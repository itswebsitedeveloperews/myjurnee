import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { safeAreaStyle } from '../../Common/CommonStyles';
import WeightTrackerChart from '../Components/WeightTrackerChart';
import Card from '../Components/Card';
import Button from '../Components/Button';
import INavBar from '../Components/INavBar';
import ProgressPhotos from '../Components/ProgressPhotos';
import PhotoSlider from '../Components/PhotoSlider';
import WeightTrackingModal from '../Components/WeightTrackingModal';

const WeightTrackerScreen = ({ navigation }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleWeightSubmit = (weightData) => {
        console.log('Weight data submitted:', weightData);
        // TODO: Implement weight data submission logic
        // This could include API calls, Redux actions, etc.
    };

    return (
        <SafeAreaView style={safeAreaStyle}>
            {/* <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F5F5"
            /> */}
            <View style={{ paddingHorizontal: 20 }}>
                <INavBar title="Weight Tracker" EmptyBackButton={true} />
            </View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* Top Row Cards */}
                <View style={styles.cardRow}>
                    <Card
                        title="10.5 kg"
                        subtitle="Weight Lost"
                        style={styles.card}
                    />
                    <Card
                        title="89.5 kg"
                        subtitle="Current Weight"
                        style={styles.card}
                    />
                    <Card
                        title="76.0 kg"
                        subtitle="Goal Weight"
                        style={styles.card}
                    />
                </View>

                {/* Second Row Cards */}
                <View style={styles.cardRowTwo}>
                    <Card
                        title="Last 30 Days"
                        subtitle="10.5 kg Lost"
                        style={styles.cardTwo}
                    />
                    <Card
                        title="Last 90 Days"
                        subtitle="25.5 kg Lost"
                        style={styles.cardTwo}
                    />
                </View>

                {/* Update Progress Button */}
                <Button
                    title="Update Progress"
                    onPress={handleOpenModal}
                    style={styles.updateButton}
                />

                {/* Temporary Log History Button */}
                <Button
                    title="View Log History"
                    onPress={() => navigation.navigate('LogHistoryScreen')}
                    style={styles.logHistoryButton}
                />

                {/* Weight Tracker Chart */}
                <WeightTrackerChart
                    goalWeight={75}
                    selectedIndex={1}
                    onDataPointPress={(data) => {
                        console.log('Data point pressed:', data);
                    }}
                />

                {/* Progress Photos */}
                <ProgressPhotos
                    initialPhoto={require('../../assets/temp/profileTemp.png')} // Replace with actual initial photo
                    latestPhoto={require('../../assets/temp/profileTemp.png')} // Replace with actual latest photo
                    style={styles.progressPhotos}
                />

                {/* Photo Slider */}
                <PhotoSlider style={styles.photoSlider} />
            </ScrollView>

            {/* Weight Tracking Modal */}
            <WeightTrackingModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSubmit={handleWeightSubmit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
});
export default WeightTrackerScreen;