import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseAction } from '../../redux/cources/courceActions';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { windowWidth } from '../../Utils/Dimentions';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';

const CoursesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All Courses');
    const [sortBy, setSortBy] = useState('Alphabetical');
    const dispatch = useDispatch();

    const courseData = useSelector(
        state => state.cource?.courseData || []
    );

    useEffect(() => {
        setLoading(true);
        localStorageHelper.getItemFromStorage(StorageKeys.USER_ID).then(userId => {
            dispatch(getCourseAction({ userId: userId, onSuccess, onFailure }));
        });
    }, []);

    const onSuccess = () => {
        setLoading(false);
    };

    const onFailure = () => {
        setLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const filteredCourses = courseData.filter(course => {
        const title = course.title?.rendered || course.title || '';
        const author = course.author || '';
        const searchLower = searchText.toLowerCase();

        return title.toLowerCase().includes(searchLower) ||
            author.toLowerCase().includes(searchLower);
    });

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortBy === 'Alphabetical') {
            const titleA = a.title?.rendered || a.title || '';
            const titleB = b.title?.rendered || b.title || '';
            return titleA.localeCompare(titleB);
        } else if (sortBy === 'Date') {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return dateB - dateA; // Newest first
        }
        return 0;
    });

    const OnCoursePress = (item) => {
        navigation.navigate('CourseDetailScreen', { courseId: item.ID || '' });
    }

    const renderCourseItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => OnCoursePress(item)} style={styles.courseItem}>
            <View style={styles.courseThumbnail}>
                {/* <TouchableOpacity style={styles.startCourseButton}>
                    <Text style={styles.startCourseText}>Start Course</Text>
                </TouchableOpacity> */}
                <FastImage source={{ uri: item.featured_image }} style={styles.courseThumbnailImage} resizeMode="contain" />
                {/* <View style={styles.bookIcon}>
                    <Text style={styles.bookIconText}>📖</Text>
                </View> */}
            </View>
            <View style={styles.courseDetails}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                    {item.title?.rendered || item.title || `Course ${index + 1}`}
                </Text>
                {item.author && (
                    <Text style={styles.courseAuthor}>
                        {item.author}
                    </Text>
                )}
                <View style={styles.courseFooter}>
                    <Text style={styles.courseDate}>
                        {formatDate(item.date) || 'No date available'}
                    </Text>
                    {/* <TouchableOpacity style={styles.downloadButton}>
                        <FastImage source={IMAGES.DOWNLOAD_BLACK} style={styles.downloadIcon} resizeMode="contain" />
                    </TouchableOpacity> */}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = useMemo(() => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Courses</Text>

            {/* <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor={COLORS.textColor44}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View> */}

            {/* <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterIcon}>☰</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterOption,
                        selectedFilter === 'All Courses' && styles.selectedFilter
                    ]}
                    onPress={() => setSelectedFilter('All Courses')}
                >
                    <Text style={[
                        styles.filterText,
                        selectedFilter === 'All Courses' && styles.selectedFilterText
                    ]}>
                        All Courses
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortBy(sortBy === 'Alphabetical' ? 'Date' : 'Alphabetical')}
                >
                    <Text style={styles.sortText}>{sortBy}</Text>
                    <Text style={styles.chevronIcon}>▼</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    ), [searchText]);

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>
                {searchText ? 'No courses found' : 'No courses available'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {searchText
                    ? 'Try adjusting your search terms'
                    : 'Check back later for new courses'
                }
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.purple} />
                    <Text style={styles.loadingText}>Loading courses...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.pr_blue} />
            <FlatList
                data={courseData}
                renderItem={renderCourseItem}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={[
                    styles.listContainer,
                    sortedCourses.length === 0 && styles.emptyListContainer
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg_color,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
    },
    listContainer: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FONTS.BROTHER_1816_BOLD,
        color: COLORS.textColor,
        // marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
        color: COLORS.textColor44,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.textColor14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    filterIcon: {
        fontSize: 16,
        color: COLORS.textColor,
    },
    filterOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.textColor14,
        marginRight: 10,
    },
    selectedFilter: {
        backgroundColor: COLORS.pr_blue,
        borderColor: COLORS.pr_blue,
    },
    filterText: {
        fontSize: 14,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
    },
    selectedFilterText: {
        color: COLORS.white,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.textColor14,
    },
    sortText: {
        fontSize: 14,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor,
        marginRight: 5,
    },
    chevronIcon: {
        fontSize: 12,
        color: COLORS.textColor,
    },
    courseItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        marginVertical: 8,
        borderRadius: 12,
        padding: 15,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseThumbnail: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.textColor14,
        borderRadius: 8,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    courseThumbnailImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    startCourseButton: {
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: COLORS.pr_blue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    startCourseText: {
        fontSize: 10,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.white,
    },
    bookIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookIconText: {
        fontSize: 24,
    },
    courseDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    courseTitle: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.textColor,
        lineHeight: 22,
        marginBottom: 4,
    },
    courseAuthor: {
        fontSize: 12,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor44,
        marginBottom: 8,
    },
    courseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseDate: {
        fontSize: 12,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor44,
        flex: 1,
    },
    downloadButton: {
        padding: 5,
    },
    downloadIcon: {
        height: 20,
        width: 20,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.textColor,
        textAlign: 'center',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        color: COLORS.textColor44,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default CoursesScreen;