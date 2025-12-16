import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { safeAreaStyle } from '../../Common/CommonStyles';
import FastImage from 'react-native-fast-image';
import { IMAGES } from '../../Common/Constants/images';
import { COLORS } from '../../Common/Constants/colors';
import INavBar from '../Components/INavBar';
import { FONTS } from '../../Common/Constants/fonts';
import ITextField from '../Components/ITextField';
import { windowHeight } from '../../Utils/Dimentions';
import IButton from '../Components/IButton';
import { useDispatch } from 'react-redux';
import { ForgotPasswordAction } from '../../redux/auth/authActions';

const ForgotPassword = props => {

    const defaultErrorState = {
        email: {
            hasError: false,
            errorText: ''
        }
    }

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState(defaultErrorState);
    const dispatch = useDispatch();

    const onChangeEmail = (text) => {
        setErrorState({ ...errorState, email: { hasError: false, errorText: '' } })
        setEmail(text)
    }

    const handleError = (error) => {
        setErrorState({ ...errorState, email: { hasError: true, errorText: error || 'Email error.' } })
    }

    const onSubmit = () => {
        if (!email) {
            setErrorState({ ...errorState, email: { hasError: true, errorText: 'Please enter email address' } })
            return;
        }

        setIsLoading(true);

        dispatch(ForgotPasswordAction({
            email: email,
            onSuccess: (response) => {
                setIsLoading(false);
                Alert.alert('Success', response?.message ?? 'Link shared successfully!', [
                    {
                        text: 'OK',
                        onPress: () => props.navigation.navigate('Login')
                    }
                ]);
            },
            onFailure: (error) => {
                setIsLoading(false);
                handleError(error);
                // Alert.alert('Link share Failed', errorMessage || 'Something went wrong. Please try again.');
            }
        }));
    }
    return (
        <SafeAreaView style={safeAreaStyle}>
            {/* <FastImage source={IMAGES.LOGIN_BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" /> */}
            <View style={{ paddingHorizontal: 20, }}>
                <INavBar title="" onBackPress={() => props.navigation.goBack()} />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.description}>Enter your email address and we'll {"\n"}send instructions to reset your password.</Text>
                <View style={styles.inputContainer}>
                    <ITextField
                        placeholder="Email Address"
                        value={email}
                        onChangeText={text => onChangeEmail(text)}
                        mainViewStyle={styles.inputField}
                        hasError={errorState.email.hasError}
                        errorText={errorState.email.errorText}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        flex: 1,
        maxHeight: windowHeight * 0.07,
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
export default ForgotPassword;