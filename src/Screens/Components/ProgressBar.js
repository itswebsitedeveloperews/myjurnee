import React from 'react';

import {View} from 'react-native';

const ProgressBar = ({
  navigation,
  percentage,
  height,
  backgroundColor,
  completedColor,
}) => {
  const backgroundStyle = {
    width: '100%',
    height: height,
    borderRadius: 8,
    backgroundColor: backgroundColor,
  };
  const innetLineStyle = {
    width: percentage ? percentage : 0,
    height: height,
    borderRadius: 8,
    backgroundColor: completedColor,
    position: 'absolute',
  };
  return (
    <View>
      <View style={{justifyContent: 'center'}}>
        <View style={backgroundStyle} />
        <View style={innetLineStyle} />
      </View>
    </View>
  );
};
export default ProgressBar;
