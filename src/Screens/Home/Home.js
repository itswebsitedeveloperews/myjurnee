import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    RefreshControl,
    ScrollView,
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
import { useDispatch, useSelector } from 'react-redux';
import LastingWeightsComponent from './LastingWeightsComponent'
import { SafeAreaView } from 'react-native-safe-area-context';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';
import FastImage from 'react-native-fast-image';
import CoursesGrid from '../Components/CoursesGrid'
import { IMAGES } from '../../Common/Constants/images';
import { getCourseAction } from '../../redux/cources/courceActions';
import IButton from '../Components/IButton';
import { getUserFitnessDetails } from '../../api/profileApi';

const games = [
    {
        id: '1',
        rank: 1,
        title: 'Clash of Clans',
        subtitle: 'Build, Battle, Defend &...',
        cta: 'View',
        icon: IMAGES.HOME_SCREEN_LOGO_V1,
        bgColor: '#5E3BB9',
    },
    {
        id: '2',
        rank: 2,
        title: 'UNO!™',
        subtitle: "The World's #1 Card G...",
        cta: 'View',
        icon: IMAGES.HOME_SCREEN_LOGO_V1,
        bgColor: '#C7463A',
    },
    {
        id: '3',
        rank: 3,
        title: 'Ludo King',
        subtitle: 'Recall your childhood!',
        cta: 'Play',
        icon: IMAGES.HOME_SCREEN_LOGO_V1,
        bgColor: '#7A8593',
    },
    {
        id: '4',
        rank: 4,
        title: 'Clash Royale',
        subtitle: 'Epic PvP Card Battle St...',
        cta: 'View',
        icon: IMAGES.HOME_SCREEN_LOGO_V1,
        bgColor: '#D3792F',
    },
];

