import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import INavBar from '../Components/INavBar';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';

const LogHistoryScreen = ({ navigation }) => {
    const [logs, setLogs] = useState([
        {
            id: 1,
            type: 'weight',
            weight: 89.5,
            date: 'Yesterday, June 25, 2025',
            change: -2.5,
            changeType: 'loss'
        },
        {
            id: 2,
            type: 'weight',
            weight: 92.0,
            date: 'June 25, 2025',
            change: 3.0,
            changeType: 'gain'
        },
        {
            id: 3,
            type: 'photo',
            date: 'June 09, 2025',
            image: require('../../assets/temp/profileTemp.png')
        },
        {
            id: 4,
            type: 'weight',
            weight: 93.5,
            date: 'May 15, 2025',
            change: 1.0,
            changeType: 'gain'
        },
        {
            id: 5,
            type: 'weight',
            weight: 92.5,
            date: 'May 02, 2025',
            change: -2.5,
            changeType: 'loss'
        },
        {
            id: 6,
            type: 'weight',
            weight: 95.0,
            date: 'April 11, 2025',
            change: -0.5,
            changeType: 'loss'
        },
        {
            id: 7,
            type: 'photo',
            date: 'April 04, 2025',
            image: require('../../assets/temp/profileTemp.png')
        },
        {
            id: 8,
            type: 'weight',
            weight: 96.0,
            date: 'March 17, 2025',
            change: 1.0,
            changeType: 'gain'
        },
        {
            id: 9,
            type: 'weight',
            weight: 95.0,
            date: 'March 01, 2025',
            change: -1.5,
            changeType: 'loss'
        }
    ]);

    const [showUndo, setShowUndo] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);

    const handleDelete = (itemId) => {
        const itemToDelete = logs.find(log => log.id === itemId);
        setDeletedItem(itemToDelete);
        setLogs(logs.filter(log => log.id !== itemId));
        setShowUndo(true);

        // Auto hide undo after 5 seconds
        setTimeout(() => {
            setShowUndo(false);
            setDeletedItem(null);
        }, 5000);
    };

    const handleUndo = () => {
        if (deletedItem) {
            setLogs([deletedItem, ...logs]);
            setShowUndo(false);
            setDeletedItem(null);
        }
    };

    const renderWeightEntry = (item) => (
        <View key={item.id} style={styles.logEntry}>
            <View style={styles.logContent}>
                <View style={styles.weightInfo}>
                    <Text style={styles.weightText}>{item.weight} kg</Text>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <View style={styles.changeInfo}>
                    <View style={styles.changeContainer}>
                        <Text style={[
                            styles.changeIcon,
                            { color: item.changeType === 'loss' ? '#4CAF50' : '#F44336' }
                        ]}>
                            {item.changeType === 'loss' ? '↓' : '↑'}
                        </Text>
                        <Text style={[
                            styles.changeText,
                            { color: item.changeType === 'loss' ? '#4CAF50' : '#F44336' }
                        ]}>
                            {item.changeType === 'loss' ? '-' : '+'} {Math.abs(item.change)} kg
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <FastImage source={IMAGES.DELETE_ICON} style={styles.deleteIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderPhotoEntry = (item) => (
        <View key={item.id} style={styles.logEntry}>
            <View style={styles.logContent}>
                <View style={styles.photoInfo}>
                    <Text style={styles.photoTitle}>Photo upload</Text>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <View style={styles.photoContainer}>
                    <Image source={item.image} style={styles.photoThumbnail} />
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <FastImage source={IMAGES.DELETE_ICON} style={styles.deleteIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={safeAreaStyle}>
            <View style={{ paddingHorizontal: 20 }}>
                <INavBar
                    title="Log History"
                    onBackPress={() => navigation.goBack()}
                    showCalendar={true}
                />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {logs.map((item) =>
                    item.type === 'weight' ? renderWeightEntry(item) : renderPhotoEntry(item)
                )}
            </ScrollView>

            {showUndo && (
                <View style={styles.undoContainer}>
                    <View style={styles.undoContent}>
                        <View style={styles.undoIcon}>
                            <Text style={styles.checkmark}>✓</Text>
                        </View>
                        <Text style={styles.undoText}>History Deleted!</Text>
                        <TouchableOpacity onPress={handleUndo}>
                            <Text style={styles.undoButton}>Undo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    logEntry: {
        backgroundColor: '#f0f0f5',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
    },
    logContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weightInfo: {
        flex: 1,
    },
    weightText: {
        fontSize: 18,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        marginBottom: 4,
    },
    photoTitle: {
        fontSize: 18,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor44,
    },
    changeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    changeIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    changeText: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_MEDIUM,
    },
    deleteButton: {
        padding: 4,
    },
    deleteIcon: {
        width: 20,
        height: 20,
    },
    photoInfo: {
        flex: 1,
    },
    photoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    photoThumbnail: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    undoContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
    },
    undoContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    undoIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkmark: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    undoText: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
    },
    undoButton: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: '#2196F3',
    },
});

export default LogHistoryScreen;
