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
    backgroundColor: COLORS.purple,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  title: {
    fontFamily: FONTS.OUTFIT_SEMIBOLD,
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 22,
  },
});
