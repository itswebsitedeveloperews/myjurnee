import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native'
import { COLORS } from '../../Common/Constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import INavBar from '../Components/INavBar'
import FastImage from 'react-native-fast-image'
import { IMAGES } from '../../Common/Constants/images'
import { windowHeight, windowWidth } from '../../Utils/Dimentions'
import SectionHeader from '../Components/SectionHeader'
import ITextField from '../Components/ITextField'
import ITextFieldWithUnit from '../Components/ITextFieldWithUnit'
import DropdownPicker from '../Components/DropdownPicker'
import IButton from '../Components/IButton'
import ICameraButton from '../Components/ICameraButton'
import { getProfileData, updateUserProfile } from '../../redux/profile/profileActions'

const options = [
    { id: 'm', label: 'Male', value: 'male' },
    { id: 'f', label: 'Female', value: 'female' },
    { id: 'o', label: 'Other', value: 'other' },
];

const EditProfile = (props) => {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.profile?.profileData || {});

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('lbs');
    const [selected, setSelected] = useState(options[0]);
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileImageUri, setProfileImageUri] = useState(null);

    useEffect(() => {
        loadProfileData();
    }, []);

    useEffect(() => {
        // Populate form fields when profileData is loaded
        if (profileData && Object.keys(profileData).length > 0) {
            setFullName(profileData.full_name || '');
            setPhone(profileData.phone || '');
            setEmail(profileData.email || '');
            setWeight(profileData.current_weight || '');
            setSelectedUnit(profileData.weight_type || 'lbs');
            setAge(profileData.age ? String(profileData.age) : '');

            // Set gender dropdown
            const genderValue = profileData.gender?.toLowerCase() || 'male';
            const genderOption = options.find(opt => opt.value === genderValue) || options[0];
            setSelected(genderOption);

            // Set profile image from API
            if (profileData.profile_image) {
                setProfileImageUri(profileData.profile_image);
            }
        }
    }, [profileData]);

    const loadProfileData = () => {
        dispatch(getProfileData({
            onSuccess: () => {
                console.log('Profile data loaded successfully');
            },
            onFailure: () => {
                Alert.alert('Error', 'Failed to load profile data');
            }
        }));
    };

    const handleImagePicker = () => {
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
            includeBase64: true,
            quality: 0.8,
            maxWidth: 1000,
            maxHeight: 1000,
        };

        launchCamera(options, (response) => {
            if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                setSelectedImage(asset);
                setProfileImageUri(asset.uri);
            } else if (response.error) {
                if (response.error !== 'User cancelled image picker') {
                    Alert.alert('Error', 'Failed to take photo. Please try again.');
                }
            }
        });
    };

    const openImageLibrary = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.8,
            maxWidth: 1000,
            maxHeight: 1000,
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                setSelectedImage(asset);
                setProfileImageUri(asset.uri);
            } else if (response.error) {
                if (response.error !== 'User cancelled image picker') {
                    Alert.alert('Error', 'Failed to select photo. Please try again.');
                }
            }
        });
    };

    const handleSubmit = () => {
        // Validation
        if (!fullName.trim()) {
            Alert.alert('Validation Error', 'Please enter your full name');
            return;
        }
        // if (!phone.trim()) {
        //     Alert.alert('Validation Error', 'Please enter your phone number');
        //     return;
        // }
        if (!weight.trim()) {
            Alert.alert('Validation Error', 'Please enter your weight');
            return;
        }
        if (!age.trim()) {
            Alert.alert('Validation Error', 'Please enter your age');
            return;
        }

        setLoading(true);

        // Get base64 image if a new image was selected
        let profileImageBase64 = null;
        if (selectedImage && selectedImage.base64) {
            profileImageBase64 = selectedImage.base64;
        }

        dispatch(updateUserProfile({
            fullName: fullName.trim(),
            phone: phone.trim(),
            weight: weight.trim(),
            weightType: selectedUnit,
            gender: selected.label, // API expects "Male", "Female", or "Other"
            age: age.trim(),
            profileImage: selectedImage ? selectedImage.base64 : null,
            onSuccess: () => {
                setLoading(false);
                Alert.alert('Success', 'Profile updated successfully', [
                    {
                        text: 'OK',
                        onPress: () => props.navigation.goBack()
                    }
                ]);
            },
            onFailure: (errorMessage) => {
                setLoading(false);
                Alert.alert('Error', errorMessage || 'Failed to update profile. Please try again.');
            }
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <INavBar title="Edit Profile" onBackPress={() => props.navigation.goBack()} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Profile Image */}
                <View style={styles.profileContainer}>
                    <TouchableOpacity
                        onPress={handleImagePicker}
                        activeOpacity={0.8}
                        style={styles.profileImageWrapper}
                    >
                        <FastImage
                            source={profileImageUri
                                ? { uri: profileImageUri }
                                : IMAGES.IC_PROFILE
                            }
                            style={styles.profile}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <View style={styles.cameraButtonOverlay}>
                        <ICameraButton onPress={handleImagePicker} />
                    </View>
                </View>

                <SectionHeader title="Full Name" />
                <ITextField
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <SectionHeader title="Phone" />
                <ITextField
                    placeholder="Enter Phone"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <SectionHeader title="Email address" />
                <ITextField
                    placeholder="Enter Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <SectionHeader title="Weight" />
                <ITextFieldWithUnit
                    value={weight}
                    onChangeText={setWeight}
                    showUnitToggle
                    unit={selectedUnit}
                    onUnitChange={(u) => setSelectedUnit(u)}
                    placeholder="Enter weight"
                    keyboardType="decimal-pad"
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />

                <SectionHeader title="Gender" />
                <View style={{ paddingHorizontal: 20 }}>
                    <DropdownPicker
                        valueLabel={selected.label}
                        icon={IMAGES.IC_MALE_BLACK}
                        options={options}
                        onSelect={(opt) => setSelected(opt)}
                    />
                </View>
                <SectionHeader title="Age" />
                <ITextField
                    placeholder="Enter Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    placeholderTextColor={COLORS.textColor64}
                    mainViewStyle={styles.inputField}
                />
                <View style={styles.buttonContainer}>
                    <IButton
                        title="Submit"
                        onPress={handleSubmit}
                        loading={loading}
                        mainViewStyle={styles.loginButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg_color,
    },
    profileContainer: {
        height: 120,
        width: 120,
        marginTop: 30,
        alignSelf: 'center',
        position: 'relative',
    },
    profileImageWrapper: {
        height: 120,
        width: 120,
        borderRadius: 60,
        overflow: 'hidden',
    },
    profile: {
        height: 120,
        width: 120,
        borderRadius: 60,
    },
    cameraButtonOverlay: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.white,
        borderRadius: 18,
        padding: 3,
        zIndex: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    inputField: {
        marginHorizontal: 20,
        borderColor: COLORS.borderGray,
        borderRadius: 8,
    },
    buttonContainer: {
        marginTop: 30,
        marginHorizontal: 90
    }
})