const Home = props => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userChar, setUserChar] = useState('');
    const [courses, setCourses] = useState([]);
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        checkAuthentication();
    }, [])

    useEffect(() => {
        // Check onboarding status after authentication check
        if (isAuthenticated) {
            checkOnboardingStatus();
        }
    }, [isAuthenticated])

    useEffect(() => {
        setLoading(true);
        dispatch(getCourseAction({ onSuccess, onFailure }));
    }, []);

    const onSuccess = (response) => {
        setLoading(false);
        transformCoursesToCards(response);
    };

    const onFailure = () => {
        setLoading(false);
    };

    const transformCoursesToCards = (courses) => {
        const bgColors = ['#5E3BB9', '#C7463A', '#7A8593', '#D3792F'];

        const finalData = courses
            .slice(0, 4) // take first 4 only
            .map((course, index) => ({
                id: course.ID.toString(),
                rank: index + 1,
                title: course.title,
                subtitle: course.course_excerpt?.slice(0, 35) + '...', // short preview
                cta: 'View', // or dynamic if needed
                icon: IMAGES.HOME_SCREEN_LOGO_V1, // your static or course-based image
                bgColor: bgColors[index % bgColors.length],
                permalink: course.permalink, // if you need navigation later
            }));

        setCourses(finalData);
    };

    const checkAuthentication = async () => {
        try {
            const isLoggedIn = await localStorageHelper.getItemFromStorage(StorageKeys.IS_LOGGED);
            if (isLoggedIn === 'true') {
                setIsAuthenticated(true);
                getUserDetailsFromLocalStorage();
            } else {
                setIsAuthenticated(false);

            }
        } catch (error) {
            console.log('Error checking authentication:', error);
        }
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase();

    const getUserDetailsFromLocalStorage = () => {
        localStorageHelper
            .getItemsFromStorage([StorageKeys.USER_NAME])
            .then(resp => {
                let userName = resp[StorageKeys.USER_NAME];
                const charOfName = getInitial(userName);
                setUserChar(charOfName);
            });
    }

    const checkOnboardingStatus = async () => {
        try {
            setCheckingOnboarding(true);
            const userId = await localStorageHelper.getItemFromStorage(StorageKeys.USER_ID);

            if (!userId) {
                console.log('User ID not found, skipping onboarding check');
                setCheckingOnboarding(false);
                return;
            }

            // Create a timeout promise to prevent hanging on slow/blocked requests
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Request timeout'));
                }, 10000); // 10 second timeout
            });

            // Call API to get user fitness details with timeout
            Promise.race([
                getUserFitnessDetails(userId),
                timeoutPromise
            ])
                .then(response => {
                    setCheckingOnboarding(false);
                    console.log('User fitness details:', response);

                    if (response?.success && response?.data) {
                        const { gender, age, current_weight, goal_weight } = response.data;

                        // Check if onboarding is incomplete (any field is null)
                        if (!gender || !age || current_weight === null || goal_weight === null) {
                            console.log('Onboarding incomplete, navigating to wizard');
                            // Navigate to fitness onboarding wizard in parent DashboardStack
                            // Get parent navigator (DashboardStack) to navigate to wizard
                            const parent = props.navigation.getParent();
                            if (parent) {
                                parent.navigate('FitnessOnboardingWizard', {
                                    navigateToAfterComplete: 'Home'
                                });
                            } else {
                                // Fallback: try direct navigation (should work in React Navigation v6)
                                props.navigation.navigate('FitnessOnboardingWizard', {
                                    navigateToAfterComplete: 'Home'
                                });
                            }
                        } else {
                            console.log('Onboarding already completed');
                        }
                    }
                })
                .catch(error => {
                    setCheckingOnboarding(false);
                    // Handle different error types with detailed logging
                    if (error?.response) {
                        // Server responded with error status
                        console.error('API Error Response:', {
                            status: error.response.status,
                            statusText: error.response.statusText,
                            data: error.response.data,
                            url: error.config?.url,
                        });
                    } else if (error?.request) {
                        // Request was made but no response received
                        console.error('API Request Error (no response):', {
                            message: error.message,
                            url: error.config?.url,
                        });
                    } else {
                        // Error setting up the request
                        console.error('API Setup Error:', error.message || error);
                    }

                    // Handle specific error cases
                    if (error?.response?.status === 522 || error?.message === 'Request timeout') {
                        console.warn('Onboarding check timed out or server error (522). Allowing user to continue.');
                    }
                    // Don't block user if API fails - allow normal app usage
                });
        } catch (error) {
            setCheckingOnboarding(false);
            console.error('Error in checkOnboardingStatus:', error);
        }
    }

    const onViewMoreClick = () => {
        props.navigation.navigate('CoursesStack');
    }

    const onCourseClick = (course) => {
        props.navigation.navigate('CourseDetailScreen', { courseId: course.id || '' });
    }

    return (
        <SafeAreaView style={{ ...safeAreaStyle, backgroundColor: COLORS.light_purple }} edges={['top']}>
            <ScrollView style={{ flex: 1, }}>
                {/* Header View */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Home</Text>
                    {isAuthenticated && <TouchableOpacity style={styles.profileIcon}>
                        <Text style={styles.userNameText}>{userChar}</Text>
                    </TouchableOpacity>}
                </View>

                {/* Logo container */}
                <View style={styles.logoContainer}>
                    <FastImage
                        source={IMAGES.HOME_SCREEN_LOGO_V1}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subTitleText}>Eat smart.{'\n'}Think smarter.</Text>
                    <Text style={styles.subText1}>Rewire your brain for success</Text>
                </View>
                <View style={{ flex: 1, marginTop: 30 }}>
                    {/* <Text style={{ ...styles.headerTitle, fontSize: 20 }}>{`Courses`}</Text> */}
                    <Text style={styles.subHeaderTitle}>{`Top featured courses`}</Text>
                    <CoursesGrid items={courses} loading={loading} onCardPress={(item) => onCourseClick(item)} />
                    <TouchableOpacity onPress={() => onViewMoreClick()} style={styles.viewMoreBtn} activeOpacity={0.5}>
                        <Text style={styles.viewMoreText}>View more</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 30 }} />
                <Text style={styles.subHeaderTitle}>{`Lasting weight-loss`}</Text>
                <LastingWeightsComponent />
                {/* <View style={{ height: 100 }} /> */}

                {/* Contact US */}
                <View style={{ height: 30 }} />
                <Text style={{ ...styles.subHeaderTitle }}>{`Contact us`}</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        paddingHorizontal: 20
    },
    subHeaderTitle: {
        fontSize: 28,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        paddingHorizontal: 20,
        marginBottom: 10
    },
    profileIcon: {
        backgroundColor: '#a855f7',
        borderRadius: 50,
        height: 40,
        width: 40,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userNameText: {
        fontSize: 22,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: COLORS.black
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 80,
    },
    logo: {
        height: 60,
        width: 200,
    },
    subTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    subTitleText: {
        color: COLORS.textColor,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        fontSize: 48,
        textAlign: 'center'
    },
    subText1: {
        marginTop: 15,
        color: COLORS.textColor,
        fontFamily: FONTS.OUTFIT_REGULAR,
        fontSize: 22,
        textAlign: 'center'
    },
    viewMoreBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        // backgroundColor: '#cc99ff',
        backgroundColor: '#a855f7',
        width: windowWidth / 3,
        borderRadius: 10
    },
    viewMoreText: {
        fontFamily: FONTS.OUTFIT_MEDIUM,
        fontSize: 18,
        color: COLORS.white
    }
});
