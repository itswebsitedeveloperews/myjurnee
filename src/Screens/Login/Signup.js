import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, Platform, Alert } from 'react-native'
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

const Signup = props => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        }

        setIsLoading(true);

        dispatch(RegisterUser({
            username: username,
            email: email,
            password: password,
            onSuccess: (response) => {
                setIsLoading(false);
                Alert.alert('Success', 'Account created successfully!', [
                    {
                        text: 'OK',
                        onPress: () => props.navigation.navigate('Login')
                    }
                ]);
            },
            onFailure: (errorMessage) => {
                setIsLoading(false);
                Alert.alert('Registration Failed', errorMessage || 'Something went wrong. Please try again.');
            }
        }));
    };

    return (
        <SafeAreaView style={safeAreaStyle}>
            <FastImage source={IMAGES.LOGIN_BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" />

            <View style={{ paddingHorizontal: 20, }}>
                <INavBar title="" onBackPress={() => props.navigation.goBack()} />
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Create an account</Text>
            </View>
            <View style={styles.contentContainer}>
                <ITextField
                    placeholder="Username"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    mainViewStyle={styles.inputField}
                    leftIcon={IMAGES.IC_USER_PROFILE}
                />
                <ITextField
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    mainViewStyle={styles.inputField}
                    leftIcon={IMAGES.IC_USER_PROFILE}
                />
                <ITextField
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    mainViewStyle={styles.inputField}
                    leftIcon={IMAGES.IC_LOCK}
                />
            </View>

            <View style={styles.buttonContainer}>
                <IButton
                    title={isLoading ? "Creating Account..." : "Create Account"}
                    onPress={onSignupClick}
                    mainViewStyle={styles.signupButton}
                    loading={isLoading}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // width: '100%',
        // height: '100%',
    },
    titleContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    title: {
        fontFamily: FONTS.OUTFIT_MEDIUM,
        fontSize: 35,
        color: COLORS.textColor,
    },
    contentContainer: {
        flex: 1,
        maxHeight: windowHeight * 0.3,
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    inputField: {
        flex: 1,
        maxHeight: 48,
        marginBottom: 16,
        backgroundColor: COLORS.white,
        borderWidth: 0
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginTop: 0,
    },
    signupButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 10,
        height: 48,
    },
});
export default Signup;