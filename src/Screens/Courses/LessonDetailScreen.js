import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, Platform, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../Common/Constants/colors'
import RenderHtml from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import LessonNavBar from '../Components/LessonNavBar'
import { windowWidth } from '../../Utils/Dimentions'
import { FONTS } from '../../Common/Constants/fonts'
import { useDispatch, useSelector } from 'react-redux'
import { getLessonDetailAction, createQuizSessionAction, markLessonCompleteAction } from '../../redux/cources/courceActions'
import {
    FileText,
} from 'lucide-react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';
import Snackbar from '../Components/Snackbar';


const LessonDetailScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);
    const [markCompleteLoading, setMarkCompleteLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const lessonId = props.route.params?.lessonId;
    const lessons = props.route.params?.lessons || [];
    const courseId = props.route.params?.courseId;
    const dispatch = useDispatch();
    const lessonData = useSelector(state => state.cource?.lessonDetailData || null);

    useEffect(() => {
        if (lessonId) {
            setLoading(true);
            dispatch(getLessonDetailAction({ lessonId, onSuccess, onFailure }));
        }
    }, [lessonId]);

    const onSuccess = () => {
        setLoading(false);
    };

    const onFailure = () => {
        setLoading(false);
    };

    // Find current lesson index in the lessons array
    const currentLessonIndex = lessons.findIndex(lesson => lesson.ID === lessonId);
    const hasPrevLesson = currentLessonIndex > 0;
    const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1;

    const handlePrevLesson = () => {
        if (hasPrevLesson) {
            const prevLesson = lessons[currentLessonIndex - 1];
            props.navigation.replace('LessonDetailScreen', {
                lessonId: prevLesson.ID,
                lessons: lessons,
                courseId: courseId
            });
        }
    };

    const handleNextLesson = () => {
        if (hasNextLesson) {
            const nextLesson = lessons[currentLessonIndex + 1];
            props.navigation.replace('LessonDetailScreen', {
                lessonId: nextLesson.ID,
                lessons: lessons,
                courseId: courseId
            });
        }
    };

    const renderPrevButton = () => {
        return (
            <TouchableOpacity
                style={[
                    styles.controlButtons,
                    !hasPrevLesson && styles.controlButtonsDisabled
                ]}
                key={1}
                onPress={handlePrevLesson}
                disabled={!hasPrevLesson}
            >
                <Text style={[
                    styles.controlButtonsText,
                    !hasPrevLesson && styles.controlButtonsTextDisabled
                ]}>Prev</Text>
            </TouchableOpacity>
        )
    }

    const renderNextButton = () => {
        return (
            <TouchableOpacity
                style={[
                    styles.controlButtons,
                    !hasNextLesson && styles.controlButtonsDisabled
                ]}
                key={2}
                onPress={handleNextLesson}
                disabled={!hasNextLesson}
            >
                <Text style={[
                    styles.controlButtonsText,
                    !hasNextLesson && styles.controlButtonsTextDisabled
                ]}>Next</Text>
            </TouchableOpacity>
        )
    }

    const OnQuizClick = (quiz) => {
        if (!quiz?.permalink) {
            console.log('Quiz permalink not available');
            return;
        }

        setQuizLoading(true);

        const onQuizSessionSuccess = async (response) => {
            try {
                setQuizLoading(false);
                if (response?.url) {
                    if (await InAppBrowser.isAvailable()) {
                        await InAppBrowser.open(response.url, {
                            // iOS
                            dismissButtonStyle: 'cancel',
                            preferredBarTintColor: COLORS.pr_blue,
                            preferredControlTintColor: 'white',
                            // Android
                            showTitle: true,
                            enableUrlBarHiding: true,
                            enableDefaultShare: false,
                        });
                    } else {
                        console.log('InAppBrowser not available');
                    }
                }
            } catch (error) {
                console.log('Error opening quiz in browser:', error);
                setQuizLoading(false);
            }
        };

        const onQuizSessionFailure = (error) => {
            console.log('Failed to create quiz session:', error);
            setQuizLoading(false);
        };

        dispatch(createQuizSessionAction({
            quizUrl: quiz.permalink,
            onSuccess: onQuizSessionSuccess,
            onFailure: onQuizSessionFailure
        }));
    }

    const OnTopicClick = async (topic) => {
        props.navigation.navigate('TopicDetailScreen', { topicId: topic.ID });
    }

    const OnMarkAsCompleteClick = () => {
        if (!lessonId) {
            setSnackbarMessage('Lesson ID not found');
            setSnackbarType('error');
            setSnackbarVisible(true);
            return;
        }

        setMarkCompleteLoading(true);

        const onMarkCompleteSuccess = (response) => {
            setMarkCompleteLoading(false);
            setSnackbarMessage('Lesson marked as complete!');
            setSnackbarType('success');
            setSnackbarVisible(true);
            // Optionally refresh lesson data to get updated completion status
            if (lessonId) {
                dispatch(getLessonDetailAction({ lessonId, onSuccess: () => { }, onFailure: () => { } }));
            }
        };

        const onMarkCompleteFailure = (error) => {
            setMarkCompleteLoading(false);
            const errorMessage = error?.message || error?.error || 'Failed to mark lesson as complete';
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
            setSnackbarVisible(true);
        };

        dispatch(markLessonCompleteAction({
            lessonId,
            onSuccess: onMarkCompleteSuccess,
            onFailure: onMarkCompleteFailure
        }));
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
                <View style={{ paddingHorizontal: 20 }}>
                    <LessonNavBar
                        onBackPress={() => props.navigation.goBack()}
                    // rightComponents={[renderPrevButton(), renderNextButton()]}
                    />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.pr_blue} />
                    <Text style={styles.loadingText}>Loading lesson...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
            <View style={{ paddingHorizontal: 20 }}>
                <LessonNavBar
                    onBackPress={() => props.navigation.goBack()}
                    rightComponents={lessons.length > 0 ? [renderPrevButton(), renderNextButton()] : []}
                />
            </View>

            {/* Scrollable lesson container */}
            <ScrollView
                style={{ flex: 1, }}
                showsVerticalScrollIndicator={false}
            >
                {/* Lesson Title */}
                {!!lessonData?.title && (
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText} numberOfLines={3}>
                            {lessonData.title}
                        </Text>
                    </View>
                )}

                {/* Lesson Number Container */}
                {lessonData?.menu_order !== undefined && (
                    <View style={styles.lessonNumContainer}>
                        <Text style={styles.lessonNumText} numberOfLines={1}>
                            Lesson {lessonData.menu_order + 1}
                        </Text>
                    </View>
                )}

                {/* HTML Content of the lesson */}
                {!!lessonData?.content && (
                    <View style={styles.htmlContainer}>
                        <RenderHtml
                            contentWidth={Dimensions.get('window').width - 30}
                            source={getLessonHtmlSource(lessonData.content)}
                            tagsStyles={htmlTagsStyles}
                            baseStyle={styles.htmlBaseStyle}
                            defaultTextProps={renderHtmlDefaultTextProps}
                            enableExperimentalMarginCollapsing={true}
                            renderersProps={renderHtmlRenderersProps}
                            renderers={customRenderers}
                            defaultWebViewProps={{
                                allowsInlineMediaPlayback: true,
                                mediaPlaybackRequiresUserAction: false,
                            }}
                        />
                    </View>
                )}

                {/* Topics component */}
                {lessonData?.topics?.length > 0 && <View style={{ ...styles.contentSection, marginBottom: 0 }}>
                    <Text style={styles.sectionTitle}>Lesson Topics</Text>

                    {lessonData?.topics.map((topic) => (
                        <TouchableOpacity onPress={() => OnTopicClick(topic)} key={topic.ID} style={styles.lessonCard}>
                            <View style={styles.lessonContent}>
                                <FileText color="#666" size={24} />
                                <Text style={styles.lessonTitle} numberOfLines={2}>{topic.title}</Text>
                            </View>
                            {topic.is_completed ? <FastImage source={IMAGES.IC_GREEN_SUCCESS} style={styles.checkboxIcon} resizeMode="contain" /> : <View style={styles.checkbox} />}
                        </TouchableOpacity>
                    ))}
                </View>}

                {/* Quiz component */}
                {lessonData?.quizzes?.length > 0 && <View style={styles.contentSection}>
                    <Text style={styles.sectionTitle}>Lesson Quiz</Text>

                    {lessonData?.quizzes.map((quiz) => (
                        <TouchableOpacity onPress={() => OnQuizClick(quiz)} key={quiz.ID} style={styles.lessonCard}>
                            <View style={styles.lessonContent}>
                                <FileText color="#666" size={24} />
                                <Text style={styles.lessonTitle} numberOfLines={2}>{quiz.title}</Text>
                            </View>
                            {quiz.is_completed ? <FastImage source={IMAGES.IC_GREEN_SUCCESS} style={styles.checkboxIcon} resizeMode="contain" /> : <View style={styles.checkbox} />}
                        </TouchableOpacity>
                    ))}
                </View>}

                {!lessonData?.is_completed ? <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.startButton, markCompleteLoading && styles.startButtonDisabled]}
                        onPress={() => OnMarkAsCompleteClick()}
                        disabled={markCompleteLoading}
                    >
                        {markCompleteLoading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Text style={styles.startButtonText}>Mark as Complete</Text>
                        )}
                    </TouchableOpacity>
                </View> : null}
            </ScrollView>

            {/* Quiz Loading Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={quizLoading}
                onRequestClose={() => setQuizLoading(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color={COLORS.pr_blue} />
                        <Text style={styles.modalText}>Loading quiz...</Text>
                    </View>
                </View>
            </Modal>

            {/* Snackbar for success/error messages */}
            <Snackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                type={snackbarType}
                duration={3000}
                onDismiss={() => setSnackbarVisible(false)}
                position="bottom"
            />
        </SafeAreaView>
    )
}

