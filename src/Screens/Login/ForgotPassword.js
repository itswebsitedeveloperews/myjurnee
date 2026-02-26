import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';
import { COLORS } from '../../Common/Constants/colors';
import INavBar from '../Components/INavBar';
import { FONTS } from '../../Common/Constants/fonts';
import ITextField from '../Components/ITextField';
import { windowHeight } from '../../Utils/Dimentions';
import IButton from '../Components/IButton';
import { useDispatch } from 'react-redux';
import { ForgotPasswordAction, VerifyResetCodeAction } from '../../redux/auth/authActions';

const ForgotPassword = props => {

    const defaultErrorState = {
        email: {
            hasError: false,
            errorText: ''
        },
        otp: {
            hasError: false,
            errorText: ''
        }
    }

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState(defaultErrorState);
    const [emailResponse, setEmailResponse] = useState(null);
    const dispatch = useDispatch();

    const onChangeEmail = (text) => {
        setErrorState({ ...errorState, email: { hasError: false, errorText: '' } })
        setEmail(text)
    }

    const onChangeOtp = (text) => {
        setErrorState({ ...errorState, otp: { hasError: false, errorText: '' } })
        setOtp(text)
    }

    const handleError = (error, field = 'email') => {
        if (field === 'otp') {
            setErrorState({ ...errorState, otp: { hasError: true, errorText: error || 'OTP error.' } })
        } else {
            setErrorState({ ...errorState, email: { hasError: true, errorText: error || 'Email error.' } })
        }
    }

    const onSubmit = () => {

        // props.navigation.navigate('ResetPassword');
        // return;
        if (!email) {
            setErrorState({ ...errorState, email: { hasError: true, errorText: 'Please enter email address' } })
            return;
        }
        // if (!otp) {
        //     setErrorState({ ...errorState, otp: { hasError: true, errorText: 'Please enter OTP' } })
        //     return;
        // }

        setIsLoading(true);

        dispatch(ForgotPasswordAction({
            email: email,
            onSuccess: (response) => {
                setIsLoading(false);
                setShowOtpField(true);
                setEmailResponse(response);
            },
            onFailure: (error) => {
                setIsLoading(false);
                handleError(error);
                // Alert.alert('Link share Failed', errorMessage || 'Something went wrong. Please try again.');
            }
        }));
    }

    const onOtpSubmit = () => {
        if (!otp) {
            setErrorState({ ...errorState, otp: { hasError: true, errorText: 'Please enter OTP' } })
            return;
        }

        setIsLoading(true);

        dispatch(VerifyResetCodeAction({
            email: email,
            code: otp,
            onSuccess: (response) => {
                setIsLoading(false);
                // Navigate to ResetPassword screen on successful OTP verification
                props.navigation.navigate('ResetPassword', { email: email, code: otp });
            },
            onFailure: (error) => {
                setIsLoading(false);
                handleError(error, 'otp');
            }
        }));
    }


    return (
        <SafeAreaView style={safeAreaStyle}>
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

                        <View style={styles.contentContainer}>
                            <View style={styles.navBarContainer}>
                                <INavBar title="" onBackPress={() => props.navigation.goBack()} />
                            </View>
                            <View style={styles.formContainer}>
                                <Text style={styles.title}>Forgot Password?</Text>
                                <Text style={styles.description}>Enter your email address and we'll {"\n"}send instructions to reset your password.</Text>
                                <View style={styles.inputContainer}>
                                    <ITextField
                                        placeholder="Email Address"
                                        value={email}
                                        onChangeText={text => onChangeEmail(text)}
                                        placeholderTextColor={COLORS.textColor64}
                                        mainViewStyle={styles.inputField}
                                        hasError={errorState.email.hasError}
                                        errorText={errorState.email.errorText}
                                    />
                                </View>
                                {showOtpField && <View style={{ ...styles.inputContainer, marginTop: 5 }}>
                                    <ITextField
                                        placeholder="Enter OTP"
                                        value={otp}
                                        keyboardType="numeric"
                                        onChangeText={text => onChangeOtp(text)}
                                        placeholderTextColor={COLORS.textColor64}
                                        mainViewStyle={styles.inputField}
                                        hasError={errorState.otp.hasError}
                                        errorText={errorState.otp.errorText}
                                    />
                                </View>}
                                <View style={styles.buttonContainer}>
                                    <IButton
                                        title={
                                            isLoading
                                                ? (showOtpField ? "Verifying OTP..." : "Submitting Account...")
                                                : (showOtpField ? "Verify OTP" : "Submit")
                                        }
                                        loading={isLoading}
                                        onPress={() => {
                                            if (showOtpField) {
                                                // Handle OTP Submit: hit different api for OTP verification/reset-password
                                                onOtpSubmit && onOtpSubmit();
                                            } else {
                                                // Handle Forgot Password (send email for reset)
                                                onSubmit && onSubmit();
                                            }
                                        }}
                                        mainViewStyle={styles.submitButton}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: COLORS.bg_color,
    },
    container: {
        flex: 1,
    },
    navBarContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    contentContainer: {
        flex: 1,
    },
    formContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 20,

        marginTop: windowHeight * -0.08,
    },

    title: {
        fontFamily: FONTS.BROTHER_1816_BOLD,
        fontSize: 30,
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 14,
    },
    description: {
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        fontSize: 14,
        color: COLORS.textColor,
        numberOfLines: 2,
        textAlign: 'center',
        marginBottom: 10,
    },
    inputContainer: {
        // flex: 1,
        // maxHeight: windowHeight * 0.07,
        marginTop: 16,
    },
    inputField: {
        flex: 1,
        maxHeight: 48,
        width: '100%',
        backgroundColor: COLORS.bg_color,
    },
    buttonContainer: {
        marginTop: 30,
        bottom: 20
    },
    submitButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 10,
        height: 48,
    },
});
export default ForgotPassword;