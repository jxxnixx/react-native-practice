import React from 'react';
import { Text, Platform } from 'react-native';

const AOSComp = () => {
  if (Platform.Version === 25) {
    console.log('Android version : 25');
  }

  return <Text style={{ padding: 10 }}>Platform : Android</Text>;
};

export default AOSComp;
