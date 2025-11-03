import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

interface ProgressPhotosProps {
    initialPhoto?: string;
    latestPhoto?: string;
    style?: any;
}

const ProgressPhotos: React.FC<ProgressPhotosProps> = ({
    initialPhoto,
    latestPhoto,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>Progress Photos</Text>

            <View style={styles.photosContainer}>
                <View style={styles.photoSection}>
                    <Text style={styles.photoLabel}>Initial Photo</Text>
                    <View style={styles.imageContainer}>
                        {initialPhoto ? (
                            <Image source={{ uri: initialPhoto ?? 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg' }} style={styles.image} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderText}>No Photo</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.photoSection}>
                    <Text style={styles.photoLabel}>Latest Photo</Text>
                    <View style={styles.imageContainer}>
                        {latestPhoto ? (
                            <Image source={{ uri: latestPhoto ?? 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg' }} style={styles.image} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderText}>No Photo</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        borderRadius: 12,
        marginVertical: 10,
    },
    title: {
        fontSize: 22,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 15,
    },
    photosContainer: {
        flexDirection: 'row',

        // justifyContent: 'space-between',
        // paddingHorizontal: 10,
    },
    photoSection: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    photoLabel: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.black,
        marginBottom: 12,
        alignSelf: 'center',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.7, // Better ratio for full-body photos
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.textColor14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor44,
    },
});

export default ProgressPhotos;
