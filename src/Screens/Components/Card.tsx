import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FONTS } from '../../Common/Constants/fonts';
import { COLORS } from '../../Common/Constants/colors';

interface CardProps {
  title: string;
  subtitle: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    minHeight: 80,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.URBANIST_BOLD,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.URBANIST_MEDIUM,
    color: COLORS.black,
  },
});

export default Card;
