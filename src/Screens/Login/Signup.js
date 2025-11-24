import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, Platform, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import { IMAGES } from '../../Common/Constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { safeAreaStyle } from '../../Common/CommonStyles';
import INavBar from '../Components/INavBar';
import ITextField from '../Components/ITextField';
import FastImage from 'react-native-fast-image';
import { FONTS } from '../../Common/Constants/fonts';
import { COLORS } from '../../Common/Constants/colors';
import { windowHeight } from '../../Utils/Dimentions';
import IButton from '../Components/IButton';
import { useDispatch } from 'react-redux';
import { RegisterUser } from '../../redux/auth/authActions';
import { localStorageHelper, StorageKeys } from '../../Common/localStorageHelper';

const Signup = props => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onSignupClick = () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter username');
            return;
        } else if (!email.trim()) {
            Alert.alert('Error', 'Please enter email');
            return;
        } else if (!validateEmail(email.trim())) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        } else if (!password.trim()) {
            Alert.alert('Error', 'Please enter password');
            return;
        } else if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        } else if (confirmPassword.trim() !== password.trim()) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);

        dispatch(RegisterUser({
            username: username,
            email: email,
            password: password,
            onSuccess: (response) => {
                setLoading(false);
                // Save user_id to storage for the fitness onboarding wizard
                if (response?.id) {
                    localStorageHelper
                        .setStorageItem({ key: StorageKeys.USER_ID, value: String(response.id) })
                        .then(() => {
                            console.log('User ID saved to storage:', response.id);
                            // Navigate to fitness onboarding wizard after successful signup
                            props.navigation.replace('FitnessOnboardingWizard');
                        })
                        .catch(error => {
                            console.error('Error saving user ID:', error);
                            // Still navigate even if storage fails
                            props.navigation.replace('FitnessOnboardingWizard');
                        });
                } else {
                    // If no user_id in response, still navigate (wizard will handle it)
                    props.navigation.replace('FitnessOnboardingWizard');
                }
            },
            onFailure: (errorMessage) => {
                setLoading(false);
                Alert.alert('Registration Failed', errorMessage || 'Something went wrong. Please try again.');
            }
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                automaticallyAdjustKeyboardInsets={true}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.container}>
                        <View style={styles.backButtonContainer}>
                            <INavBar onBackPress={() => props.navigation.goBack()} />
                        </View>
                        {/* Content */}
                        <View style={styles.contentContainer}>
                            {/* Logo and Tagline */}
                            <View style={styles.logoContainer}>
                                <FastImage
                                    source={IMAGES.BLACK_LOGO}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Welcome Message */}
                            <Text style={styles.welcomeTitle}>{`Hey There!  Let's Get\nYou Onboard!`}</Text>

                            {/* Input Fields */}
                            <View style={styles.inputContainer}>
                                <ITextField
                                    placeholder="Enter Username"
                                    value={username}
                                    onChangeText={setUsername}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    // backgroundColor={COLORS.darkGray}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={styles.inputField}
                                />
                                <ITextField
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    // backgroundColor={COLORS.darkGray}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={styles.inputField}
                                />

                                <ITextField
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    rightIcon={showPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                    // backgroundColor={COLORS.darkGray}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={[styles.inputField]}
                                />
                                <ITextField
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                    rightIcon={showPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                    // backgroundColor={COLORS.darkGray}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={[styles.inputField, styles.passwordField]}
                                />

                            </View>

                            {/* Login Button */}
                            <View style={styles.buttonContainer}>
                                <IButton
                                    title="Signup"
                                    onPress={onSignupClick}
                                    loading={loading}
                                    mainViewStyle={styles.loginButton}
                                />
                            </View>
                            <View style={{ height: '9%' }} />
                            {/* Register Link */}
                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>
                                    Already have an account?<Text style={styles.registerLink} onPress={() => { props.navigation.navigate('Login') }}> Login Now</Text>
                                </Text>
                            </View>

                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg_color,
    },
    scrollContainer: {
        flexGrow: 1,
        minHeight: '100%',
    },
    container: {
        flex: 1,
    },
    backButtonContainer: {
        paddingHorizontal: 16

    },
    backButton: {
        padding: 16,
        marginTop: 8,
        marginLeft: 8,
        alignSelf: 'flex-start',
    },
    backIcon: {
        height: 24,
        width: 24,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 60,
    },
    logo: {
        height: 80,
        width: 200,
    },
    welcomeTitle: {
        fontFamily: FONTS.OUTFIT_BOLD,
        fontSize: 24,
        color: COLORS.black,
        marginBottom: 30,
        lineHeight: 32,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputField: {
        marginBottom: 16,
        backgroundColor: COLORS.bg_color,
        borderWidth: 1,
    },
    passwordField: {
        marginBottom: 8,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 9,
        // marginBottom: 15,
    },
    forgotPasswordText: {
        fontFamily: FONTS.OUTFIT_REGULAR,
        fontSize: 12,
        color: COLORS.white,
    },
    buttonContainer: {
        marginBottom: 0,
    },
    loginButton: {
    },
    registerContainer: {
        alignItems: 'center',
        // marginTop: 20,
        // backgroundColor: 'red',

    },
    registerText: {
        fontFamily: FONTS.OUTFIT_REGULAR,
        fontSize: 14,
        color: COLORS.black,
    },
    registerLink: {
        fontFamily: FONTS.OUTFIT_MEDIUM,
        color: COLORS.purple,
    },
});
export default Signup;