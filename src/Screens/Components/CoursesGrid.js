// CoursesGrid.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, Image } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import FastImage from 'react-native-fast-image';
import { windowHeight } from '../../Utils/Dimentions';

const { width: windowWidth } = Dimensions.get('window');
const CARD_WIDTH = windowWidth * 0.65;
const CARD_MARGIN = 12;

export default function CoursesGrid({ items = [], loading = false, onCardPress = () => { } }) {
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
        <ActivityIndicator color={COLORS.black} size={'small'} />
      </View>
    )
  }

  const renderCourseCard = ({ item, index }) => {
    // Generate gradient colors based on index - deep purple to pinkish-purple
    // const gradientColors = [
    //   ['#6B46C1', '#A855F7', '#EC4899'], // Deep purple to pink
    //   ['#7C3AED', '#A855F7', '#F472B6'], // Purple to pink
    //   ['#5B21B6', '#9333EA', '#EC4899'], // Dark purple to pink
    //   ['#6B46C1', '#C084FC', '#F472B6'], // Purple to light pink
    // ];

    // const colors = gradientColors[index % gradientColors.length];

    // Mock data for videos and classes (you can replace with actual data from API)
    // const videosCount = 75;
    // const classesCount = 35;

    // Extract course name and instructor (you can get this from API)
    // const courseName = item.courseName || 'Juri';
    // const instructor = item.instructor || 'Shak';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onCardPress(item)}
        style={[styles.card, { marginLeft: index === 0 ? 20 : CARD_MARGIN }]}
      >
        {/* Gradient Header Section */}
        <View style={styles.courseIconContainer}>
          <FastImage source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg' }} style={styles.courseIcon} resizeMode="stretch" />
        </View>

        {/* Course Details Section */}
        <View style={styles.detailsContainer}>
          {/* Course Title */}
          <Text style={styles.courseTitle} numberOfLines={2}>
            {item.title || ''}
          </Text>

          {/* Course Description */}
          <Text style={styles.courseDescription} numberOfLines={1}>
            {item.subtitle || ''}
          </Text>

          {/* View Button */}
          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.8}
            onPress={() => onCardPress(item)}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        snapToAlignment="start"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  listContent: {
    paddingRight: 20,
  },
  courseIcon: {
    width: '100%',
    height: windowHeight * 0.17,

  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: CARD_MARGIN,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  courseIconContainer: {
    flex: 1,
    backgroundColor: 'red',
    margin: 14,

  },
  gradient: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  categoryTitle: {
    fontSize: 15,
    fontFamily: FONTS.OUTFIT_BOLD,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 0,
    textTransform: 'uppercase',
  },
  courseInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 20,
  },
  courseName: {
    fontSize: 56,
    fontFamily: FONTS.OUTFIT_BLACK,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 64,
  },
  instructorName: {
    fontSize: 13,
    fontFamily: FONTS.OUTFIT_REGULAR,
    color: COLORS.white,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC4899', // Pinkish-purple solid color
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  badgeIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.white,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONTS.OUTFIT_MEDIUM,
    color: COLORS.white,
  },
  detailsContainer: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: FONTS.OUTFIT_SEMIBOLD,
    color: COLORS.black,
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 12,
    fontFamily: FONTS.OUTFIT_REGULAR,
    color: COLORS.black,
    marginBottom: 12,
    lineHeight: 18
  },
  viewButton: {
    width: '100%',
    backgroundColor: '#5E3BB9',
    borderRadius: 5,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: FONTS.OUTFIT_SEMIBOLD,
    color: COLORS.white,
  },
});
