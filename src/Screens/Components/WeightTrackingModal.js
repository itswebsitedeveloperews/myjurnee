import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const { width, height } = Dimensions.get('window');

const WeightTrackingModal = ({ isVisible, onClose, onSubmit }) => {
    const [weight, setWeight] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const handleSubmit = () => {
        if (!weight.trim()) {
            Alert.alert('Error', 'Please enter your weight');
            return;
        }

        const weightData = {
            weight: parseFloat(weight),
            date: selectedDate,
            photos: selectedPhotos,
        };

        onSubmit(weightData);
        handleClose();
    };

    const handleClose = () => {
        setWeight('');
        setSelectedDate(new Date());
        setSelectedPhotos([]);
        setShowDatePicker(false);
        onClose();
    };

    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }
    };

    const handlePhotoUpload = () => {
        Alert.alert(
            'Select Photo',
            'Choose how you want to add a photo',
            [
                { text: 'Camera', onPress: openCamera },
                { text: 'Gallery', onPress: openImageLibrary },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const openCamera = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1000,
            maxHeight: 1000,
        };

        launchCamera(options, (response) => {
            if (response.assets && response.assets[0]) {
                setSelectedPhotos([...selectedPhotos, response.assets[0]]);
            }
        });
    };

    const openImageLibrary = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1000,
            maxHeight: 1000,
            selectionLimit: 5, // Allow multiple selection
        };

        launchImageLibrary(options, (response) => {
            if (response.assets) {
                setSelectedPhotos([...selectedPhotos, ...response.assets]);
            }
        });
    };

    const removePhoto = (index) => {
        const newPhotos = selectedPhotos.filter((_, i) => i !== index);
        setSelectedPhotos(newPhotos);
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleClose}
            onBackButtonPress={handleClose}
            style={styles.modal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>

                    <Text style={styles.headerTitle}>Track Weight</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Weight and Date Input Section */}
                    <View style={styles.inputSection}>
                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Weight</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={weight}
                                    onChangeText={setWeight}
                                    placeholder="0.0 stones"
                                    placeholderTextColor={COLORS.textColor44}
                                    keyboardType="numeric"
                                />
                                <View style={styles.inputUnderline} />
                            </View>
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.inputLabel}>Date</Text>
                            <TouchableOpacity
                                style={styles.inputContainer}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateInput}>
                                    {formatDate(selectedDate)}
                                </Text>
                                <View style={styles.inputUnderline} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Upload Progress Photos Section */}
                    <View style={styles.photoSection}>
                        <Text style={styles.photoSectionTitle}>Upload Progress Photos</Text>

                        {/* Selected Photos Preview */}
                        {selectedPhotos.length > 0 && (
                            <View style={styles.selectedPhotosContainer}>
                                <Text style={styles.selectedPhotosTitle}>Selected Photos ({selectedPhotos.length})</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                                    {selectedPhotos.map((photo, index) => (
                                        <View key={index} style={styles.photoPreview}>
                                            <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                                            <TouchableOpacity
                                                style={styles.removePhotoButton}
                                                onPress={() => removePhoto(index)}
                                            >
                                                <Text style={styles.removePhotoText}>×</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <TouchableOpacity style={styles.uploadArea} onPress={handlePhotoUpload}>
                            <View style={styles.uploadIcon}>
                                <Text style={styles.uploadIconText}>☁</Text>
                                <Text style={styles.uploadArrow}>↑</Text>
                            </View>
                            <Text style={styles.uploadText}>Drag&Drop files here</Text>
                            <View style={styles.orContainer}>
                                <Text style={styles.orText}>or</Text>
                                <TouchableOpacity style={styles.browseButton} onPress={handlePhotoUpload}>
                                    <Text style={styles.browseButtonText}>Browse Files</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* Update Button */}
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            weight.trim() ? styles.updateButtonEnabled : styles.updateButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!weight.trim()}
                    >
                        <Text style={[
                            styles.updateButtonText,
                            weight.trim() ? styles.updateButtonTextEnabled : styles.updateButtonTextDisabled
                        ]}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>



                {/* Date Picker Modal */}
                {showDatePicker && (
                    <View style={styles.datePickerContainer}>
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(false)}
                                style={styles.datePickerCancelButton}
                            >
                                <Text style={styles.datePickerCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.datePickerTitle}>Select Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(false)}
                                style={styles.datePickerConfirmButton}
                            >
                                <Text style={styles.datePickerConfirmText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            maximumDate={new Date()}
                            style={styles.datePicker}
                        />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.9,
        marginTop: height * 0.1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.pr_background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerLeft: {
        flex: 1,
    },
    timeText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        marginLeft: 40,
        textAlign: 'center',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.textColor14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: COLORS.textColor,
        fontFamily: FONTS.OUTFIT_BOLD,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputSection: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputRow: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        marginBottom: 8,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    dateInput: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    inputUnderline: {
        height: 1,
        backgroundColor: COLORS.textColor14,
        marginTop: 4,
    },
    photoSection: {
        flex: 1,
    },
    photoSectionTitle: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
        textAlign: 'center',
        marginBottom: 15,
    },
    uploadArea: {
        borderWidth: 2,
        borderColor: COLORS.textColor14,
        // borderStyle: 'dashed',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.pr_background,
        minHeight: 200,
    },
    uploadIcon: {
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadIconText: {
        fontSize: 32,
        color: COLORS.textColor44,
    },
    uploadArrow: {
        fontSize: 16,
        color: COLORS.textColor44,
        marginTop: -5,
    },
    uploadText: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor44,
        marginBottom: 15,
    },
    orContainer: {
        alignItems: 'center',
    },
    orText: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_REGULAR,
        color: COLORS.textColor44,
        marginBottom: 10,
    },
    browseButton: {
        borderWidth: 1,
        borderColor: COLORS.pr_blue,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    browseButtonText: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: COLORS.pr_blue,
    },
    updateButton: {
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    updateButtonEnabled: {
        backgroundColor: COLORS.pr_lavender,
    },
    updateButtonDisabled: {
        backgroundColor: COLORS.textColor14,
    },
    updateButtonText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
    },
    updateButtonTextEnabled: {
        color: COLORS.textColor,
    },
    updateButtonTextDisabled: {
        color: COLORS.textColor44,
    },
    selectedPhotosContainer: {
        marginBottom: 15,
    },
    selectedPhotosTitle: {
        fontSize: 14,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: COLORS.textColor,
        marginBottom: 10,
    },
    photosScroll: {
        flexDirection: 'row',
    },
    photoPreview: {
        marginRight: 10,
        position: 'relative',
    },
    photoImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: COLORS.textColor14,
    },
    removePhotoButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removePhotoText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: FONTS.OUTFIT_BOLD,
    },
    datePickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.textColor14,
    },
    datePickerCancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    datePickerCancelText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: COLORS.pr_blue,
    },
    datePickerTitle: {
        fontSize: 18,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.textColor,
    },
    datePickerConfirmButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    datePickerConfirmText: {
        fontSize: 16,
        fontFamily: FONTS.OUTFIT_BOLD,
        color: COLORS.pr_blue,
    },
    datePicker: {
        alignSelf: 'center',
    },
});

export default WeightTrackingModal;
