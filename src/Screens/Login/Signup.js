import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, Platform, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Signup = props => {

    const defaultErrorState = {
        email: {
            hasError: false,
            errorText: ''
        },
        userName: {
            hasError: false,
            errorText: ''
        },
        password: {
            hasError: false,
            errorText: ''
        },
        confirmPassword: {
            hasError: false,
            errorText: ''
        }
    }

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorState, setErrorState] = useState(defaultErrorState);

    const dispatch = useDispatch();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onChangeUsername = (text) => {
        setErrorState({ ...errorState, userName: { hasError: false, errorText: '' } })
        setUsername(text)
    }

    const onChangeEmail = (text) => {
        setErrorState({ ...errorState, email: { hasError: false, errorText: '' } })
        setEmail(text)
    }

    const onChangePassword = (text) => {
        setErrorState({ ...errorState, password: { hasError: false, errorText: '' } })
        setPassword(text)
    }

    const onChangeConfirmPassword = (text) => {
        setErrorState({ ...errorState, confirmPassword: { hasError: false, errorText: '' } })
        setConfirmPassword(text)
    }

    const handleError = (error) => {
        if (error?.code == 'email_exists') {
            setErrorState({ ...errorState, email: { hasError: true, errorText: error?.message || 'Email already exists with this account.' } })
        }
        else if (error?.code == 'username_exists') {
            setErrorState({ ...errorState, userName: { hasError: true, errorText: error?.message || 'Username already exists with this account.' } })
        }
    }

    const onSignupClick = () => {
        if (!username.trim()) {
            setErrorState({ ...errorState, userName: { hasError: true, errorText: 'Please enter username' } })
            return;
        } else if (!email.trim()) {
            setErrorState({ ...errorState, email: { hasError: true, errorText: 'Please enter email' } })
            return;
        } else if (!validateEmail(email.trim())) {
            setErrorState({ ...errorState, email: { hasError: true, errorText: 'Please enter a valid email address' } })
            return;
        } else if (!password.trim()) {
            setErrorState({ ...errorState, password: { hasError: true, errorText: 'Please enter password' } })
            return;
        } else if (password.length < 6) {
            setErrorState({ ...errorState, password: { hasError: true, errorText: 'Password must be at least 6 characters long' } })
            return;
        } else if (confirmPassword.trim() !== password.trim()) {
            setErrorState({ ...errorState, confirmPassword: { hasError: true, errorText: 'Passwords do not match' } })
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
                    // Store temporary signup credentials for auto-login after onboarding
                    const tempCredentials = {
                        username: username.trim(),
                        email: email.trim(),
                        password: password,
                    };

                    localStorageHelper
                        .setStorageItem({ key: StorageKeys.USER_ID, value: String(response.id) })
                        .then(() => {
                            console.log('User ID saved to storage:', response.id);
                            // Store temporary credentials for auto-login
                            return localStorageHelper.setStorageArrayItem({
                                key: StorageKeys.TEMP_SIGNUP_CREDENTIALS,
                                value: tempCredentials,
                            });
                        })
                        .then(() => {
                            console.log('Temporary signup credentials saved for auto-login');
                            // Navigate to fitness onboarding wizard after successful signup
                            props.navigation.replace('FitnessOnboardingWizard');
                        })
                        .catch(error => {
                            console.error('Error saving user data:', error);
                            // Still navigate even if storage fails
                            props.navigation.replace('FitnessOnboardingWizard');
                        });
                }
            },
            onFailure: (error) => {
                setLoading(false);
                handleError(error);
            }
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'android' ? 24 : 0}
                keyboardOpeningTime={0}
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
                                    onChangeText={onChangeUsername}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    hasError={errorState.userName.hasError}
                                    errorText={errorState.userName.errorText}
                                    // backgroundColor={COLORS.darkGray}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={styles.inputField}
                                />
                                <ITextField
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={onChangeEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    hasError={errorState.email.hasError}
                                    errorText={errorState.email.errorText}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={styles.inputField}
                                />

                                <ITextField
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={onChangePassword}
                                    secureTextEntry={!showPassword}
                                    rightIcon={showPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                    hasError={errorState.password.hasError}
                                    errorText={errorState.password.errorText}
                                    placeholderTextColor={COLORS.textColor64}
                                    mainViewStyle={[styles.inputField]}
                                />
                                <ITextField
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChangeText={onChangeConfirmPassword}
                                    secureTextEntry={!showPassword}
                                    rightIcon={showPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                    hasError={errorState.confirmPassword.hasError}
                                    errorText={errorState.confirmPassword.errorText}
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
                            <View style={{ height: '3%' }} />
                            {/* Register Link */}
                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>
                                    Already have an account?<Text style={styles.registerLink} onPress={() => { props.navigation.navigate('Login') }}> Login Now</Text>
                                </Text>
                            </View>

                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
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
        marginBottom: 40,
    },
    logo: {
        height: 80,
        width: 200,
    },
    welcomeTitle: {
        fontFamily: FONTS.BROTHER_1816_BOLD,
        fontSize: 24,
        color: COLORS.black,
        marginBottom: 10,
        lineHeight: 32,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputField: {
        marginTop: 16,
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
        fontFamily: FONTS.BROTHER_1816_REGULAR,
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
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        fontSize: 14,
        color: COLORS.black,
    },
    registerLink: {
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        color: COLORS.purple,
    },
});
export default Signup;