export default LessonDetailScreen

const LIST_MARKER_TEXT_STYLE = {
    fontFamily: FONTS.BROTHER_1816_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textColor,
};

const renderHtmlDefaultTextProps = {
    style: {
        fontFamily: FONTS.BROTHER_1816_REGULAR,
    },
};

// Custom Video Renderer Component
const VideoRenderer = ({ tnode }) => {
    const videoSrc = tnode.attributes?.src || '';
    const videoWidth = tnode.attributes?.width ? parseInt(tnode.attributes.width) : Dimensions.get('window').width - 30;
    const videoHeight = tnode.attributes?.height ? parseInt(tnode.attributes.height) : (Dimensions.get('window').width - 30) * 0.5625; // 16:9 aspect ratio

    if (!videoSrc) return null;

    // Create HTML for video player
    const videoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #000;
                }
                video {
                    width: 100%;
                    height: auto;
                    max-width: 100%;
                }
            </style>
        </head>
        <body>
            <video controls playsinline webkit-playsinline>
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </body>
        </html>
    `;

    return (
        <View style={styles.videoContainer}>
            <WebView
                source={{ html: videoHTML }}
                style={styles.videoWebView}
                scrollEnabled={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']}
            />
        </View>
    );
};

// Custom Figure Renderer to handle figure tags with video
// We only intercept figure tags that contain videos
const FigureRenderer = ({ tnode, TDefaultRenderer, ...props }) => {
    // Check if this is a video figure by class name first (quick check)
    const className = tnode.attributes?.class || tnode.domNode?.getAttribute?.('class') || '';
    const isVideoFigure = className.includes('wp-block-video');

    // If it's not a video figure, don't intercept - let default handle images
    if (!isVideoFigure) {
        if (TDefaultRenderer) {
            return <TDefaultRenderer tnode={tnode} {...props} />;
        }
        return null;
    }

    // Try to extract video source from figure tag
    let videoSrc = null;

    // Method 1: Check raw HTML string for video tag (most reliable)
    if (tnode.rawHTML) {
        const videoMatch = tnode.rawHTML.match(/<video[^>]+src=["']([^"']+)["']/i);
        if (videoMatch && videoMatch[1]) {
            videoSrc = videoMatch[1];
        }
    }

    // Method 2: Try to find video in domNode
    if (!videoSrc && tnode.domNode) {
        try {
            const videoElement = tnode.domNode.querySelector?.('video');
            if (videoElement) {
                videoSrc = videoElement.getAttribute('src') || videoElement.src;
            }
        } catch (e) {
            // Ignore errors
        }
    }

    // Method 3: Check children recursively
    if (!videoSrc && tnode.children) {
        const findVideoSrc = (child) => {
            if (!child) return null;

            if (child.tagName === 'video' || child.type === 'video') {
                return child.attributes?.src || child.props?.src;
            }

            if (child.children) {
                const childrenArray = Array.isArray(child.children) ? child.children : [child.children].filter(Boolean);
                for (const subChild of childrenArray) {
                    const found = findVideoSrc(subChild);
                    if (found) return found;
                }
            }

            return null;
        };

        const childrenArray = Array.isArray(tnode.children) ? tnode.children : [tnode.children].filter(Boolean);
        for (const child of childrenArray) {
            videoSrc = findVideoSrc(child);
            if (videoSrc) break;
        }
    }

    // If video found, render custom video player
    if (videoSrc) {
        const videoHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #000;
                    }
                    video {
                        width: 100%;
                        height: auto;
                        max-width: 100%;
                    }
                </style>
            </head>
            <body>
                <video controls playsinline webkit-playsinline>
                    <source src="${videoSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </body>
            </html>
        `;

        return (
            <View style={styles.videoContainer}>
                <WebView
                    source={{ html: videoHTML }}
                    style={styles.videoWebView}
                    scrollEnabled={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    originWhitelist={['*']}
                />
            </View>
        );
    }

    // If no video found, use TDefaultRenderer if available, otherwise return null
    // This allows images to render normally
    if (TDefaultRenderer) {
        return <TDefaultRenderer tnode={tnode} {...props} />;
    }

    // Fallback: return null to let default renderer handle it
    return null;
};

