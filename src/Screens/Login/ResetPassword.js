import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
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
import { ResetPasswordAction } from '../../redux/auth/authActions';
import Snackbar from '../Components/Snackbar';

const ResetPassword = props => {

    const defaultErrorState = {
        newPassword: {
            hasError: false,
            errorText: ''
        },
        confirmPassword: {
            hasError: false,
            errorText: ''
        }
    }

    const email = props.route?.params?.email || '';
    const code = props.route?.params?.code || '';
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState(defaultErrorState);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const dispatch = useDispatch();

    const onChangeNewPassword = (text) => {
        setErrorState({ ...errorState, newPassword: { hasError: false, errorText: '' } })
        setNewPassword(text)
    }

    const onChangeConfirmPassword = (text) => {
        setErrorState({ ...errorState, confirmPassword: { hasError: false, errorText: '' } })
        setConfirmPassword(text)
    }

    const handleError = (error, field = 'newPassword') => {
        if (field === 'confirmPassword') {
            setErrorState({ ...errorState, confirmPassword: { hasError: true, errorText: error || 'Confirm password error.' } })
        } else {
            setErrorState({ ...errorState, newPassword: { hasError: true, errorText: error || 'New password error.' } })
        }
    }

    const onSubmit = () => {
        if (!newPassword) {
            setErrorState({ ...errorState, newPassword: { hasError: true, errorText: 'Please enter new password' } })
            return;
        }
        if (!confirmPassword) {
            setErrorState({ ...errorState, confirmPassword: { hasError: true, errorText: 'Please enter confirm password' } })
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorState({ ...errorState, confirmPassword: { hasError: true, errorText: 'Password does not match' } })
            return;
        }

        setIsLoading(true);

        dispatch(ResetPasswordAction({
            email: email,
            code: code,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            onSuccess: (response) => {
                setIsLoading(false);
                setShowSnackbar(true);
                // Navigate to login screen automatically after a short delay
                setTimeout(() => {
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }, 2000);
            },
            onFailure: (error) => {
                setIsLoading(false);
                handleError(error);
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
                        <View style={styles.navBarContainer}>
                            <INavBar title="" onBackPress={() => props.navigation.goBack()} />
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={styles.formContainer}>
                                <Text style={styles.title}>Reset Password</Text>
                                <Text style={styles.description}>Enter your new password below.</Text>
                                <View style={styles.inputContainer}>
                                    <ITextField
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChangeText={text => onChangeNewPassword(text)}
                                        secureTextEntry={!showNewPassword}
                                        placeholderTextColor={COLORS.textColor64}
                                        rightIcon={showNewPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                                        onRightIconPress={() => setShowNewPassword(!showNewPassword)}
                                        mainViewStyle={styles.inputField}
                                        hasError={errorState.newPassword.hasError}
                                        errorText={errorState.newPassword.errorText}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={{ ...styles.inputContainer, marginTop: 5 }}>
                                    <ITextField
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChangeText={text => onChangeConfirmPassword(text)}
                                        secureTextEntry={!showConfirmPassword}
                                        placeholderTextColor={COLORS.textColor64}
                                        rightIcon={showConfirmPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                                        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        hasError={errorState.confirmPassword.hasError}
                                        errorText={errorState.confirmPassword.errorText}
                                        mainViewStyle={styles.inputField}
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <IButton
                                        title={isLoading ? "Submitting Account..." : "Submit"}
                                        loading={isLoading}
                                        onPress={onSubmit}
                                        mainViewStyle={styles.submitButton}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
            <Snackbar
                visible={showSnackbar}
                message="Password **successfully** reset. Please login with your new password."
                type="success"
                duration={2500}
                onDismiss={() => setShowSnackbar(false)}
                position="bottom"
            />
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
    contentContainer: {
        flex: 1,
    },
    navBarContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    formContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 20,
        marginTop: windowHeight * -0.06,
    },
    title: {
        fontFamily: FONTS.BROTHER_1816_MEDIUM,
        fontSize: 30,
        color: COLORS.textColor,
        textAlign: 'center',
    },
    description: {
        fontFamily: FONTS.BROTHER_1816_REGULAR,
        fontSize: 14,
        color: COLORS.textColor,
        numberOfLines: 2,
        textAlign: 'center',

    },
    inputContainer: {
        // flex: 1,
        // maxHeight: windowHeight * 0.07,
        marginTop: 30,
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
export default ResetPassword;