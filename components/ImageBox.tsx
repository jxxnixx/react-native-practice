import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Image } from 'react-native';

const squareImages = {
  1: require('@/assets/images/square/square1.webp'),
  2: require('@/assets/images/square/square2.webp'),
  3: require('@/assets/images/square/square3.webp'),
} as const;

const rectangleImages = {
  1: require('@/assets/images/rectangle/rectangle1.webp'),
  2: require('@/assets/images/rectangle/rectangle2.webp'),
  3: require('@/assets/images/rectangle/rectangle3.webp'),
  4: require('@/assets/images/rectangle/rectangle4.webp'),
  5: require('@/assets/images/rectangle/rectangle5.webp'),
  6: require('@/assets/images/rectangle/rectangle6.webp'),
} as const;

const SquareBox = ({ num }: { num: 1 | 2 | 3 }) => {
  return (
    <View style={styles.imagebox1}>
      <Image source={squareImages[num]} style={styles.image} />
    </View>
  );
};

const RectangleBox = ({
  ratio,
  num,
}: {
  ratio: 2 | 3;
  num: 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  const imageBoxStyles = ratio === 2 ? styles.imagebox2 : styles.imagebox3;
  return (
    <View style={imageBoxStyles}>
      <Image source={rectangleImages[num]} style={styles.image} />
    </View>
  );
};

const ImageBox = () => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.imageboxContainer}
      showsVerticalScrollIndicator
    >
      <View style={styles.rowContainer}>
        <SquareBox num={1} />
        <SquareBox num={2} />
        <SquareBox num={3} />
        <SquareBox num={1} />
        <SquareBox num={2} />
        <SquareBox num={3} />
        <SquareBox num={1} />
        <SquareBox num={2} />
        <SquareBox num={3} />
        <SquareBox num={1} />
        <SquareBox num={2} />
        <SquareBox num={3} />
      </View>
      <View style={styles.rowContainer}>
        <SquareBox num={3} />
        <RectangleBox ratio={2} num={1} />
        <SquareBox num={2} />
        <RectangleBox ratio={2} num={2} />
      </View>
      <View style={styles.rowContainer}>
        <RectangleBox ratio={2} num={2} />
        <SquareBox num={2} />
        <RectangleBox ratio={3} num={5} />
        <RectangleBox ratio={2} num={3} />
      </View>
      <View style={styles.rowContainer}>
        <SquareBox num={2} />
        <SquareBox num={3} />
        <SquareBox num={2} />
        <RectangleBox ratio={3} num={5} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  imageboxContainer: {
    flex: 1,
    height: 800,
    padding: 10,
    // backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  rowContainer: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    minHeight: Platform.OS === 'web' ? 200 : 50,
  },
  imagebox1: {
    flex: 1,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginInline: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagebox2: {
    flex: 2,
    backgroundColor: 'steelblue',
    borderRadius: 10,
    marginInline: 5,
  },
  imagebox3: {
    flex: 3,
    backgroundColor: 'navy',
    borderRadius: 10,
    marginInline: 5,
  },
});

export default ImageBox;
