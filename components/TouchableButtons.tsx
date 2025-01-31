import React from 'react';
import {
  Alert,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

const TouchableButtons = () => {
  const onPress = () => {
    if (Platform.OS === 'web') {
      window.alert('You tapped the button!');
    } else {
      Alert.alert('You tapped the button!');
    }
  };

  const onLongPress = () => {
    if (Platform.OS === 'web') {
      window.alert('You LONG pressed the button!');
    } else {
      Alert.alert('You LONG pressed the button!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={onPress} underlayColor={'magenta'}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableHighlight</Text>
        </View>
      </TouchableHighlight>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableOpacity</Text>
        </View>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            TouchableWithoutFeedback
            {Platform.OS === 'android' ? ' (Android)' : ' (Android Only)'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableNativeFeedback</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableHighlight
        onPress={onPress}
        onLongPress={onLongPress}
        underlayColor={'mediumblue'}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableHighlight</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'mediumpurple',
    borderRadius: 4,
    marginBlock: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'lavender',
  },
});

export default TouchableButtons;
