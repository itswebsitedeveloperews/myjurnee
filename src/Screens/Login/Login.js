import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';
import { IMAGES } from '../../Common/Constants/images';
import IButton from '../Components/IButton';
import ITextField from '../Components/ITextField';
import { JWTLogin } from '../../redux/auth/authActions';

const Login = props => {
  const [username, setUsername] = useState(__DEV__ ? 'educatebystw' : '');
  const [password, setPassword] = useState(__DEV__ ? 'a$ipMwVbGYseEhEz$C' : '');
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


  const onSignUp = () => {
    // Navigate to sign up screen
    props.navigation.navigate('Signup');
  };

  const onForgotPassword = () => {
    // Navigate to forgot password screen
    props.navigation.navigate('ForgotPassword');
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
              <Text style={styles.welcomeTitle}>{`Welcome Back! Glad To\nSee You, Again!`}</Text>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <ITextField
                  placeholder="Enter your email"
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  backgroundColor={COLORS.darkGray}
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
                  backgroundColor={COLORS.darkGray}
                  placeholderTextColor={COLORS.textColor64}
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
              <View style={{ height: '22%' }} />
              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Don't have an account? <Text style={styles.registerLink} onPress={onSignUp}>Register Now</Text>
                </Text>
              </View>

            </View>

          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

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
    marginTop: 60,
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
    color: COLORS.black,
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
