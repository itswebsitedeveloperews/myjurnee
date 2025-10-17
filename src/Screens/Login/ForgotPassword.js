import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
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

const ForgotPassword = props => {
    const [email, setEmail] = useState('');
    const onSubmit = () => {
        if (!email) {
            alert('Please enter email address');
        } else {
            alert('Email address submitted');
        }
    }
    return (
        <SafeAreaView style={safeAreaStyle}>
            <FastImage source={IMAGES.LOGIN_BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" />
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
                        onChangeText={text => setEmail(text)}
                        mainViewStyle={styles.inputField}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <IButton
                        title="Submit"
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
        fontFamily: FONTS.OUTFIT_MEDIUM,
        fontSize: 30,
        color: COLORS.textColor,
        textAlign: 'center',
    },
    description: {
        fontFamily: FONTS.OUTFIT_REGULAR,
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

        backgroundColor: COLORS.white,
        borderWidth: 0
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