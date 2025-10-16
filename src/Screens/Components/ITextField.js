import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../Common/Constants/colors';
import {FONTS} from '../../Common/Constants/fonts';

const ITextField = ({
  mainViewStyle,
  value,
  onChangeText = () => {},
  numberOfLines,
  placeholder,
  keyboardType,
  autoCapitalize,
  maxLength,
  onSubmitEditing,
  multiline = false,
}) => {
  return (
    <View style={[styles.container, mainViewStyle]}>
      <TextInput
        style={styles.inputStyle}
        value={value}
        onChangeText={text => onChangeText(text)}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        // placeholderTextColor={'#999'}
        //   secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        multiline={multiline}
      />
    </View>
  );
};

export default ITextField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderColor: COLORS.textColor64,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.pr_background,
  },
  inputStyle: {
    flex: 1,
    paddingHorizontal: 12,
    fontFamily: FONTS.OUTFIT_REGULAR,
    fontSize: 16,
    color: COLORS.textColor,
  },
});
