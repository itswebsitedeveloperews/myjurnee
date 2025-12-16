import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { dashboadData } from '../../Utils/Data';
import { windowHeight, windowWidth } from '../../Utils/Dimentions';
import { useDispatch, useSelector } from 'react-redux';
import MembershipCard from '../Components/MembershipCard'
import { SafeAreaView } from 'react-native-safe-area-context';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';
import FastImage from 'react-native-fast-image';
import CoursesGrid from '../Components/CoursesGrid'
import { IMAGES } from '../../Common/Constants/images';
import { getCourseAction } from '../../redux/cources/courceActions';
import { getCheckoutSessionAction, getMembershipPlansAction } from '../../redux/dashboard/dashboardActions';
import { getProfileData } from '../../redux/profile/profileActions';
import IButton from '../Components/IButton';
import { getUserFitnessDetails } from '../../api/profileApi';
import ISearchBar from '../Components/ISearchBar';

const benefits = [
    { id: '1', icon: IMAGES.IC_LOCK, title: 'Unlock Extra Discount', subtitle: '& Low Prices' },
    { id: '2', icon: IMAGES.IC_SAVING, title: 'Instant Extra Discount', subtitle: 'In Flash Sales/ BOGO' },
    { id: '3', icon: IMAGES.IC_CASHBACK, title: 'Earn Extra Cashback', subtitle: 'as uCoin Cash' },
];
const Home = props => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    const [userChar, setUserChar] = useState('');
    const [courses, setCourses] = useState([]);
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();

    const membershipPlans = useSelector(state => state.dashboard?.membershipPlansData)
    const profileData = useSelector(state => state.profile?.profileData)

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
        setPlansLoading(true);

        localStorageHelper.getItemFromStorage(StorageKeys.USER_ID).then(userId => {
            dispatch(getCourseAction({ userId: userId, onSuccess, onFailure }));
            dispatch(getMembershipPlansAction({ userId: userId, onSuccessPlans, onFailurePlans }));
        });
        dispatch(getProfileData({ onSuccessProfile, onFailureProfile }));
    }, [isAuthenticated]);

    const onSuccess = (response) => {
        setLoading(false);
        transformCoursesToCards(response);
    };

    const onFailure = () => {
        setLoading(false);
    };

    const onSuccessPlans = (response) => {
        setPlansLoading(false);
        // transformCoursesToCards(response);
    };

    const onFailurePlans = () => {
        setPlansLoading(false);
    };

    const onSuccessProfile = () => {
        // Profile data loaded successfully
        console.log('Profile data loaded:', profileData);
    };

    const onFailureProfile = () => {
        // Handle profile data loading failure
        console.log('Failed to load profile data');
    };


    const transformCoursesToCards = (courses) => {
        const bgColors = ['#5E3BB9', '#C7463A', '#7A8593', '#D3792F'];

        // Sample course names and instructors for display
        const courseNames = ['Juri', 'Lingo', 'Speak', 'Talk'];
        const instructors = ['Shak', 'Alex', 'Maria', 'John'];

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
                featured_image: course.featured_image,
                permalink: course.permalink, // if you need navigation later
                courseName: courseNames[index % courseNames.length], // For display in gradient
                instructor: course.author || instructors[index % instructors.length], // Use author if available
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
                // const charOfName = getInitial(userName);
                setUserChar(userName);
            });
    }

    const onMembershipCardPress = (plan) => {

        if (!profileData?.email) {
            return;
        }
        setPlansLoading(true);
        const data = {
            level_id: plan?.id,
            email: profileData?.email || '',
        }
        dispatch(getCheckoutSessionAction({ data, onSuccessCheckout, onFailureCheckout }));
    }
    const onSuccessCheckout = (response) => {
        console.log('onSuccessCheckout ---', response)
        openCheckout(response);
        setPlansLoading(false);
    }
    const onFailureCheckout = () => {
        console.log('onFailureCheckout ---')
        setPlansLoading(false);
    }

    const renderMembershipPlans = () => {
        if (plansLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
                    <ActivityIndicator color={COLORS.black} size={'small'} />
                </View>
            )
        }

        return (
            <>
                {membershipPlans.map(plan => (
                    <MembershipCard
                        key={plan.id}
                        title={plan.title}
                        price={plan.price}
                        period={plan.period}
                        subtitle={plan.subtitle}
                        benefits={plan.benefits}
                        linearColor={plan.linearColor}
                        backgroundColor={plan.backgroundColor}
                        purchased={plan.purchased}
                        onPress={() => onMembershipCardPress(plan)}
                    />
                ))}
            </>
        )
    }



    const openCheckout = async (url) => {
        try {
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: '#453AA4',
                    preferredControlTintColor: 'white',
                    // Android
                    showTitle: true,
                    enableUrlBarHiding: true,
                    enableDefaultShare: false,
                });
                console.log('inappbrowser result', result);

                // Refresh membership plans when browser closes (regardless of result type)
                // This ensures cards are updated if user completed checkout
                refreshMembershipPlans();
            } else {
                // fallback to system browser
                await Linking.openURL(url);
                // Refresh after a delay to allow time for checkout completion
                setTimeout(() => {
                    refreshMembershipPlans();
                }, 2000);
            }
        } catch (error) {
            console.error('openCheckout error', error);
            await Linking.openURL(url);
            // Refresh after a delay to allow time for checkout completion
            setTimeout(() => {
                refreshMembershipPlans();
            }, 2000);
        }
    };

    const refreshMembershipPlans = () => {
        localStorageHelper.getItemFromStorage(StorageKeys.USER_ID).then(userId => {
            if (userId) {
                setPlansLoading(true);
                dispatch(getMembershipPlansAction({
                    userId: userId,
                    onSuccessPlans: () => {
                        setPlansLoading(false);
                    },
                    onFailurePlans: () => {
                        setPlansLoading(false);
                    }
                }));
            }
        });
    };

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
        <SafeAreaView style={{ ...safeAreaStyle, backgroundColor: COLORS.bg_color }} edges={['top']}>
            <ScrollView style={{ flex: 1, }}>
                {/* Header View */}
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.headerTitle}>Hi, {userChar}</Text>
                        <Text style={styles.headerSubTitle}>Find your lessons today!</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        {/* <TouchableOpacity style={styles.bellButton}>
                            <FastImage source={IMAGES.IC_BELL} style={styles.bellIcon} />
                        </TouchableOpacity> */}
                    </View>
                </View>

                {/* Search Bar and Filter Button */}
                {/* <View style={styles.searchContainer}>
                    <View style={styles.searchBarWrapper}>
                        <ISearchBar
                            value={searchValue}
                            onChangeText={setSearchValue}
                            searchIcon={IMAGES.IC_GRAY_SEARCH}
                            placeholder="Search now..."
                            containerStyle={styles.searchBarStyle}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                        <Image source={IMAGES.IC_FILTER} style={styles.filterIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </View> */}


                <View style={{ flex: 1, marginTop: 30 }}>
                    {/* <Text style={{ ...styles.headerTitle, fontSize: 20 }}>{`Courses`}</Text> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.subHeaderTitle}>{`Top featured courses`}</Text>
                        <TouchableOpacity onPress={() => onViewMoreClick()} style={styles.viewMoreBtn} activeOpacity={0.5}>
                            <Text style={styles.viewMoreBtnText}>View more</Text>
                        </TouchableOpacity>
                    </View>
                    <CoursesGrid items={courses} loading={loading} onCardPress={(item) => onCourseClick(item)} />
                </View>

                <View style={{ marginTop: 25 }}>
                    <Text style={styles.subHeaderTitle}>{`Pricing`}</Text>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    {renderMembershipPlans()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingHorizontal: 15
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.titleColor,
    },
    headerSubTitle: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.subTitleColor,
        marginTop: 3
    },
    subHeaderTitle: {
        fontSize: 20,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.black,
        paddingHorizontal: 20,
        marginBottom: 10
    },
    viewMoreBtnText: {
        fontSize: 16,
        textDecorationLine: 'underline',
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.black,
        marginRight: 10
        // paddingHorizontal: 20,
        // marginBottom: 10
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
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
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
    viewMoreBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 8,
    },
    subTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    subTitleText: {
        color: COLORS.textColor,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontSize: 48,
        textAlign: 'center'
    },
    subText1: {
        marginTop: 15,
        color: COLORS.textColor,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        fontSize: 22,
        textAlign: 'center'
    },

    viewMoreText: {
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontSize: 18,
        color: COLORS.black
    },
    bellIcon: {
        height: 20,
        width: 22
    },
    bellButton: {
        padding: 15, backgroundColor: COLORS.white, borderRadius: 14
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 22,
        gap: 15
    },
    searchBarWrapper: {
        flex: 1
    },
    searchBarStyle: {
        backgroundColor: COLORS.white,
        borderWidth: 0,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
    },
    filterButton: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.purple,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.white
    }
});
