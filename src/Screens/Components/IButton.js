import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../Common/Constants/colors';
import { FONTS } from '../../Common/Constants/fonts';

const IButton = ({
  title,
  onPress = () => { },
  customContainer,
  mainViewStyle,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, customContainer, mainViewStyle]}
      disabled={loading}
      onPress={() => onPress()}>
      {loading ? (
        <ActivityIndicator size={'small'} color={COLORS.white} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default IButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.pr_blue,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  title: {
    fontFamily: FONTS.OUTFIT_MEDIUM,
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 22,
  },
});
