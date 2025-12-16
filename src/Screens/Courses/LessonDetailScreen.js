import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../Common/Constants/colors'
import RenderHtml from 'react-native-render-html';
import LessonNavBar from '../Components/LessonNavBar'
import { windowWidth } from '../../Utils/Dimentions'
import { FONTS } from '../../Common/Constants/fonts'
import { useDispatch, useSelector } from 'react-redux'
import { getLessonDetailAction } from '../../redux/cources/courceActions'



const LessonDetailScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const lessonId = props.route.params?.lessonId;
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

    const renderPrevButton = () => {
        return (
            <TouchableOpacity style={styles.controlButtons} key={1}>
                <Text style={styles.controlButtonsText}>Prev</Text>
            </TouchableOpacity>
        )
    }

    const renderNextButton = () => {
        return (
            <TouchableOpacity style={styles.controlButtons} key={2}>
                <Text style={styles.controlButtonsText}>Next</Text>
            </TouchableOpacity>
        )
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
                // rightComponents={[renderPrevButton(), renderNextButton()]}
                />
            </View>

            {/* Scrollable lesson container */}
            <ScrollView
                style={{ flex: 1, paddingHorizontal: 15, }}
                showsVerticalScrollIndicator={false}
            >
                {/* Lesson Title */}
                {lessonData?.title?.rendered && (
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText} numberOfLines={3}>
                            {lessonData.title.rendered}
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
                {lessonData?.content?.rendered && (
                    <View style={styles.htmlContainer}>
                        <RenderHtml
                            contentWidth={Dimensions.get('window').width - 30}
                            source={{
                                html: lessonData.content.rendered
                            }}
                            tagsStyles={htmlTagsStyles}
                            baseStyle={styles.htmlBaseStyle}
                            defaultTextProps={{
                                style: Platform.OS === 'android' ? {
                                    fontFamily: FONTS.URBANIST_REGULAR,
                                } : undefined
                            }}
                            enableExperimentalMarginCollapsing={true}
                            renderersProps={{
                                img: {
                                    enableExperimentalPercentWidth: true
                                }
                            }}
                        />
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    )
}

export default LessonDetailScreen

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
            marginTop: 8,
            marginBottom: 8,
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
            h1: { ...baseStyles.h1, fontFamily: FONTS.URBANIST_BOLD },
            h2: { ...baseStyles.h2, fontFamily: FONTS.URBANIST_BOLD },
            h3: { ...baseStyles.h3, fontFamily: FONTS.URBANIST_SEMIBOLD },
            h4: { ...baseStyles.h4, fontFamily: FONTS.URBANIST_SEMIBOLD },
            p: { ...baseStyles.p, fontFamily: FONTS.URBANIST_REGULAR },
            li: { ...baseStyles.li, fontFamily: FONTS.URBANIST_REGULAR },
            strong: { ...baseStyles.strong, fontFamily: FONTS.URBANIST_BOLD },
            em: { ...baseStyles.em, fontFamily: FONTS.URBANIST_REGULAR },
            a: { ...baseStyles.a, fontFamily: FONTS.URBANIST_SEMIBOLD },
            blockquote: { ...baseStyles.blockquote, fontFamily: FONTS.URBANIST_REGULAR },
            code: { ...baseStyles.code, fontFamily: FONTS.URBANIST_REGULAR },
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
        fontFamily: FONTS.URBANIST_BOLD,
        fontSize: 14,
        color: COLORS.white,
    },
    titleContainer: {
        marginTop: 20
    },
    lessonNumContainer: {
        marginTop: 10
    },
    titleText: {
        fontFamily: FONTS.URBANIST_BOLD,
        fontSize: 24,
        color: COLORS.textColor,
        textAlign: 'left'
    },
    lessonNumText: {
        fontFamily: FONTS.URBANIST_MEDIUM,
        fontSize: 14,
        color: COLORS.textColor44,
        textAlign: 'left'
    },
    htmlContainer: {
        marginTop: 20,
        paddingBottom: 50,
        width: '100%',
        ...(Platform.OS === 'android' && {
            flex: 1,
        }),
    },
    htmlBaseStyle: {
        ...(Platform.OS === 'ios' && { fontFamily: FONTS.URBANIST_REGULAR }),
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
        fontFamily: FONTS.URBANIST_REGULAR,
    }
})