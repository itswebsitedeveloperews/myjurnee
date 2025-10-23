import React, { useState, useEffect } from 'react';
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
import WeightTrackingService from '../../Services/WeightTrackingService';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';
import PhotoStorageService from '../../Services/PhotoStorageService';

const LogHistoryScreen = ({ navigation, route }) => {
    const [logs, setLogs] = useState([]);
    const [showUndo, setShowUndo] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, []);

    // Add focus listener to refresh data when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isAuthenticated) {
                loadLogs();
            }
        });

        return unsubscribe;
    }, [navigation, isAuthenticated]);

    const checkAuthentication = async () => {
        try {
            const isLoggedIn = await localStorageHelper.getItemFromStorage(StorageKeys.IS_LOGGED);
            if (isLoggedIn === 'true') {
                setIsAuthenticated(true);
                loadLogs();
            } else {
                // Show dummy data for non-authenticated users
                loadDummyLogs();
            }
        } catch (error) {
            console.log('Error checking authentication:', error);
            loadDummyLogs();
        }
    };

    const loadDummyLogs = () => {
        const dummyLogs = [
            {
                id: '1',
                type: 'weight',
                weight: 89.5,
                date: new Date().toISOString(),
                change: -2.5,
                changeType: 'loss'
            },
            {
                id: '2',
                type: 'weight',
                weight: 92.0,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                change: 1.0,
                changeType: 'gain'
            },
            {
                id: '3',
                type: 'photo',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                image: require('../../assets/temp/profileTemp.png')
            },
            {
                id: '4',
                type: 'weight',
                weight: 91.0,
                date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                change: -1.5,
                changeType: 'loss'
            }
        ];
        setLogs(dummyLogs);
        setLoading(false);
    };

    const loadLogs = async () => {
        try {
            setLoading(true);
            const entries = await WeightTrackingService.getWeightEntries();
            setLogs(entries);
        } catch (error) {
            console.log('Error loading logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!isAuthenticated) {
            Alert.alert(
                'Authentication Required',
                'Please login to manage your weight tracking data.',
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

        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const itemToDelete = logs.find(log => log.id === itemId);
                        setDeletedItem(itemToDelete);

                        try {
                            await WeightTrackingService.deleteEntry(itemId);
                            route.params.onDataRefresh();
                            setLogs(logs.filter(log => log.id !== itemId));
                            setShowUndo(true);

                            // Auto hide undo after 5 seconds
                            setTimeout(() => {
                                setShowUndo(false);
                                setDeletedItem(null);
                            }, 5000);
                        } catch (error) {
                            console.log('Error deleting entry:', error);
                            Alert.alert('Error', 'Failed to delete entry');
                        }
                    }
                }
            ]
        );
    };

    const handleUndo = async () => {
        if (deletedItem) {
            try {
                if (deletedItem.type === 'weight') {
                    await WeightTrackingService.addWeightEntry(deletedItem);
                } else {
                    await WeightTrackingService.addPhotoEntry(deletedItem);
                }
                setLogs([deletedItem, ...logs]);
                setShowUndo(false);
                setDeletedItem(null);
                route.params?.onDataRefresh();
            } catch (error) {
                console.log('Error undoing delete:', error);
                Alert.alert('Error', 'Failed to undo delete');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const renderWeightEntry = (item) => {
        const getImageSource = (photo) => {
            if (photo && photo.fileName) {
                // Photo was saved to file system
                return { uri: PhotoStorageService.getPhotoUri(photo.fileName) };
            } else if (photo && photo.uri) {
                // Photo is still in temporary location
                return { uri: photo.uri };
            } else {
                // Fallback to default image
                return require('../../assets/temp/profileTemp.png');
            }
        };

        return (
            <View key={item.id} style={styles.logEntry}>
                <View style={styles.logContent}>
                    <View style={styles.weightInfo}>
                        <Text style={styles.weightText}>{item.weight} kg</Text>
                        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                        {item.photos && item.photos.length > 0 && (
                            <Text style={styles.photosCountText}>
                                📷 Photo attached
                            </Text>
                        )}
                    </View>
                    <View style={styles.changeInfo}>
                        {item.change !== undefined && item.change !== 0 && (
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
                                    {item.changeType === 'loss' ? '-' : '+'} {Math.abs(item.change).toFixed(1)} kg
                                </Text>
                            </View>
                        )}
                        {item.photos && item.photos.length > 0 && (
                            <View style={styles.photoPreviewContainer}>
                                <Image
                                    source={getImageSource(item.photos[0])}
                                    style={styles.photoThumbnail}
                                />
                            </View>
                        )}
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
    };

    const renderPhotoEntry = (item) => {
        const getImageSource = () => {
            if (item.image && item.image.fileName) {
                // Photo was saved to file system
                return { uri: PhotoStorageService.getPhotoUri(item.image.fileName) };
            } else if (item.image && item.image.uri) {
                // Photo is still in temporary location
                return { uri: item.image.uri };
            } else {
                // Fallback to default image
                return require('../../assets/temp/profileTemp.png');
            }
        };

        return (
            <View key={item.id} style={styles.logEntry}>
                <View style={styles.logContent}>
                    <View style={styles.photoInfo}>
                        <Text style={styles.photoTitle}>Photo upload</Text>
                        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                    </View>
                    <View style={styles.photoContainer}>
                        <Image source={getImageSource()} style={styles.photoThumbnail} />
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
    };

    // Remove the authentication check that blocks the entire screen
    // Now we show dummy data for non-authenticated users

    return (
        <SafeAreaView style={safeAreaStyle}>
            <View style={{ paddingHorizontal: 20 }}>
                <INavBar
                    title="Log History"
                    onBackPress={() => navigation.goBack()}
                    showCalendar={true}
                />
                {!isAuthenticated && (
                    <View style={styles.demoBanner}>
                        <Text style={styles.demoText}>📊 Demo Data - Login to manage your entries</Text>
                    </View>
                )}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : logs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No weight entries yet</Text>
                        <Text style={styles.emptySubtext}>Start tracking your weight to see your progress here</Text>
                    </View>
                ) : (
                    logs.map((item) =>
                        item.type === 'weight' ? renderWeightEntry(item) : renderPhotoEntry(item)
                    )
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
    photosCountText: {
        fontSize: 12,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor44,
        marginTop: 2,
    },
    photoPreviewContainer: {
        marginRight: 8,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: COLORS.textColor44,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor44,
        textAlign: 'center',
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    authText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_MEDIUM,
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
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: '#1976D2',
        textAlign: 'center',
    },
});

export default LogHistoryScreen;
