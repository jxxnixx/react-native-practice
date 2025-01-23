import React from 'react';
import { Platform, Text } from 'react-native';

const IOSComp = () => {
  const majorVersionIOS = parseInt(Platform.Version.toString(), 10);

  if (majorVersionIOS <= 9) {
    console.log('IOS version : 9 이하');
  }

  return <Text style={{ padding: 10 }}>Platform : IOS</Text>;
};

export default IOSComp;
