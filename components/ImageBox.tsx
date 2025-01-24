import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  ImageBackground,
  Text,
} from 'react-native';

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

const SquareBox = ({ num, text }: { num: 1 | 2 | 3; text?: string }) => {
  return (
    <View style={styles.imagebox1}>
      <ImageBackground
        source={squareImages[num]}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.boxText}>{text}</Text>
      </ImageBackground>
    </View>
  );
};

const RectangleBox = ({
  ratio,
  num,
  text,
}: {
  ratio: 2 | 3;
  num: 1 | 2 | 3 | 4 | 5 | 6;
  text?: string;
}) => {
  const imageBoxStyles = ratio === 2 ? styles.imagebox2 : styles.imagebox3;
  return (
    <View style={imageBoxStyles}>
      <ImageBackground
        source={rectangleImages[num]}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.boxText}>{text}</Text>
      </ImageBackground>
    </View>
  );
};

const ImageBox = () => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.imageboxContainer}
      showsVerticalScrollIndicator={true}
    >
      {/* 첫 번째 Row */}
      <View style={styles.rowContainer}>
        <SquareBox num={1} text="F1 S1" />
        <SquareBox num={2} text="F1 S2" />
        <SquareBox num={3} text="F1 S3" />
        <SquareBox num={1} text="F1 S1" />
        <SquareBox num={2} text="F1 S2" />
        <SquareBox num={3} text="F1 S3" />
        <SquareBox num={1} text="F1 S1" />
        <SquareBox num={2} text="F1 S2" />
        <SquareBox num={3} text="F1 S3" />
        <SquareBox num={1} text="F1 S1" />
        <SquareBox num={2} text="F1 S2" />
        <SquareBox num={3} text="F1 S3" />
      </View>

      {/* 두 번째 Row */}
      <View style={styles.rowContainer}>
        <SquareBox num={3} text="F1 S3" />
        <RectangleBox ratio={2} num={1} text="F2 R1" />
        <SquareBox num={2} text="F1 S2" />
        <RectangleBox ratio={2} num={2} text="F2 R2" />
      </View>

      {/* 세 번째 Row */}
      <View style={styles.rowContainer}>
        <RectangleBox ratio={2} num={2} text="F2 R2" />
        <SquareBox num={2} text="F1 S2" />
        <RectangleBox ratio={3} num={5} text="F3 R5" />
        <RectangleBox ratio={2} num={3} text="F2 R3" />
      </View>

      {/* 네 번째 Row */}
      <View style={styles.rowContainer}>
        <SquareBox num={2} text="F1 S2" />
        <SquareBox num={3} text="F1 S3" />
        <SquareBox num={2} text="F1 S2" />
        <RectangleBox ratio={3} num={5} text="F3 R5" />
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
    flexGrow: 1,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    minHeight: Platform.OS === 'web' ? 200 : 50,
  },
  imagebox1: {
    flex: 1,
    marginHorizontal: 5, // 요소 간의 간격 조절
  },
  imagebox2: {
    flex: 2,
    marginHorizontal: 5,
  },
  imagebox3: {
    flex: 3,
    marginHorizontal: 5,
  },
  image: {
    width: '100%',
    height: '100%',

    padding: 8,
  },
  imageStyle: {
    borderRadius: 10,
  },
  boxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageBox;
