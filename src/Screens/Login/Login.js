import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { safeAreaStyle } from '../../Common/CommonStyles';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import IButton from '../Components/IButton';
import ITextField from '../Components/ITextField';
import { JWTLogin } from '../../redux/auth/authActions';

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onLogin = () => {
    if (!username) {
      Alert.alert('Error', 'Please enter username or email');
      return;
    } else if (!password) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    setLoading(true);

    dispatch(JWTLogin({
      username: username,
      password: password,
      onSuccess: (response) => {
        setLoading(false);
        console.log('Login successful:', response);
        // Navigate to dashboard or next screen
        props.navigation.replace('DashboardStack');
      },
      onFailure: (error) => {
        setLoading(false);
        console.log('Login failed:', error);
        Alert.alert('Login Failed', error || 'Invalid credentials. Please try again.');
      }
    }));
  };

  const onContinueWithoutLogin = () => {
    // Navigate to dashboard without login
    props.navigation.replace('DashboardStack');
  };

  const onSignUp = () => {
    // Navigate to sign up screen
    props.navigation.navigate('Signup');
  };

  const onForgotPassword = () => {
    // Navigate to forgot password screen
    props.navigation.navigate('ForgotPassword');
  };

  return (
    <ImageBackground source={IMAGES.LOGIN_BG_IMAGE} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            {/* Content */}
            <View style={styles.contentContainer}>
              {/* Logo and Tagline */}
              <View style={styles.logoContainer}>
                <FastImage
                  source={IMAGES.HOME_SCREEN_LOGO_V1}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Sign In Title */}
              <Text style={styles.signInTitle}>Sign in</Text>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <ITextField
                  placeholder="Username or email"
                  value={username}
                  onChangeText={setUsername}
                  leftIcon={IMAGES.IC_USER_PROFILE}
                  mainViewStyle={styles.inputField}
                />

                <ITextField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  leftIcon={IMAGES.IC_LOCK}
                  rightIcon={showPassword ? IMAGES.IC_EYE : IMAGES.IC_EYE_OFF}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  mainViewStyle={[styles.inputField, styles.passwordField]}
                />

                <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <View style={styles.buttonContainer}>
                <IButton
                  title="Login"
                  onPress={onLogin}
                  loading={loading}
                  mainViewStyle={styles.loginButton}
                />
              </View>

              {/* Continue without login */}
              <TouchableOpacity onPress={onContinueWithoutLogin} style={styles.continueWithoutLoginContainer}>
                <FastImage
                  source={IMAGES.IC_USER_PROFILE}
                  style={styles.continueIcon}
                  resizeMode="contain"
                />
                <Text style={styles.continueWithoutLoginText}>Continue without logging in</Text>
                <Image
                  source={IMAGES.IC_ARROW_RIGHT_CHEVRON}
                  style={styles.continueArrow}
                  resizeMode="contain"
                  tintColor={COLORS.textColor}
                />
              </TouchableOpacity>


              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                  Don't have an account? <Text style={styles.signUpLink} onPress={onSignUp}>Sign Up →</Text>
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    // justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 90,
  },
  logo: {
    height: 60,
    width: 200,
  },
  tagline: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    color: COLORS.textColor,
    marginTop: 8,
  },
  signInTitle: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    fontSize: 30,
    marginTop: 30,
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputField: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderWidth: 0
  },
  passwordField: {
    marginBottom: 8,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    color: COLORS.textColor64,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#8B5CF6', // Purple color from design
    borderRadius: 10,
    height: 48,
  },
  continueWithoutLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingVertical: 12,
  },
  continueIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
  },
  continueWithoutLoginText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 16,
    color: COLORS.textColor,
    marginRight: 8,
  },
  continueArrow: {
    height: 16,
    width: 16,
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 14,
    color: COLORS.textColor,
  },
  signUpLink: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    color: COLORS.textColor,
  },
});
