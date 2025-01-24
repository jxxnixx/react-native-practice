import React from 'react';
import { View, StyleSheet } from 'react-native';

const CatBox = () => {
  return (
    <View style={styles.catboxContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.catbox}></View>
        <View style={styles.catbox}></View>
        <View style={styles.catbox}></View>
        <View style={styles.catbox}></View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.catbox}></View>
        <View style={styles.catbox2}></View>
        <View style={styles.catbox}></View>
        <View style={styles.catbox2}></View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.catbox2}></View>
        <View style={styles.catbox}></View>
        <View style={styles.catbox3}></View>
        <View style={styles.catbox2}></View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.catbox}></View>
        <View style={styles.catbox}></View>
        <View style={styles.catbox}></View>
        <View style={styles.catbox3}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  catboxContainer: {
    display: 'flex',
    width: 800,
    height: 800,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'skyblue',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 10,

    width: '100%',
  },
  catbox: {
    flex: 1,

    backgroundColor: 'skyblue',

    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  catbox2: {
    flex: 2,

    backgroundColor: 'steelblue',

    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  catbox3: {
    flex: 3,

    backgroundColor: 'navy',

    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
});

export default CatBox;
