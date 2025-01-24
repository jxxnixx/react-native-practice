import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PlatformColor,
  useColorScheme,
} from 'react-native';

const ColorBox = () => {
  // 라이트, 다크 모드/테마
  const colorScheme = useColorScheme();

  const backgroundColor =
    Platform.OS === 'ios'
      ? colorScheme === 'dark'
        ? 'yellow'
        : '#fdfdfd'
      : 'rgba(255, 255, 255, 0.5)';

  const textColor =
    Platform.OS === 'ios'
      ? colorScheme === 'dark'
        ? 'blue'
        : '#000000'
      : 'rgba(10,100,100,0.75)';

  const borderColor =
    Platform.OS === 'ios'
      ? colorScheme === 'dark'
        ? 'red'
        : 'purple'
      : 'rgb(246,174,254)';

  return (
    <View style={[styles.box, { backgroundColor, borderColor }]}>
      <Text style={[styles.text, { color: textColor }]}>ColorBox</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ColorBox;
