import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  ImageBackground,
  Text,
  Animated,
  Pressable,
  Easing,
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const rectangleImages = {
  1: require('@/assets/images/rectangle/rectangle1.webp'),
  2: require('@/assets/images/rectangle/rectangle2.webp'),
  3: require('@/assets/images/rectangle/rectangle3.webp'),
  4: require('@/assets/images/rectangle/rectangle4.webp'),
  5: require('@/assets/images/rectangle/rectangle5.webp'),
  6: require('@/assets/images/rectangle/rectangle6.webp'),
  7: require('@/assets/images/rectangle/rectangle7.webp'),
  8: require('@/assets/images/rectangle/rectangle8.webp'),
  9: require('@/assets/images/rectangle/rectangle9.webp'),
} as const;

// 현재 확대된 이미지의 ID를 추적하는 전역 변수
let currentScaledImageId: string | null = null;

const FlippableImage = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const isFlipping = useRef(false);
  const stopAnimationInProgress = useRef<Animated.CompositeAnimation | null>(
    null
  );

  const resetToFront = (currentValue: number) => {
    // 현재 회전 값(0~1)을 기준으로 가장 빠른 방향 결정
    const toValue = currentValue > 0.5 ? 1 : 0;
    const duration =
      currentValue > 0.5
        ? 300 * (1 - currentValue) // 1로 갈 때
        : 300 * currentValue; // 0으로 갈 때

    Animated.timing(spinValue, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 1) {
        // 1에 도달하면 즉시 0으로 리셋
        spinValue.setValue(0);
      }
    });
  };

  const handlePressIn = () => {
    // 현재 회전 값 확인
    spinValue.stopAnimation((value) => {
      resetToFront(value);
    });

    if (currentScaledImageId === id) {
      // 현재 이미지 축소
      currentScaledImageId = null;
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (currentScaledImageId !== null) {
      // 다른 FlippableImage 인스턴스들에게 리셋 신호를 보내기 위한 이벤트
      const event = new CustomEvent('resetImage', {
        detail: currentScaledImageId,
      });
      window.dispatchEvent(event);
    }

    // 현재 이미지 확대
    currentScaledImageId = id;

    Animated.spring(scaleValue, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const handleResetImage = (event: any) => {
      if (event.detail === id) {
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    };

    if (isWeb) {
      window.addEventListener('resetImage', handleResetImage);
      return () => window.removeEventListener('resetImage', handleResetImage);
    }
  }, [id]);

  const startFlipping = () => {
    if (currentScaledImageId !== null) return; // 어떤 이미지든 확대 상태면 회전 금지

    if (stopAnimationInProgress.current) {
      // 정지 애니메이션이 진행 중이면 완료될 때까지 기다린 후 회전 시작
      stopAnimationInProgress.current.stop();

      spinValue.stopAnimation((value) => {
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 800 * ((1 - value) / 0.5),
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.loop(
            Animated.sequence([
              Animated.timing(spinValue, {
                toValue: 1,
                duration: 1600,
                easing: Easing.ease,
                useNativeDriver: true,
              }),

              Animated.timing(spinValue, {
                toValue: 0,
                duration: 0,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      });
    } else {
      isFlipping.current = true;

      Animated.loop(
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),

          Animated.timing(spinValue, {
            toValue: 0,
            duration: 0,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  const stopFlipping = () => {
    if (currentScaledImageId === id) return; // 클릭된 상태면 stop animation 실행하지 않음

    isFlipping.current = false;

    spinValue.stopAnimation((value) => {
      const stopAnimation = Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 800 * ((1 - value) / 0.5),
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(spinValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]);

      stopAnimationInProgress.current = stopAnimation;

      stopAnimation.start(() => {
        stopAnimationInProgress.current = null;
      });
    });
  };

  const handleMouseLeave = () => {
    if (currentScaledImageId === id) {
      // 현재 확대된 이미지에서 마우스가 벗어나면 scale만 1로 복귀
      currentScaledImageId = null;

      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable
      onHoverIn={
        isWeb && currentScaledImageId !== id ? startFlipping : undefined
      }
      onHoverOut={
        isWeb && currentScaledImageId !== id ? stopFlipping : undefined
      }
      onPress={isWeb ? handlePressIn : startFlipping}
      onPressOut={isWeb ? undefined : stopFlipping}
      onLongPress={!isWeb ? handlePressIn : undefined}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Animated.View
        style={[
          styles.flipContainer,
          {
            transform: [
              { perspective: 1000 },
              { rotateY: spin },
              { scale: scaleValue },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

interface BoxProps {
  row?: number;
  [key: string]: any;
}

const Row = ({
  children,
  row,
}: {
  children: React.ReactElement<BoxProps>[];
  row: number;
}) => (
  <View style={styles.rowContainer}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { row })
    )}
  </View>
);

interface RectangleBoxProps {
  ratio: 1 | 2 | 3;
  num: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  text?: string;
  row?: number;
}

const RectangleBox = ({ ratio, num, text, row }: RectangleBoxProps) => {
  const id = `rectangle-${ratio}-${num}-${row}-${
    Platform.OS === 'web'
      ? uuidv4()
      : Math.random().toString(36).substring(2, 15)
  }`;

  const imageBoxStyles =
    ratio === 1
      ? styles.imagebox1
      : ratio === 2
      ? styles.imagebox2
      : styles.imagebox3;

  const realText = text ? text : `F${ratio} R${num}`;

  return (
    <View style={imageBoxStyles}>
      <FlippableImage id={id}>
        <ImageBackground
          source={rectangleImages[num]}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <Text style={styles.boxText}>{realText}</Text>
        </ImageBackground>
      </FlippableImage>
    </View>
  );
};

const rowData = [
  // row 1
  [
    { ratio: 1, num: 7 },
    { ratio: 1, num: 8 },
    { ratio: 1, num: 9 },
    { ratio: 1, num: 7 },
    { ratio: 1, num: 8 },
    { ratio: 1, num: 9 },
    { ratio: 1, num: 7 },
    { ratio: 1, num: 8 },
    { ratio: 1, num: 9 },
    { ratio: 1, num: 7 },
    { ratio: 1, num: 8 },
    { ratio: 1, num: 9 },
  ],
  // row 2
  [
    { ratio: 1, num: 9 },
    { ratio: 2, num: 1 },
    { ratio: 1, num: 8 },
    { ratio: 2, num: 2 },
  ],
  // row 3
  [
    { ratio: 2, num: 2 },
    { ratio: 1, num: 8 },
    { ratio: 3, num: 5 },
    { ratio: 2, num: 3 },
  ],
  // row 4
  [
    { ratio: 3, num: 6 },
    { ratio: 1, num: 8 },
    { ratio: 1, num: 7 },
    { ratio: 1, num: 9 },
  ],
  // row 5
  [
    { ratio: 2, num: 1 },
    { ratio: 3, num: 5 },
    { ratio: 2, num: 1 },
    { ratio: 3, num: 5 },
  ],
] as const;

const AnimationImageBox = () => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.imageboxContainer}
      showsVerticalScrollIndicator={true}
    >
      {rowData.map((row, rowIndex) => (
        <Row key={rowIndex} row={rowIndex + 1}>
          {row.map((box, boxIndex) => (
            <RectangleBox
              key={boxIndex}
              ratio={box.ratio as 1 | 2 | 3}
              num={box.num as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
            />
          ))}
        </Row>
      ))}
    </ScrollView>
  );
};

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  imageboxContainer: {
    flexGrow: 1,
    width: '100%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  imagebox1: {
    flex: 1,
    marginHorizontal: isWeb ? 5 : 2,
  },
  imagebox2: {
    flex: 2,
    marginHorizontal: isWeb ? 5 : 2,
  },
  imagebox3: {
    flex: 3,
    marginHorizontal: isWeb ? 5 : 2,
  },
  image: {
    width: '100%',
    height: '100%',

    padding: isWeb ? 8 : 2,
  },
  imageStyle: {
    borderRadius: isWeb ? 10 : 6,
  },
  boxText: {
    color: 'white',
    fontSize: isWeb ? 16 : 12,
    fontWeight: isWeb ? 'bold' : 'normal',
  },
  flipContainer: {
    width: '100%',
    height: '100%',
    // backfaceVisibility: 'hidden',
  },
});

export default AnimationImageBox;
