import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const PhotoSlider = ({ photos = [], style }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dummy data for photos if none provided
    const defaultPhotos = [
        {
            id: 1,
            image: require('../../assets/temp/profileTemp.png'),
            date: '09 September 2025'
        },
        {
            id: 2,
            image: require('../../assets/temp/agencyPic.png'),
            date: '15 August 2025'
        },
        {
            id: 3,
            image: require('../../assets/temp/tempprofilePic.png'),
            date: '22 July 2025'
        },
        {
            id: 4,
            image: require('../../assets/temp/agency1Temp.png'),
            date: '30 June 2025'
        }
    ];

    const photoData = photos.length > 0 ? photos : defaultPhotos;

    const renderPhotoItem = ({ item }) => (
        <View style={styles.photoFrame}>
            <FastImage
                source={item.image}
                style={styles.photo}
                resizeMode="cover"
            />
        </View>
    );

    const currentPhoto = photoData[currentIndex];

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>Journey Gallery</Text>

            <View style={styles.carouselContainer}>
                <Carousel
                    loop={false}
                    width={width * 0.7}
                    height={width * 0.7}
                    data={photoData}
                    scrollAnimationDuration={300}
                    onSnapToItem={(index) => setCurrentIndex(index)}
                    renderItem={renderPhotoItem}
                    style={styles.carousel}
                />
            </View>

            <Text style={styles.dateText}>{currentPhoto.date}</Text>

            {photoData.length > 1 && (
                <View style={styles.dotsContainer}>
                    {photoData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 20,
        fontFamily: FONTS.OUTFIT_BOLD,
    },
    carouselContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    carousel: {
        width: width * 0.7,
    },
    photoFrame: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 10,
        // shadowColor: COLORS.black,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.15,
        // shadowRadius: 1,
        // elevation: 1,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    dateText: {
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 10,
        fontFamily: FONTS.OUTFIT_REGULAR,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.textColor44,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.pr_blue,
    },
});

export default PhotoSlider;