const renderHtmlRenderersProps = {
    img: {
        enableExperimentalPercentWidth: true,
    },
    ul: {
        // Keep bullet marker aligned with first line of text (prevents marker stacking above content)
        markerBoxStyle: { paddingTop: 2 },
        markerTextStyle: LIST_MARKER_TEXT_STYLE,
        itemContentStyle: { flex: 1 },
    },
    ol: {
        markerBoxStyle: { paddingTop: 2 },
        markerTextStyle: LIST_MARKER_TEXT_STYLE,
        itemContentStyle: { flex: 1 },
    },
};

// Custom renderers for video and figure tags
const customRenderers = {
    video: VideoRenderer,
    figure: FigureRenderer,
};

const getLessonHtmlSource = (html) => ({ html: html || '' });

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
        backgroundColor: COLORS.bg_color,
    },
    controlButtons: {
        backgroundColor: COLORS.purple,
        width: windowWidth / 6,
        marginVertical: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    },
    controlButtonsText: {
        fontFamily: FONTS.BROTHER_1816_BOLD,
        fontSize: 14,
        color: COLORS.white,
    },
    controlButtonsDisabled: {
        backgroundColor: COLORS.grayBg,
        opacity: 0.5,
    },
    controlButtonsTextDisabled: {
        color: COLORS.grayText,
    },
    titleContainer: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    lessonNumContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
    },
    titleText: {
        fontFamily: FONTS.BROTHER_1816_BOLD,
        fontSize: 24,
        color: COLORS.textColor,
        textAlign: 'left'
    },
    lessonNumText: {
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontSize: 14,
        color: COLORS.textColor44,
        textAlign: 'left'
    },
    htmlContainer: {
        marginTop: 20,
        paddingHorizontal: 15,
        paddingBottom: 10,
        width: '100%',
        ...(Platform.OS === 'android' && {
            flex: 1,
        }),
    },
    htmlBaseStyle: {
        ...(Platform.OS === 'ios' && { fontFamily: FONTS.BROTHER_1816_REGULAR }),
        fontSize: 16,
        color: COLORS.textColor,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textColor,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
    },
    contentSection: {
        marginBottom: 20,
        paddingHorizontal: 15,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 150,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textColor,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        textAlign: 'center',
    },
    buttonContainer: {
        // position: 'absolute',
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
    startButtonDisabled: {
        opacity: 0.6,
    },
    videoContainer: {
        width: '100%',
        marginVertical: 16,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: COLORS.black,
    },
    videoWebView: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: COLORS.black,
    },
})