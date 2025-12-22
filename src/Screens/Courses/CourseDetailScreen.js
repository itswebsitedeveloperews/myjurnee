import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    Platform
} from 'react-native';
import {
    FileText,
} from 'lucide-react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../Common/Constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import { windowHeight, windowWidth } from '../../Utils/Dimentions';
import INavBar from '../Components/INavBar';
import { FONTS } from '../../Common/Constants/fonts';
import { getCourseDetailAction, getCourseProgressAction, enrollCourseAction } from '../../redux/cources/courceActions';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../Utils/Utils';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';
import Snackbar from '../Components/Snackbar';

const source = {
    html: `
  <div class="ld-tabs ld-tab-count-1">
	
	<div class="ld-tabs-content">
		
							<div class="ld-tab-content ld-visible" id="ld-tab-content-223">
											
<p><em>A Registered Dietician’s Practical Guide to Navigating Social Eating Without Sabotaging Your Goals</em></p>



<h2 class="wp-block-heading">Welcome to Your Social Success Revolution!</h2>



<p>Hey there, social butterfly! Welcome to what might be the most liberating course you’ll ever take for weight loss success. I’m absolutely thrilled you’re here because we’re about to tackle one of the biggest challenges people face on their weight loss journey – how to maintain your goals while still enjoying a rich, social life!</p>



<p>You know what? So many people think that losing weight means becoming a social hermit, turning down invitations, or being “that person” who makes everyone else feel awkward about their food choices. But I’m here to tell you that’s complete rubbish! You can absolutely maintain an active social life AND achieve your weight loss goals.</p>



<p>As a registered dietician, I’ve helped thousands of people navigate everything from pub nights to wedding receptions, from work lunches to family gatherings, all while staying true to their health goals. The secret isn’t avoiding social situations – it’s learning how to navigate them like a pro!</p>



<h2 class="wp-block-heading">What You’ll Master in This Course</h2>



<p>By the end of this empowering journey, you’ll be able to:</p>



<ul class="wp-block-list">
<li><strong>Communicate confidently</strong> with friends and family about your health goals</li>



<li><strong>Handle peer pressure</strong> with grace and maintain your boundaries</li>



<li><strong>Make smart choices</strong> at any UK restaurant, pub, or takeaway</li>



<li><strong>Navigate group meals</strong> without feeling deprived or awkward</li>



<li><strong>Choose better drinks</strong> (both alcoholic and non-alcoholic) that support your goals</li>



<li><strong>Enjoy social eating</strong> while staying on track with your weight loss</li>



<li><strong>Feel confident</strong> in any social eating situation</li>
</ul>



<h2 class="wp-block-heading">Who This Course Is For</h2>



<p>This course is perfect for you if:</p>



<ul class="wp-block-list">
<li>You love socializing but worry it’s sabotaging your weight loss</li>



<li>You feel awkward or different when trying to eat healthily around others</li>



<li>You struggle with peer pressure around food and drinks</li>



<li>You want practical strategies for real UK social eating situations</li>



<li>You’re tired of feeling like you have to choose between your social life and your health goals</li>



<li>You want to feel confident and comfortable in any eating situation</li>
</ul>
			</div>

			
	</div> <!--/.ld-tabs-content-->

</div>
    `
};

const CourseDetailScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Progress percentage (0-100)
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const courseId = props.route.params?.courseId;
    const dispatch = useDispatch();
    const courseData = useSelector(state => state.cource?.courseDetailData || null);
    const courseProgress = useSelector(state => state.cource?.courseProgress || null);

    const fetchCourseData = React.useCallback((showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }
        localStorageHelper.getItemFromStorage(StorageKeys.USER_ID).then(userId => {
            const onSuccess = () => {
                setLoading(false);
            };

            const onFailure = () => {
                setLoading(false);
            };

            const onProgressSuccess = (response) => {
                // Progress is handled in the useEffect above
                // This callback can be used for additional logic if needed
            };

            const onProgressFailure = () => {
                // Handle progress fetch failure - keep default progress value (0)
                console.log('Failed to fetch course progress');
            };

            dispatch(getCourseDetailAction({ courseId, userId: userId, onSuccess, onFailure }));
            // Fetch course progress
            dispatch(getCourseProgressAction({
                courseId,
                userId: userId,
                onSuccess: onProgressSuccess,
                onFailure: onProgressFailure
            }));
        });
    }, [courseId, dispatch]);

    useEffect(() => {
        fetchCourseData(true);
    }, [fetchCourseData]);

    // Refresh course data and progress when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            // Refresh data when returning to this screen (e.g., after marking lesson as complete)
            fetchCourseData(false);
        }, [fetchCourseData])
    );

    // Update progress when courseProgress changes
    useEffect(() => {
        if (courseProgress !== null && courseProgress !== undefined) {
            // API response structure:
            // {
            //   "user_id": 1,
            //   "course_id": 63,
            //   "status": "in-progress",
            //   "percentage": 33,
            //   "completed_steps": 2,
            //   "total_steps": 6
            // }
            let progressValue = 0;

            if (typeof courseProgress === 'object' && courseProgress.percentage !== undefined) {
                progressValue = courseProgress.percentage;
            } else if (typeof courseProgress === 'number') {
                progressValue = courseProgress;
            } else {
                progressValue = parseFloat(courseProgress) || 0;
            }

            // Ensure progress is between 0 and 100
            progressValue = Math.max(0, Math.min(100, parseFloat(progressValue)));
            setProgress(progressValue);
        }
    }, [courseProgress]);


    const scrollY = useRef(new Animated.Value(0)).current;

    const lessons = [
        { id: 1, title: 'Communication and Confide...', completed: true },
        { id: 2, title: 'Smart Choices at UK Restaura...', completed: false },
        { id: 3, title: 'Smart Drink Choices – Alcohol...', completed: false },
        { id: 4, title: 'Smart Drink Choices – Alcohol...', completed: false },
    ];

    // Header opacity decreases as user scrolls
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    // Header translateY moves up as user scrolls
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const OnLessonClick = (lessonId) => {
        props.navigation.navigate('LessonDetailScreen', {
            lessonId,
            lessons: courseData?.lessons || [],
            courseId: courseId
        });
    }

    const OnStartCourseClick = () => {
        // Check if lessons are available
        if (!courseData?.lessons || courseData.lessons.length === 0) {
            console.log('No lessons available for this course');
            setSnackbarMessage('No lessons available for this course');
            setSnackbarType('error');
            setSnackbarVisible(true);
            return;
        }

        // Get the first lesson
        const firstLesson = courseData.lessons[0];

        if (!firstLesson || !firstLesson.ID) {
            console.log('First lesson data is invalid');
            return;
        }

        // Navigate to the first lesson detail screen
        props.navigation.navigate('LessonDetailScreen', {
            lessonId: firstLesson.ID,
            lessons: courseData.lessons,
            courseId: courseId
        });
    }

    const OnEnrollCourseClick = () => {
        setLoading(true);
        localStorageHelper.getItemFromStorage(StorageKeys.USER_ID).then(userId => {
            const onSuccess = () => {
                setLoading(false);
                setSnackbarMessage('Successfully enrolled in course');
                setSnackbarType('success');
                setSnackbarVisible(true);
                // Refresh course data to get updated enrollment status
                fetchCourseData(false);
            };

            const onFailure = (error) => {
                setLoading(false);
                const errorMessage = error?.message || error || 'Failed to enroll in course';
                setSnackbarMessage(errorMessage);
                setSnackbarType('error');
                setSnackbarVisible(true);
            };

            dispatch(enrollCourseAction({ courseId, userId: userId, onSuccess, onFailure }));
        });
    }

    const OnJoinNowClick = () => {
        props.navigation.goBack();
    }

    // Check if membership is required but user doesn't have it
    const isMembershipRequired = courseData?.membership_required === true &&
        courseData?.user_has_membership === false &&
        courseData?.can_enroll === false;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.pr_blue} />
                    <Text style={styles.loadingText}>Loading course detail...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
            <View style={{ paddingHorizontal: 20, }}>
                <INavBar title="" onBackPress={() => props.navigation.goBack()} />
            </View>

            <Animated.View
                style={[
                    styles.headerContainer,
                    {
                        opacity: headerOpacity,
                        transform: [{ translateY: headerTranslateY }],
                    }
                ]}
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.6)', 'transparent']}
                    style={styles.gradientOverlay}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                />
                <View style={{ height: 30 }} />
                <Text style={styles.courseTitle} numberOfLines={5}>
                    {courseData.title || ''}
                </Text>
                <Text style={styles.dateText}>{formatDate(courseData.publish_date) || ''}</Text>
            </Animated.View>

            <Animated.ScrollView
                style={{ flex: 1, }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                <View style={{ height: windowHeight / 2.9 }} />

                {/* Content Container - Wrapped for overlay positioning */}
                <View style={styles.contentContainer}>
                    {/* Hide COURSE INCLUDES card when membership is required */}
                    {!isMembershipRequired && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>COURSE INCLUDES</Text>
                            <View style={styles.includesRow}>
                                <FileText color="#666" size={28} />
                                <Text style={styles.includesText}>{courseData.lessons?.length || 0} Lessons</Text>
                            </View>
                        </View>
                    )}

                    {/* Hide Course Content section when membership is required */}
                    {!isMembershipRequired && courseData?.lessons?.length > 0 && (
                        <View style={styles.contentSection}>
                            <Text style={styles.sectionTitle}>Course Content</Text>

                            {courseData?.lessons.map((lesson) => (
                                <TouchableOpacity
                                    onPress={() => OnLessonClick(lesson.ID)}
                                    key={lesson.ID}
                                    style={styles.lessonCard}
                                >
                                    <View style={styles.lessonContent}>
                                        <FileText color="#666" size={24} />
                                        <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                                    </View>
                                    {lesson.is_completed ? <FastImage source={IMAGES.IC_GREEN_SUCCESS} style={styles.checkboxIcon} resizeMode="contain" /> : <View style={styles.checkbox} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Progress Bar Section - Only show if status is not "not-enrolled" and membership is not required */}
                    {!isMembershipRequired &&
                        courseProgress &&
                        courseProgress.status &&
                        courseProgress.status !== 'not-enrolled' && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarWrapper}>
                                    <View style={styles.progressBarSection}>
                                        <View style={styles.progressBarBackground}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    {
                                                        width: `${progress}%`,
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <View style={styles.progressInfo}>
                                            <Text style={styles.progressText}>
                                                {Math.round(progress)}% COMPLETE
                                            </Text>
                                            <View style={styles.statusButton}>
                                                <Text style={styles.statusButtonText}>
                                                    {courseProgress.status === 'in-progress' ? 'IN PROGRESS' : courseProgress.status?.toUpperCase() || 'IN PROGRESS'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                    {/* Course Description */}
                    <View style={styles.courseDescription}>
                        <View style={isMembershipRequired ? styles.blurredContent : null}>
                            <Text style={styles.sectionTitle}>Course Description</Text>
                            <RenderHtml
                                contentWidth={windowWidth}
                                source={{
                                    html: courseData.content
                                }}
                                tagsStyles={htmlTagsStyles}
                                baseStyle={styles.htmlBaseStyle}
                                defaultTextProps={renderHtmlDefaultTextProps}
                                renderersProps={renderHtmlRenderersProps}
                            />
                        </View>
                    </View>

                    {/* Membership Required Overlay - Positioned over content area */}
                    {isMembershipRequired && (
                        <View style={styles.membershipOverlay}>
                            <View style={styles.membershipModal}>
                                <Text style={styles.membershipHeader}>Subscription Membership Required</Text>
                                <Text style={styles.membershipContent}>
                                    You must be a 6 Months Subscription member to access this content.
                                </Text>
                                <TouchableOpacity style={styles.joinNowButton} onPress={() => OnJoinNowClick()}>
                                    <Text style={styles.joinNowButtonText}>Go Back</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
                <View style={{ height: 70 }} />
            </Animated.ScrollView>


            {/* Take this Course Button - Show when user can enroll but is not enrolled */}
            {courseData?.can_enroll === true &&
                courseData?.is_enrolled === false &&
                !isMembershipRequired && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.startButton} onPress={() => OnEnrollCourseClick()}>
                            <Text style={styles.startButtonText}>Take this Course</Text>
                        </TouchableOpacity>
                    </View>
                )}

            {/* Start Course Button - Show when enrolled and course is not started */}
            {!isMembershipRequired &&
                courseData?.status == 'not-started' &&
                courseData?.lessons?.length > 0 &&
                courseData?.is_enrolled === true && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.startButton} onPress={() => OnStartCourseClick()}>
                            <Text style={styles.startButtonText}>Start Course</Text>
                        </TouchableOpacity>
                    </View>
                )}

            <Snackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                type={snackbarType}
                duration={3000}
                position="top"
                onDismiss={() => setSnackbarVisible(false)}
            />

        </SafeAreaView >
    );
}

const renderHtmlDefaultTextProps = {
    style: {
        fontFamily: FONTS.BROTHER_1816_REGULAR,
    },
};

const renderHtmlRenderersProps = {
    ul: {
        markerBoxStyle: { paddingTop: 2 },
        markerTextStyle: {
            fontFamily: FONTS.BROTHER_1816_REGULAR,
            fontSize: 16,
            lineHeight: 24,
            color: COLORS.textColor,
        },
        itemContentStyle: { flex: 1 },
    },
    ol: {
        markerBoxStyle: { paddingTop: 2 },
        markerTextStyle: {
            fontFamily: FONTS.BROTHER_1816_REGULAR,
            fontSize: 16,
            lineHeight: 24,
            color: COLORS.textColor,
        },
        itemContentStyle: { flex: 1 },
    },
};

// HTML Tags Styles - Platform specific font handling
const getHtmlTagsStyles = () => {
    const baseStyles = {
        h1: {
            fontSize: 28,
            color: COLORS.textColor,
            marginTop: 24,
            marginBottom: 12,
            fontWeight: 'bold',
        },
        h2: {
            fontSize: 24,
            color: COLORS.textColor,
            marginTop: 20,
            marginBottom: 10,
            fontWeight: 'bold',
        },
        h3: {
            fontSize: 20,
            color: COLORS.textColor,
            marginTop: 18,
            marginBottom: 8,
            fontWeight: '600',
        },
        h4: {
            fontSize: 18,
            color: COLORS.textColor,
            marginTop: 16,
            marginBottom: 8,
            fontWeight: '600',
        },
        p: {
            fontSize: 16,
            color: COLORS.textColor,
            marginTop: 12,
            marginBottom: 12,
        },
        ul: {
            marginTop: 12,
            marginBottom: 12,
            paddingLeft: 20,
        },
        ol: {
            marginTop: 12,
            marginBottom: 12,
            paddingLeft: 20,
        },
        li: {
            fontSize: 16,
            color: COLORS.textColor,
            lineHeight: 24,
            marginTop: 0,
            marginBottom: 0,
        },
        strong: {
            fontWeight: 'bold',
            color: COLORS.textColor,
        },
        em: {
            fontStyle: 'italic',
            color: COLORS.textColor,
        },
        a: {
            color: COLORS.pr_blue,
            textDecorationLine: 'underline',
            fontWeight: '600',
        },
        blockquote: {
            fontSize: 16,
            color: COLORS.textColor,
            fontStyle: 'italic',
            borderLeftWidth: 4,
            borderLeftColor: COLORS.pr_blue,
            paddingLeft: 16,
            marginTop: 12,
            marginBottom: 12,
        },
        code: {
            fontSize: 14,
            backgroundColor: COLORS.grayBg,
            padding: 4,
            borderRadius: 4,
        },
    };

    // Add fontFamily for iOS, use fontWeight for Android
    if (Platform.OS === 'ios') {
        return {
            ...baseStyles,
            h1: { ...baseStyles.h1, fontFamily: FONTS.BROTHER_1816_BOLD },
            h2: { ...baseStyles.h2, fontFamily: FONTS.BROTHER_1816_BOLD },
            h3: { ...baseStyles.h3, fontFamily: FONTS.BROTHER_1816_MEDIUM },
            h4: { ...baseStyles.h4, fontFamily: FONTS.BROTHER_1816_MEDIUM },
            p: { ...baseStyles.p, fontFamily: FONTS.BROTHER_1816_REGULAR },
            li: { ...baseStyles.li, fontFamily: FONTS.BROTHER_1816_REGULAR },
            strong: { ...baseStyles.strong, fontFamily: FONTS.BROTHER_1816_BOLD },
            em: { ...baseStyles.em, fontFamily: FONTS.BROTHER_1816_REGULAR },
            a: { ...baseStyles.a, fontFamily: FONTS.BROTHER_1816_MEDIUM },
            blockquote: { ...baseStyles.blockquote, fontFamily: FONTS.BROTHER_1816_REGULAR },
            code: { ...baseStyles.code, fontFamily: FONTS.BROTHER_1816_REGULAR },
        };
    }

    return baseStyles;
};

const htmlTagsStyles = getHtmlTagsStyles();

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: '#c7d2fe',
        backgroundColor: COLORS.bg_color,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        position: 'absolute',
        top: 100,
        right: 0,
        left: 0,
        height: 340,
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 340,
    },
    courseTitle: {
        fontSize: 34,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.textColor,
        lineHeight: 38,
        marginBottom: 12,
        paddingHorizontal: 15,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 14,
        color: COLORS.grayText,
        marginTop: 8,
        textAlign: 'center'
    },
    scrollView: {
        flex: 1,
    },
    card: {
        marginHorizontal: 20,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 14,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.textColor,
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    includesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    includesText: {
        fontSize: 18,
        color: COLORS.textColor,
        marginLeft: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR
    },
    contentSection: {
        // paddingHorizontal: 24,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.grayText,
        marginBottom: 16,
    },
    lessonCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    lessonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    lessonTitle: {
        fontSize: 17,
        color: COLORS.textColor,
        marginLeft: 16,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#d1d5db',
        marginLeft: 12,
    },
    checkboxIcon: {
        width: 24,
        height: 24,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.pr_lavender,
        borderTopWidth: 0.5,
        borderBottomColor: COLORS.pr_lavender,
        borderBottomWidth: 0.2,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    startButton: {
        backgroundColor: COLORS.purple,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    courseDescription: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    htmlBaseStyle: {
        ...(Platform.OS === 'ios' && { fontFamily: FONTS.BROTHER_1816_REGULAR }),
        fontSize: 16,
        color: COLORS.textColor,
    },
    progressContainer: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    progressBarWrapper: {
        backgroundColor: '#FFF', // Light grey background
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    progressBarSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        flex: 1,
        height: 12,
        backgroundColor: COLORS.grayBg,
        borderRadius: 6,
        overflow: 'hidden',
        marginRight: 12,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981', // Teal-green color
        borderRadius: 6,
    },
    progressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: '#10B981', // Teal-green color
        letterSpacing: 0.5,
        marginRight: 12,
    },
    statusButton: {
        backgroundColor: COLORS.purple,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    statusButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    blurredContent: {
        opacity: 0.1,
    },
    disabledLessonCard: {
        opacity: 0.3,
    },
    contentContainer: {
        position: 'relative',
    },
    membershipOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 1000,
        paddingTop: 40,
    },
    membershipModal: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 20,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        maxWidth: windowWidth - 40,
    },
    membershipHeader: {
        fontSize: 22,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.textColor,
        marginBottom: 16,
        textAlign: 'center',
    },
    membershipContent: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.grayText,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 24,
    },
    joinNowButton: {
        backgroundColor: COLORS.purple,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        minWidth: 150,
        alignItems: 'center',
    },
    joinNowButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontWeight: '600',
    },
});

export default CourseDetailScreen;