import { ScrollView, StatusBar, StyleSheet, Text, View, ActivityIndicator, Dimensions, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../Common/Constants/colors'
import RenderHtml from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import LessonNavBar from '../Components/LessonNavBar'
import { FONTS } from '../../Common/Constants/fonts'
import { useDispatch, useSelector } from 'react-redux'
import { getLessonDetailAction, getTopicDetailAction, markLessonCompleteAction } from '../../redux/cources/courceActions'
import Snackbar from '../Components/Snackbar';


const TopicDetailScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [markCompleteLoading, setMarkCompleteLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const topicId = props.route.params?.topicId;
    const lessonId = props.route.params?.lessonId;

    const dispatch = useDispatch();
    const topicData = useSelector(state => state.cource?.topicDetailData || null);

    useEffect(() => {
        if (topicId) {
            setLoading(true);
            dispatch(getTopicDetailAction({ topicId, onSuccess, onFailure }));
        }
    }, [topicId]);

    const onSuccess = () => {
        setLoading(false);
    };

    const onFailure = () => {
        setLoading(false);
    };

    const OnMarkAsCompleteClick = () => {
        if (!topicId) {
            setSnackbarMessage('Topic ID not found');
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
            setTimeout(() => {
                // Go back to LessonDetailScreen, which removes TopicDetailScreen from the stack
                // The focus effect in LessonDetailScreen will automatically refresh the data
                props.navigation.goBack();
            }, 1000);
        };

        const onMarkCompleteFailure = (error) => {
            setMarkCompleteLoading(false);
            const errorMessage = error?.message || error?.error || 'Failed to mark lesson as complete';
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
            setSnackbarVisible(true);
        };

        dispatch(markLessonCompleteAction({
            lessonId: topicId,
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
                    />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.purple} />
                    <Text style={styles.loadingText}>Loading topic...</Text>
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
                />
            </View>

            {/* Scrollable topic container */}
            <ScrollView
                style={{ flex: 1, }}
                showsVerticalScrollIndicator={false}
            >
                {/* Topic Title */}
                {!!topicData?.title && (
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText} numberOfLines={3}>
                            {topicData.title}
                        </Text>
                    </View>
                )}

                {topicData?.status && (
                    <View style={styles.topicStatusContainer}>
                        <Text style={styles.topicStatusText} numberOfLines={1}>
                            STATUS: {topicData.status === 'in-progress' ? 'IN-PROGRESS' : topicData.status?.toUpperCase() || topicData.status}
                        </Text>
                    </View>
                )}
                {/* HTML Content of the topic */}
                {!!topicData?.content && (
                    <View style={styles.htmlContainer}>
                        <RenderHtml
                            contentWidth={Dimensions.get('window').width - 30}
                            source={getTopicHtmlSource(topicData.content)}
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

                {!topicData?.is_completed && <View style={styles.buttonContainer}>
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
                </View>}
            </ScrollView>
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

export default TopicDetailScreen

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

const getTopicHtmlSource = (html) => ({ html: html || '' });

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
    topicStatusContainer: {
        backgroundColor: COLORS.purple,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginTop: 15,
        marginHorizontal: 15,
        alignSelf: 'flex-start',
    },
    topicStatusText: {
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontSize: 14,
        color: COLORS.white,
        textAlign: 'left'
    },
    titleContainer: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    titleText: {
        fontFamily: FONTS.BROTHER_1816_BOLD,
        fontSize: 24,
        color: COLORS.textColor,
        textAlign: 'left'
    },
    htmlContainer: {
        marginTop: 7,
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
})

