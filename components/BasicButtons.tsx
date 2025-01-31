import React from 'react';
import { Alert, Button, Platform, StyleSheet, View } from 'react-native';

const BasicButtons = () => {
  const onPress = () => {
    if (Platform.OS === 'web') {
      window.alert('You clicked the button on web!');
    } else {
      Alert.alert('You tapped the button on mobile!');
    }
  };

  const onPress2 = () => {
    if (Platform.OS === 'web') {
      window.alert('You clicked the button 2 on web!');
    } else {
      Alert.alert('You tapped the button 2 on mobile!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="Press Me" color="lightpink" />
        <Button onPress={onPress2} title="Press Me 2" color="lightblue" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 100,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20,
    gap: 10,
  },
});

export default BasicButtons;
