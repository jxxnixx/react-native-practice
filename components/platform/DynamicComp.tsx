import React from 'react';
import { Platform } from 'react-native';
import IOSComp from './comps/IOSComp';
import AOSComp from './comps/AOSComp';
import NativeComp from './comps/NativeComp';
import WebComp from './comps/WebComp';

const DynamicComp = Platform.select({
  ios: () => <IOSComp />,
  android: () => <AOSComp />,
  native: () => <NativeComp />,
  default: () => <WebComp />,
});

export default DynamicComp;
